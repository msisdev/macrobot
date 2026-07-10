import { GoogleGenAI } from "@google/genai";
import { genaiResponseSchema, toGenaiPrompt } from "./config";

export const generateSummary = async (apiKey: string, url: string) => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite", // Default or typical models 
    contents: toGenaiPrompt(url),
    config: {
      responseMimeType: "application/json",
      responseSchema: genaiResponseSchema,
      tools: [{ googleSearch: {}, urlContext: {} }], // Allow the Gemini models to search the web + provide URL context
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  if (!parsed.title || !parsed.date || !parsed.content || !parsed.sentiment) {
    throw new Error('Invalid response schema');
  }
  return parsed as { title: string, source?: string, date: string, sentiment: string, sentimentEmoji: string, content: string };
};
