import { GoogleGenAI } from '@google/genai'

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable')
}

// Initialize the client
// Note: The SDK import might vary slightly depending on version. 
// Based on docs: `import { GoogleGenAI } from "@google/genai";`
// Adjusting to standard usage if needed.

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

// @ts-ignore - The types might not be fully up to date with the beta client
export const model = genAI.models

