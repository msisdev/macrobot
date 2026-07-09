import { InteractionResponseType } from "discord-interactions";

export const handle = async (req: Request, env: Env, ctx: ExecutionContext, msg: MyApplicationCommandInteraction) => {
  const data = msg.data;
  const inputValue = (data && 'options' in data && Array.isArray(data.options)) ? (data.options?.[0] as any)?.value : undefined;
  
  // 입력된 텍스트 안에서 (https?://...) 형태의 문자열을 찾습니다.
  const urlMatch = typeof inputValue === 'string' ? inputValue.match(/(https?:\/\/[^\s]+)/) : null;
  const url = urlMatch ? urlMatch[0] : undefined;

  try {
    if (!url) throw new Error('No URL found');
    new URL(url);
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
