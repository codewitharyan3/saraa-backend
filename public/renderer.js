// SARAA — shared web/desktop frontend. Talks to the SAME backend the
// Android app uses, so every "face" of SARAA shares one brain.
// Plain browser JS only (fetch, DOM, FileReader, Web Speech API) — this
// exact file also gets served as a real website from the backend itself,
// so "SARAA in any browser" and "SARAA the desktop app" are literally the
// same code.

const BACKEND_URL = 'https://saraa-backend.onrender.com/api/chat';

const welcomeEl = document.getElementById('welcome');
const messagesEl = document.getElementById('messages');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const attachImageBtn = document.getElementById('attachImageBtn');
const attachVideoBtn = document.getElementById('attachVideoBtn');
const imageInput = document.getElementById('imageInput');
const videoInput = document.getElementById('videoInput');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewImg = document.getElementById('imagePreviewImg');
const removeImageBtn = document.getElementById('removeImageBtn');
const videoPreview = document.getElementById('videoPreview');
const removeVideoBtn = document.getElementById('removeVideoBtn');
const newChatBtn = document.getElementById('newChatBtn');

let history = []; // { role: 'user'|'assistant', content }
let pendingImage = null; // { base64, mimeType, dataUrl }
let pendingVideo = null; // { base64, mimeType }
let isWaiting = false;

// ===== Chat =====

function showChatMessages() {
  welcomeEl.style.display = 'none';
  messagesEl.style.display = 'flex';
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addBubble({ role, content, imageDataUrl, hasVideo, isError = false }) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role === 'user' ? 'user' : 'assistant'}${isError ? ' error' : ''}`;
  if (imageDataUrl) {
    const img = document.createElement('img');
    img.src = imageDataUrl;
    bubble.appendChild(img);
  }
  if (hasVideo) {
    const tag = document.createElement('div');
    tag.className = 'video-tag';
    tag.innerHTML = '🎥 <span>Video attached</span>';
    bubble.appendChild(tag);
  }
  if (content) {
    const textNode = document.createElement('div');
    textNode.textContent = content;
    bubble.appendChild(textNode);
  }
  messagesEl.appendChild(bubble);
  scrollToBottom();
}

function setWaiting(waiting) {
  isWaiting = waiting;
  sendBtn.disabled = waiting;
  textInput.disabled = waiting;
}

function addTypingIndicator() {
  const el = document.createElement('div');
  el.className = 'typing';
  el.id = 'typingIndicator';
  el.textContent = 'SARAA is thinking…';
  messagesEl.appendChild(el);
  scrollToBottom();
}

function removeTypingIndicator() {
  document.getElementById('typingIndicator')?.remove();
}

async function sendToBackend(turns) {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: turns })
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    const msg = data?.error?.message || `Server error (${response.status}). Please try again.`;
    throw new Error(msg);
  }
  return data.message.content;
}

async function handleSend() {
  const text = textInput.value.trim();
  if (!text && !pendingImage && !pendingVideo) return;
  if (isWaiting) return;

  showChatMessages();
  addBubble({
    role: 'user',
    content: text,
    imageDataUrl: pendingImage?.dataUrl,
    hasVideo: !!pendingVideo
  });

  const turn = { role: 'user', content: text };
  if (pendingImage) {
    turn.imageBase64 = pendingImage.base64;
    turn.imageMimeType = pendingImage.mimeType;
  }
  if (pendingVideo) {
    turn.videoBase64 = pendingVideo.base64;
    turn.videoMimeType = pendingVideo.mimeType;
  }
  history.push({ role: 'user', content: text }); // media not resent in future turns (matches mobile app)

  textInput.value = '';
  pendingImage = null;
  pendingVideo = null;
  imagePreview.style.display = 'none';
  videoPreview.style.display = 'none';

  const turnsToSend = [...history.slice(0, -1), turn];

  setWaiting(true);
  addTypingIndicator();
  try {
    const reply = await sendToBackend(turnsToSend);
    removeTypingIndicator();
    addBubble({ role: 'assistant', content: reply });
    history.push({ role: 'assistant', content: reply });
  } catch (err) {
    removeTypingIndicator();
    addBubble({ role: 'assistant', content: err.message, isError: true });
  } finally {
    setWaiting(false);
    textInput.focus();
  }
}

function handleNewChat() {
  history = [];
  pendingImage = null;
  pendingVideo = null;
  imagePreview.style.display = 'none';
  videoPreview.style.display = 'none';
  messagesEl.innerHTML = '';
  messagesEl.style.display = 'none';
  welcomeEl.style.display = 'flex';
  textInput.value = '';
}

function handleImageChosen(file) {
  if (!file) return;
  pendingVideo = null;
  videoPreview.style.display = 'none';
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    const base64 = dataUrl.split(',')[1];
    pendingImage = { base64, mimeType: file.type || 'image/jpeg', dataUrl };
    imagePreviewImg.src = dataUrl;
    imagePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function handleVideoChosen(file) {
  if (!file) return;
  pendingImage = null;
  imagePreview.style.display = 'none';
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    const base64 = dataUrl.split(',')[1];
    pendingVideo = { base64, mimeType: file.type || 'video/mp4' };
    videoPreview.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

// ===== Voice input (Web Speech API) =====
// Note: this works in real Chrome/Edge browsers. Inside the packaged
// Electron app it may not work, because Electron's bundled Chromium
// doesn't ship Google's speech-recognition backend the way the full Chrome
// browser does — a known Electron limitation, not a bug in this code.
const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
let isListening = false;

if (SpeechRecognitionImpl) {
  recognizer = new SpeechRecognitionImpl();
  recognizer.lang = navigator.language || 'en-US';
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    textInput.value = transcript;
  };
  recognizer.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
  };
  recognizer.onerror = () => {
    isListening = false;
    micBtn.classList.remove('listening');
  };
} else {
  micBtn.disabled = true;
  micBtn.title = 'Voice input is not supported in this window';
}

function toggleListening() {
  if (!recognizer) return;
  if (isListening) {
    recognizer.stop();
    return;
  }
  isListening = true;
  micBtn.classList.add('listening');
  recognizer.start();
}

// ===== Bottom nav =====
function switchView(viewId) {
  document.querySelectorAll('.view').forEach((el) => {
    el.style.display = el.id === viewId ? 'flex' : 'none';
  });
  if (viewId === 'chatView') {
    // Restore the correct inner display (welcome vs message list)
    const hasMessages = messagesEl.children.length > 0;
    welcomeEl.style.display = hasMessages ? 'none' : 'flex';
    messagesEl.style.display = hasMessages ? 'flex' : 'none';
  }
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });
}

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ===== Wire everything up =====
sendBtn.addEventListener('click', handleSend);
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});
newChatBtn.addEventListener('click', handleNewChat);
attachImageBtn.addEventListener('click', () => imageInput.click());
attachVideoBtn.addEventListener('click', () => videoInput.click());
imageInput.addEventListener('change', (e) => handleImageChosen(e.target.files[0]));
videoInput.addEventListener('change', (e) => handleVideoChosen(e.target.files[0]));
removeImageBtn.addEventListener('click', () => {
  pendingImage = null;
  imagePreview.style.display = 'none';
  imageInput.value = '';
});
removeVideoBtn.addEventListener('click', () => {
  pendingVideo = null;
  videoPreview.style.display = 'none';
  videoInput.value = '';
});
micBtn.addEventListener('click', toggleListening);

