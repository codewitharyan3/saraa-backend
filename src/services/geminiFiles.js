const FILES_UPLOAD_URL = 'https://generativelanguage.googleapis.com/upload/v1beta/files';
const FILES_GET_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Uploads a video (or any large file) to Google's Gemini File API using
 * their two-step "resumable upload" protocol, then waits until it finishes
 * processing, and returns its file_uri for use in a generateContent request.
 *
 * Step 1: tell Google "I'm about to upload N bytes of type X" -> get back a
 *         one-time upload URL.
 * Step 2: PUT/POST the actual bytes to that URL -> get back the file info.
 */
async function uploadVideoAndWaitUntilReady(base64Data, mimeType, apiKey) {
  const buffer = Buffer.from(base64Data, 'base64');
  const numBytes = buffer.length;
  const mime = mimeType || 'video/mp4';

  // --- Step 1: start the resumable upload session ---
  const startResponse = await fetch(`${FILES_UPLOAD_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(numBytes),
      'X-Goog-Upload-Header-Content-Type': mime,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ file: { display_name: 'saraa-upload' } })
  });

  if (!startResponse.ok) {
    const text = await startResponse.text();
    throw new Error(`Starting the video upload failed: ${text.slice(0, 200)}`);
  }

  const uploadUrl = startResponse.headers.get('x-goog-upload-url');
  if (!uploadUrl) {
    throw new Error('Video upload could not start (no upload URL returned by Google).');
  }

  // --- Step 2: upload the actual video bytes to that URL ---
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Length': String(numBytes),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize'
    },
    body: buffer
  });

  const uploadData = await uploadResponse.json();
  if (!uploadResponse.ok) {
    throw new Error(uploadData?.error?.message || 'Uploading the video bytes failed.');
  }

  let file = uploadData.file;

  // --- Step 3: wait for Google to finish processing the video ---
  const maxAttempts = 15;
  for (let attempt = 0; attempt < maxAttempts && file.state === 'PROCESSING'; attempt++) {
    await sleep(2000);
    const statusResponse = await fetch(`${FILES_GET_BASE}/${file.name}?key=${apiKey}`);
    const statusData = await statusResponse.json();
    if (!statusResponse.ok) {
      throw new Error(statusData?.error?.message || 'Checking video processing status failed.');
    }
    file = statusData;
  }

  if (file.state !== 'ACTIVE') {
    throw new Error('The video took too long to process. Please try a shorter clip.');
  }

  return { fileUri: file.uri, mimeType: file.mimeType || mime };
}

module.exports = { uploadVideoAndWaitUntilReady };
