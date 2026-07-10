import { z } from "zod";
import { queueBodySchema } from "./config";
import { updateDiscordMessage } from "@/src/server/util/discord";
import { generateSummary } from "./gemini";

const toDiscordContent = (url: string, parsed: any) => {
  const sourcePart = parsed.source ? `- ${parsed.source}` : '';
  const content = `# [${parsed.title}](${url})\n- ${parsed.date}\n${sourcePart}\n- ${parsed.sentimentEmoji} ${parsed.sentiment}\n\n${parsed.content}`;
  return content.replace(/\\n/g, '\n').replace(/\n\n- /g, '\n- ');
}

export const processSum = async (env: Env, body: z.output<typeof queueBodySchema>) => {
  try {
    const parsed = await generateSummary(env.GOOGLE_GENAI_API_KEY, body.url);

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
