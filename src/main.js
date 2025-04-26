// Import Tailwind styles (required)
import './style.css'

// Main chat functionality
document.addEventListener('DOMContentLoaded', () => {
  const chat = document.getElementById('chat')
  const input = document.getElementById('messageInput')
  const button = document.getElementById('sendButton')

  // Add message to chat UI
  const addMessage = (role, content) => {
    const messageDiv = document.createElement('div')
    messageDiv.className = role === 'user' 
      ? 'mb-3 p-3 bg-blue-50 rounded-lg self-end max-w-[80%]'
      : 'mb-3 p-3 bg-gray-100 rounded-lg self-start max-w-[80%]'
    messageDiv.textContent = content
    chat.appendChild(messageDiv)
    chat.scrollTop = chat.scrollHeight
  }

  // Send message to Deepseek API
  const sendMessage = async () => {
    const message = input.value.trim()
    if (!message) return

    addMessage('user', message)
    input.value = ''
    input.focus()

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
      })
      const data = await response.json()
      addMessage('assistant', data.content)
    } catch (error) {
      addMessage('assistant', 'Error: Failed to get response')
      console.error('API Error:', error)
    }
  }

  // Event listeners
  button.addEventListener('click', sendMessage)
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage()
  })
})