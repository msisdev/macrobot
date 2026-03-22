import { InteractionResponseType } from "discord-interactions";
import { SUM_COMMAND } from "../commands";
import { ApplicationCommandInteractionHandler } from "./config";
import { GoogleGenAI } from "@google/genai";

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  const data = msg.data;
  const url = (data && 'options' in data && Array.isArray(data.options)) ? (data.options?.[0] as any)?.value : undefined;

  if (!url || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)) {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Please provide a valid URL.',
      },
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.0-flash", // Default or typical models 
      contents: `Summarize the content at this URL: ${url}. Return the result strictly in JSON format with a single key "summary" containing the markdown formatted summary.`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: parsed.summary,
      },
    });
  } catch (error) {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Failed to summarize the URL or invalid response.',
      },
    });
  }
}

export default {
  name: SUM_COMMAND.name.toLowerCase(),
  handle,
}
