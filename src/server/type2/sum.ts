import { InteractionResponseType } from "discord-interactions";
import { SUM_COMMAND } from "../commands";
import { ApplicationCommandInteractionHandler } from "./config";
import { GoogleGenAI } from "@google/genai";

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  const data = msg.data;
  const url = (data && 'options' in data && Array.isArray(data.options)) ? (data.options?.[0] as any)?.value : undefined;

  try {
    new URL(url)
  } catch (err) {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Please provide a valid URL.',
      },
    });
  }

  const applicationId = msg.application_id;
  const interactionToken = msg.token;

  ctx.waitUntil((async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Default or typical models 
        contents: `Summarize the content at this URL: ${url}. Always include the title of the content of the URL (it is usually an article). Return the result strictly in JSON format with a single key "summary" containing the markdown formatted summary.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const content = parsed.summary || 'Failed to summarize the URL or invalid response.';

      await fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });
    } catch (error) {
      await fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Failed to summarize the URL or invalid response.',
        }),
      });
    }
  })());

  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
}

export default {
  name: SUM_COMMAND.name.toLowerCase(),
  handle,
}
