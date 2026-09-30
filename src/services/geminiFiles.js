const FormData = require('form-data');

const FILES_UPLOAD_URL = 'https://generativelanguage.googleapis.com/upload/v1beta/files';
const FILES_GET_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Uploads a video (or any large file) to Google's Gemini File API and waits
 * until it finishes processing, then returns its file_uri for use in a
 * generateContent request.
 *
 * Why this exists: unlike small images, videos are usually too big to send
 * inline in a single JSON request — Google's own File API is the supported
 * way to hand Gemini a video. This costs nothing extra beyond the normal
 * free-tier request quota.
 */
async function uploadVideoAndWaitUntilReady(base64Data, mimeType, apiKey) {
  const buffer = Buffer.from(base64Data, 'base64');

  const form = new FormData();
  form.append('metadata', JSON.stringify({ file: { displayName: 'saraa-upload' } }), {
    contentType: 'application/json'
  });
  form.append('file', buffer, {
    filename: 'upload',
    contentType: mimeType || 'video/mp4'
  });

  const uploadResponse = await fetch(`${FILES_UPLOAD_URL}?uploadType=multipart`, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      ...form.getHeaders()
    },
    body: form
  });

  const uploadData = await uploadResponse.json();
  if (!uploadResponse.ok) {
    const message = uploadData?.error?.message || 'Video upload to the AI provider failed.';
    throw new Error(message);
  }

  let file = uploadData.file;

  // Video needs a moment to finish processing on Google's side before it can be used.
  const maxAttempts = 15;
  for (let attempt = 0; attempt < maxAttempts && file.state === 'PROCESSING'; attempt++) {
    await sleep(2000);
    const statusResponse = await fetch(`${FILES_GET_BASE}/${file.name}`, {
      headers: { 'x-goog-api-key': apiKey }
    });
    const statusData = await statusResponse.json();
    if (!statusResponse.ok) {
      throw new Error(statusData?.error?.message || 'Checking video processing status failed.');
    }
    file = statusData;
  }

  if (file.state !== 'ACTIVE') {
    throw new Error('The video took too long to process. Please try a shorter clip.');
  }

  return { fileUri: file.uri, mimeType: file.mimeType || mimeType };
}

module.exports = { uploadVideoAndWaitUntilReady };
