import dotenv from 'dotenv';

dotenv.config();

let genAI = null;
let isGeminiConfigured = false;

const initGemini = async () => {
  if (process.env.GEMINI_API_KEY) {
    try {
      // Dynamic import to prevent crash if @google/generative-ai is not installed
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      isGeminiConfigured = true;
      console.log('Gemini API configured successfully.');
    } catch (error) {
      console.warn('Google Generative AI package is not installed. AI chat will run in mock mode.');
    }
  } else {
    console.log('GEMINI_API_KEY is not defined. AI chat will run in mock mode.');
  }
};

// Execute initialization
await initGemini();

export { genAI, isGeminiConfigured };
