// SARAA — shared web/desktop frontend. Talks to the SAME backend the
// Android app uses, so every "face" of SARAA shares one brain.
// This exact file also gets served as a real website from the backend
// itself, so "SARAA in any browser" and "SARAA the desktop app" are
// literally the same code.

const BACKEND_URL = 'https://saraa-backend.onrender.com/api/chat';
const STORAGE_KEY = 'saraa_conversations';
const MODE_KEY = 'saraa_online_mode';

const welcomeEl = document.getElementById('welcome');
const messagesEl = document.getElementById('messages');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const attachPlusBtn = document.getElementById('attachPlusBtn');
const attachMenu = document.getElementById('attachMenu');
const attachCameraOption = document.getElementById('attachCameraOption');
const attachPhotoOption = document.getElementById('attachPhotoOption');
const attachVideoOption = document.getElementById('attachVideoOption');
const imageInput = document.getElementById('imageInput');
const cameraInput = document.getElementById('cameraInput');
const videoInput = document.getElementById('videoInput');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewImg = document.getElementById('imagePreviewImg');
const removeImageBtn = document.getElementById('removeImageBtn');
const videoPreview = document.getElementById('videoPreview');
const removeVideoBtn = document.getElementById('removeVideoBtn');
const newChatBtn = document.getElementById('newChatBtn');
const historyListEl = document.getElementById('historyList');
const onlineModeToggle = document.getElementById('onlineModeToggle');
const modeSubtext = document.getElementById('modeSubtext');
const clearChatsBtn = document.getElementById('clearChatsBtn');
const clearChatsSub = document.getElementById('clearChatsSub');

let history = []; // { role: 'user'|'assistant', content }
let pendingImage = null; // { base64, mimeType, dataUrl }
let pendingVideo = null; // { base64, mimeType }
let isWaiting = false;
let activeConversationId = null;

// ===== Online/Offline mode (STAGE 12) =====
function isOnlineMode() {
  return localStorage.getItem(MODE_KEY) !== 'offline';
}

function setOnlineMode(online) {
  localStorage.setItem(MODE_KEY, online ? 'online' : 'offline');
  onlineModeToggle.checked = online;
  modeSubtext.textContent = online
    ? 'Full AI answers (needs internet)'
    : 'Offline: only a small built-in first-aid/safety reference';
}

onlineModeToggle.addEventListener('change', (e) => setOnlineMode(e.target.checked));

// ===== Conversation persistence (STAGE 12 — localStorage, per browser/app install) =====
// Note: to keep storage small, attached images/video are NOT saved into
// history long-term (only kept for the live, in-memory session) — saved
// conversations keep text only. A full account-based sync (same chats on
// phone + desktop) would need real user accounts, which is a separate,
// bigger future stage.
function loadAllConversations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAllConversations(conversations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function upsertCurrentConversation() {
  if (history.length === 0) return;
  const conversations = loadAllConversations();
  const existingIndex = conversations.findIndex((c) => c.id === activeConversationId);
  const title = history[0].content?.slice(0, 40) || 'Chat';
  const record = {
    id: activeConversationId,
    title,
    updatedAt: Date.now(),
    messages: history
  };
  if (existingIndex >= 0) {
    conversations[existingIndex] = record;
  } else {
    conversations.unshift(record);
  }
  saveAllConversations(conversations);
}

function renderHistoryList() {
  const conversations = loadAllConversations().sort((a, b) => b.updatedAt - a.updatedAt);
  historyListEl.innerHTML = '';
  if (conversations.length === 0) {
    historyListEl.innerHTML = '<div class="history-empty">No saved chats yet.</div>';
    return;
  }
  conversations.forEach((conv) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    const date = new Date(conv.updatedAt).toLocaleString();
    item.innerHTML = `
      <div>
        <div class="history-item-title"></div>
        <div class="history-item-date">${date}</div>
      </div>
      <button class="history-delete-btn" title="Delete">🗑️</button>
    `;
    item.querySelector('.history-item-title').textContent = conv.title;
    item.addEventListener('click', (e) => {
      if (e.target.closest('.history-delete-btn')) return;
      openConversation(conv);
    });
    item.querySelector('.history-delete-btn').addEventListener('click', () => {
      const remaining = loadAllConversations().filter((c) => c.id !== conv.id);
      saveAllConversations(remaining);
      renderHistoryList();
    });
    historyListEl.appendChild(item);
  });
}

