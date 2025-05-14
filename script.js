// 1. DATA MODEL
const conversations = {
  Francis: [],
  George: [],
  Luke: [
    { sender: 'Luke', text: 'morning', timestamp: Date.now() - 1000 * 60 * 10 },
    { sender: 'You', text: 'morning, I need to talk about the new server drives', timestamp: Date.now() - 1000 * 60 * 9 },
    { sender: 'Luke', text: 'the names for the server?', timestamp: Date.now() - 1000 * 60 * 8 },
    { sender: 'You', text: 'yes', timestamp: Date.now() - 1000 * 60 * 7 },
    { sender: 'Luke', text: 'schedule a meeting after stand-up', timestamp: Date.now() - 1000 * 60 * 6 },
  ],
  Mark: [],
  Sam: [],
  Zephan: []
};

let currentUser = 'Luke';

// 2. DOM REFS
const userListEl = document.getElementById('userList');
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('messageInput');
const sendBtnEl = document.getElementById('sendBtn');

// 3. RENDER USER LIST
function renderUserList() {
  userListEl.innerHTML = '';
  Object.keys(conversations).forEach(user => {
    const div = document.createElement('div');
    div.textContent = user;
    div.classList.add('user');
    if (user === currentUser) div.classList.add('selected');
    div.addEventListener('click', () => {
      currentUser = user;
      inputEl.value = '';
      renderUserList();
      renderMessages();
    });
    userListEl.appendChild(div);
  });
}

// 4. RENDER MESSAGES
function renderMessages() {
  messagesEl.innerHTML = '';
  conversations[currentUser].forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('message', msg.sender === 'You' ? 'sent' : 'received');
    div.innerHTML = `
      <div><strong>${msg.sender}</strong> <span style="font-size: 0.8em; color: ${msg.sender === 'You' ? '#e0e0e0' : '#888'};">${formatRelativeTime(msg.timestamp)}</span></div>
      <div>${msg.text}</div>
    `;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// 5. FORMAT RELATIVE TIME
function formatRelativeTime(timestamp) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = Date.now();
  const diff = timestamp ? now - timestamp : 0;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (minutes < 1) return 'just now';
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (hours < 24) return rtf.format(-hours, 'hour');

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return rtf.format(-days, 'day');
}

// 6. SEND MESSAGE
function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  conversations[currentUser].push({
    sender: 'You',
    text,
    timestamp: Date.now()
  });

  inputEl.value = '';
  renderMessages();
}

// 7. EVENT LISTENERS
sendBtnEl.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 8. BOOTSTRAP
renderUserList();
renderMessages();
