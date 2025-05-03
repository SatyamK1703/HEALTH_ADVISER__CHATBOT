import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Health Advisor API is running' });
});

// Helper function to handle Gemini API requests with timeout
async function getGeminiResponse(message, history = []) {
  return new Promise(async (resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timed out after ' + REQUEST_TIMEOUT/1000 + ' seconds'));
    }, REQUEST_TIMEOUT);
    
    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      // Format chat history for Gemini
      const formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      // Start a chat session
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        systemInstruction: {
          role: "system",
          parts: [{
            text: `You are a helpful and knowledgeable health advisor AI. 
            Provide accurate health information and advice based on established medical knowledge.
            Always clarify that you're not a replacement for professional medical advice, diagnosis, or treatment.
            For serious health concerns, always recommend consulting with a healthcare professional.
            Be empathetic, clear, and concise in your responses.
            Do not make definitive diagnoses or prescribe specific treatments.`
          }]
        }
      });
      
      // Send the message and get the response
      const result = await chat.sendMessage(message);
      const response = result.response;
      
      // Clear timeout since request completed successfully
      clearTimeout(timeoutId);
      
      resolve({
        reply: response.text(),
        model: "gemini-1.5-pro"
      });
    } catch (error) {
      // Clear timeout since request errored out
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] New chat request received`);
  
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'API key is missing' 
      });
    }

    console.log(`[${new Date().toISOString()}] Using API key:`, process.env.GEMINI_API_KEY.substring(0, 5) + '...');
    console.log(`[${new Date().toISOString()}] Sending request to Gemini API with history length:`, history.length);
    
    try {
      const response = await getGeminiResponse(message, history);
      
      const processingTime = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] Response received from Gemini (took ${processingTime}ms)`);
      
      res.json(response);
    } catch (apiError) {
      console.error(`[${new Date().toISOString()}] Gemini API error:`, apiError.message);
      console.error('API error details:', apiError.stack);
      res.status(500).json({ 
        error: 'AI service error',
        details: apiError.message 
      });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing chat request:`, error.message);
    console.error('Error details:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
});







