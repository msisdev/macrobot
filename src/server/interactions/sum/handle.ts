import { ApplicationCommandInteractionHandler } from "@/src/server/interactions/config";
import { InteractionResponseType } from "discord-interactions";

export const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
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

  ctx.waitUntil(env.MY_QUEUE.send({
    type: 'sum',
    url,
    applicationId,
    interactionToken,
  }));

  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
}