function openConversation(conv) {
  activeConversationId = conv.id;
  history = conv.messages;
  messagesEl.innerHTML = '';
  history.forEach((msg) => {
    addBubble({ role: msg.role, content: msg.content });
  });
  showChatMessages();
  switchView('chatView');
}

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

/** STAGE 14: offline mode never touches the network — see offlineKnowledge.js. */
function getOfflineReply(text) {
  const answer = findOfflineAnswer(text);
  if (answer) return answer;
  const isHindiQuery = /[\u0900-\u097F]/.test(text);
  return isHindiQuery
    ? "मेरे पास इसके लिए ऑफलाइन जानकारी नहीं है। ऑफलाइन मोड में सिर्फ कुछ सामान्य मेडिकल " +
      "इमरजेंसी और स्थितियों की जानकारी है। इंटरनेट मिलते ही Settings में Online mode चालू " +
      "करके पूरे AI जवाब पाएं।"
    : "I don't have an offline reference for that. Offline mode only covers a set of common " +
      "medical emergencies and basic conditions. Switch Online mode back on in Settings for " +
      "full AI answers once you have internet.";
}

async function handleSend() {
  const text = textInput.value.trim();
  if (!text && !pendingImage && !pendingVideo) return;
  if (isWaiting) return;

  if (!activeConversationId) {
    activeConversationId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

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
  history.push({ role: 'user', content: text });

  const hadImage = !!pendingImage;
  const hadVideo = !!pendingVideo;
  textInput.value = '';
  pendingImage = null;
  pendingVideo = null;
  imagePreview.style.display = 'none';
  videoPreview.style.display = 'none';

  const turnsToSend = [...history.slice(0, -1), turn];

  setWaiting(true);

  if (!isOnlineMode()) {
    // Offline: answer instantly from the local reference, no network call.
    const reply = getOfflineReply(text || (hadImage ? 'image' : hadVideo ? 'video' : ''));
    addBubble({ role: 'assistant', content: reply });
    history.push({ role: 'assistant', content: reply });
    upsertCurrentConversation();
    setWaiting(false);
    textInput.focus();
    return;
  }

  addTypingIndicator();
  try {
    const reply = await sendToBackend(turnsToSend);
    removeTypingIndicator();
    addBubble({ role: 'assistant', content: reply });
    history.push({ role: 'assistant', content: reply });
    upsertCurrentConversation();
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
  activeConversationId = null;
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
// Note: works in real Chrome/Edge browsers. Inside the packaged Electron
// app it may not work — Electron's bundled Chromium doesn't ship Google's
// speech-recognition backend the way the full Chrome browser does. That's
// an Electron limitation, not a bug in this code.
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
    const hasMessages = messagesEl.children.length > 0;
    welcomeEl.style.display = hasMessages ? 'none' : 'flex';
    messagesEl.style.display = hasMessages ? 'flex' : 'none';
  } else if (viewId === 'historyView') {
    renderHistoryList();
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
attachPlusBtn.addEventListener('click', () => {
  attachMenu.style.display = attachMenu.style.display === 'none' ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.attach-menu-wrapper')) {
    attachMenu.style.display = 'none';
  }
});
attachCameraOption.addEventListener('click', () => {
  attachMenu.style.display = 'none';
  cameraInput.click();
});
attachPhotoOption.addEventListener('click', () => {
  attachMenu.style.display = 'none';
  imageInput.click();
});
attachVideoOption.addEventListener('click', () => {
  attachMenu.style.display = 'none';
  videoInput.click();
});
imageInput.addEventListener('change', (e) => handleImageChosen(e.target.files[0]));
cameraInput.addEventListener('change', (e) => handleImageChosen(e.target.files[0]));
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

clearChatsBtn.addEventListener('click', () => {
  const count = loadAllConversations().length;
  if (count === 0) return;
  const confirmed = window.confirm(`Delete all ${count} saved chat(s) on this device? This can't be undone.`);
  if (!confirmed) return;
  saveAllConversations([]);
  clearChatsSub.textContent = 'All chats deleted';
  renderHistoryList();
  setTimeout(() => {
    clearChatsSub.textContent = 'Delete all saved history on this device';
  }, 2000);
});

// Initialize mode toggle from saved preference.
setOnlineMode(isOnlineMode());
