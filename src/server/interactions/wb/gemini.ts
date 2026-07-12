import { GoogleGenAI } from "@google/genai";
import { genaiResponseSchema, toGenaiPrompt } from "./config";

export const generateSummary = async (apiKey: string, name: string) => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite", // Default or typical models 
    contents: toGenaiPrompt(name),
    config: {
      responseMimeType: "application/json",
      responseSchema: genaiResponseSchema,
      tools: [{ googleSearch: {}, urlContext: {} }], // Allow the Gemini models to search the web + provide URL context
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  if (parsed.found === undefined) {
    throw new Error('Invalid response schema');
  }
  return parsed as { 
    found: boolean, 
    title: string, 
    currentPrice: string,
    targetPrice: string,
    scoreBusinessSimplicity: number, 
    scoreBusinessHistory: number, 
    scoreBusinessMoat: number, 
    scoreManagementCapitalAllocation: number, 
    scoreManagementTransparency: number, 
    scoreManagementInstitutionalImperative: number, 
    scoreFinancialROE: number, 
    scoreFinancialFCF: number, 
    scoreFinancialMargin: number, 
    scoreFinancialOneDollarRule: number, 
    scoreMarketIntrinsicValue: number, 
    scoreMarketSafetyMargin: number, 
    summary: string, 
    action: string 
  };
};
