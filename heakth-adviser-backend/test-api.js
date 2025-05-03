import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGeminiAPI() {
  try {
    console.log('API Key available:', !!process.env.GEMINI_API_KEY);
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing in environment variables');
      return;
    }
    
    console.log('API Key first 10 chars:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try with the newer model version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    console.log('Sending test request to Gemini API...');
    const result = await model.generateContent('Hello, can you give me a short health tip?');
    const response = result.response;
    console.log('Response received:', response.text());
    console.log('API test successful!');
  } catch (error) {
    console.error('API test failed. Error details:');
    console.error(error.message);
    
    // If the first attempt fails, try listing available models
    console.log('Attempting to list available models...');
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('Available models may include: gemini-1.5-pro, gemini-1.5-flash, etc.');
    } catch (listError) {
      console.error('Failed to get model information:', listError.message);
    }
  }
}

testGeminiAPI();
