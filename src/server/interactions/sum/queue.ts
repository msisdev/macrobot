import { z } from "zod";
import { genaiResponseSchema, queueBodySchema, toGenaiPrompt } from "./config";
import { GoogleGenAI } from "@google/genai";
import { updateDiscordMessage } from "@/src/server/util/discord";

const toDiscordContent = (url: string, parsed: any) => {
  const content = `# [${parsed.title}](${url})\n- ${parsed.date}\n- ${parsed.source}\n\n${parsed.content}`;
  return content.replace(/\\n/g, '\n');
}

export const processSum = async (env: Env, body: z.output<typeof queueBodySchema>) => {
  try {
    const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite", // Default or typical models 
      contents: toGenaiPrompt(body.url),
      config: {
        responseMimeType: "application/json",
        responseSchema: genaiResponseSchema,
        tools: [{ googleSearch: {}, urlContext: {} }],
      },
    })

    const parsed = JSON.parse(response.text || '{}')
    if (!parsed.title || !parsed.date || !parsed.content) {
      throw new Error('Invalid response schema');
    }

    await updateDiscordMessage(
      body.applicationId,
      body.interactionToken,
      toDiscordContent(body.url, parsed),
    )
  } catch (error) {
    await updateDiscordMessage(
      body.applicationId,
      body.interactionToken,
      'Failed to summarize the URL or invalid response.',
    )
  }
}
