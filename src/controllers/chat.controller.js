const SYSTEM_PROMPT = require('../services/systemPrompt');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * A turn is valid if it has real text content, OR an attached image, or both.
 * (STAGE 6: image-only messages, e.g. just a photo with no caption, are allowed.)
 */
function isValidHistory(messages) {
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every((m) => {
      if (!m || (m.role !== 'user' && m.role !== 'assistant')) return false;
      const hasText = typeof m.content === 'string' && m.content.trim().length > 0;
      const hasImage = typeof m.imageBase64 === 'string' && m.imageBase64.length > 0;
      return hasText || hasImage;
    })
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calls the Gemini API, automatically retrying a couple of times if Google's
 * servers report themselves as temporarily overloaded (503 UNAVAILABLE).
 */
async function callGeminiWithRetry(url, apiKey, payload, maxAttempts = 3) {
  let lastResult = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await geminiResponse.json();

    if (geminiResponse.ok) {
      return { ok: true, data };
    }

    lastResult = { ok: false, status: geminiResponse.status, data };
    console.error(
      `Gemini API error (attempt ${attempt}/${maxAttempts}):`,
      geminiResponse.status,
      JSON.stringify(data)
    );

    const isOverloaded = geminiResponse.status === 503;
    if (isOverloaded && attempt < maxAttempts) {
      await sleep(attempt * 1000);
      continue;
    }
    break;
  }

  return lastResult;
}

/**
 * Builds the Gemini "parts" array for one conversation turn: a text part
 * (if there's real text) and/or an inline_data image part (STAGE 6).
 */
function buildParts(turn) {
  const parts = [];
  if (typeof turn.content === 'string' && turn.content.trim().length > 0) {
    parts.push({ text: turn.content });
  }
  if (typeof turn.imageBase64 === 'string' && turn.imageBase64.length > 0) {
    parts.push({
      inline_data: {
        mime_type: turn.imageMimeType || 'image/jpeg',
        data: turn.imageBase64
      }
    });
  }
  return parts;
}

/**
 * STAGE 6: now also accepts an image attached to the latest user turn
 * (Gemini is multimodal, so this needs no separate vision model or endpoint).
 * Expects: { messages: [{ role, content, imageBase64?, imageMimeType? }, ...] }
 */
exports.sendMessage = async (req, res) => {
  const history = req.body?.messages;

  if (!isValidHistory(history)) {
    return res.status(400).json({
      success: false,
      error: { message: 'A non-empty "messages" array with role/content (or an image) is required.' }
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: { message: "Server isn't configured with an AI API key yet. Add GEMINI_API_KEY to backend/.env." }
    });
  }

  const model = process.env.AI_MODEL || 'gemini-flash-lite-latest';
  const url = `${GEMINI_API_BASE}/${model}:generateContent`;

  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: buildParts(m)
  }));

  try {
    const result = await callGeminiWithRetry(url, apiKey, {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents
    });

    if (!result.ok) {
      const { status, data } = result;

      if (status === 400 && /API key/i.test(data?.error?.message || '')) {
        return res.status(500).json({
          success: false,
          error: { message: 'Invalid AI API key on the server. Check GEMINI_API_KEY in backend/.env.' }
        });
      }
      if (status === 429) {
        return res.status(429).json({
          success: false,
          error: { message: "You've hit the free tier's rate limit. Please wait a bit and try again." }
        });
      }
      if (status === 503) {
        return res.status(503).json({
          success: false,
          error: { message: "SARAA's AI is getting a lot of traffic right now (this is Google's free tier being busy, not your setup). Please try again in a few seconds." }
        });
      }
      return res.status(502).json({
        success: false,
        error: { message: "SARAA's AI service is unavailable right now. Please try again." }
      });
    }

    const parts = result.data?.candidates?.[0]?.content?.parts || [];
    const reply = parts.map((p) => p.text).join('').trim() ||
      "Sorry, I couldn't generate a response. Please try again.";

    res.status(200).json({
      success: true,
      message: { role: 'assistant', content: reply }
    });
  } catch (err) {
    console.error('AI provider error:', err.message);
    res.status(502).json({
      success: false,
      error: { message: "SARAA's AI service is unavailable right now. Please try again." }
    });
  }
};
