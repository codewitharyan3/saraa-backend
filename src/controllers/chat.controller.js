const SYSTEM_PROMPT = require('../services/systemPrompt');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Only "user"/"assistant" roles with non-empty string content are valid. */
function isValidHistory(messages) {
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calls the Gemini API, automatically retrying a couple of times if Google's
 * servers report themselves as temporarily overloaded (503 UNAVAILABLE).
 * This is a transient, Google-side condition on the free tier — not a bug in
 * our code — so a short retry smooths it over for the user most of the time.
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
      await sleep(attempt * 1000); // wait 1s, then 2s, before retrying
      continue;
    }
    break;
  }

  return lastResult;
}

/**
 * STAGE 4: real AI model connected — Google Gemini (free tier, no credit
 * card required). Expects: { messages: [{ role: "user"|"assistant", content: "..." }, ...] }
 * — the full conversation so far, most recent message last.
 *
 * Uses Node's built-in fetch (Node 18+) so no extra AI SDK dependency is needed.
 */
exports.sendMessage = async (req, res) => {
  const history = req.body?.messages;

  if (!isValidHistory(history)) {
    return res.status(400).json({
      success: false,
      error: { message: 'A non-empty "messages" array with role/content is required.' }
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

  // Gemini uses "user" / "model" roles (not "assistant").
  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
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
