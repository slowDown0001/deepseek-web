import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
require('dotenv').config(); // Loads .env file

const app = express();
const port = 3000;
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
if (!deepseekApiKey) {
  throw new Error("DEEPSEEK_API_KEY is missing in .env file!");
}
console.log("API Key loaded securely!");

app.use(cors());
app.use(express.json());

// Configure OpenAI client for DeepSeek API
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: deepseekApiKey
});

// Health check route to verify server is running
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array' });
    }

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error('Deepseek API error:', error.message);
    res.status(500).json({ error: 'API request failed', details: error.message });
  }
});

// Start the server and handle errors
const server = app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

// Handle server errors to prevent crashing
server.on('error', (error) => {
  console.error('Server error:', error.message);
});

// Handle unhandled promise rejections to prevent server exit
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});