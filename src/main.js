import './style.css';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked to use highlight.js for code blocks
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  breaks: true,
  gfm: true,
});

document.addEventListener('DOMContentLoaded', () => {
  const chat = document.getElementById('chat');
  const input = document.getElementById('messageInput');
  const fileInput = document.getElementById('fileInput');
  const attachButton = document.getElementById('attachButton');
  const sendButton = document.getElementById('sendButton');

  let messages = []; // Store conversation history

  // Add message to chat UI
  const addMessage = (role, content) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = role === 'user'
      ? 'mb-3 p-3 bg-blue-50 rounded-lg self-end max-w-[80%]'
      : 'mb-3 p-3 bg-gray-100 rounded-lg self-start max-w-[80%] markdown-body';
    messageDiv.innerHTML = role === 'assistant' ? marked.parse(content) : content;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
  };

  // Send message to Deepseek API
  const sendMessage = async (fileContent = '') => {
    const message = input.value.trim();
    if (!message && !fileContent) return;

    const userMessage = fileContent ? `${message}\n\nFile Content:\n\`\`\`\n${fileContent}\n\`\`\`` : message;
    addMessage('user', userMessage);
    messages.push({ role: 'user', content: userMessage });

    input.value = '';
    fileInput.value = '';
    input.focus();

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      const data = await response.json();
      if (data.content) {
        addMessage('assistant', data.content);
        messages.push({ role: 'assistant', content: data.content });
      } else {
        throw new Error('No content in response');
      }
    } catch (error) {
      addMessage('assistant', 'Error: Failed to get response');
      console.error('API Error:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      sendMessage(text);
    } catch (error) {
      addMessage('assistant', 'Error: Failed to read file');
      console.error('File Read Error:', error);
    }
  };

  // Event listeners
  sendButton.addEventListener('click', () => sendMessage());
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  attachButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileUpload);
});