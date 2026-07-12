import { InteractionResponseType } from "discord-interactions";

export const handle = async (req: Request, env: Env, ctx: ExecutionContext, msg: MyApplicationCommandInteraction) => {
  const data = msg.data;
  const name = (data && 'options' in data && Array.isArray(data.options)) ? (data.options?.[0] as any)?.value : undefined;

  if (!name || typeof name !== 'string') {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Please provide a valid name.',
        flags: 64,
      },
    });
  }

  const applicationId = msg.application_id;
  const interactionToken = msg.token;

  ctx.waitUntil(env.MY_QUEUE.send({
    type: 'wb',
    name,
    applicationId,
    interactionToken,
  }));

  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: 64, // EPHEMERAL
    },
  });
}
