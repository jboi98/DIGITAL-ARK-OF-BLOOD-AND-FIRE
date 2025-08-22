const messagesEl = document.getElementById('messages');
const typingEl = document.getElementById('typing');
const inputEl = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const quickButtons = document.querySelectorAll('.quick-actions button');

const OPENAI_API_KEY = 'YOUR_API_KEY';

quickButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    inputEl.value = btn.dataset.msg;
    sendMessage();
  });
});

sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping(show) {
  typingEl.classList.toggle('hidden', !show);
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  inputEl.value = '';
  showTyping(true);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: text }]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'No response';
    addMessage(reply, 'ai');
  } catch (err) {
    addMessage('Error: ' + err.message, 'ai');
  } finally {
    showTyping(false);
  }
}
