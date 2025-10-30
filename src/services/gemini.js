import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = 'AIzaSyC9o1mCOoeZSdgswnn3g19JbhBeXfVrEcA'

if (!API_KEY) {
  console.error('Gemini API key not found. Please check your environment variables.')
}

const genAI = new GoogleGenerativeAI(API_KEY)

export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
})

export const geminiModelChat = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
})

// Test connection
export const testGeminiConnection = async () => {
  try {
    const result = await geminiModel.generateContent('Hello, are you working?')
    const response = await result.response
    console.log('✅ Gemini AI connected successfully')
    return true
  } catch (error) {
    console.error('❌ Gemini AI connection failed:', error)
    return false
  }
}

export default genAI