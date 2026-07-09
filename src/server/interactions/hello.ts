import { InteractionResponseType, InteractionType } from "discord-interactions";
import { HELLO_COMMAND } from "../commands";
import { InteractionHandler } from "./config";

const handle = async (req: Request, env: Env, ctx: ExecutionContext, msg: MyApplicationCommandInteraction) => {
  console.log('handling hello request');
  const data = msg.data;
  const name = (data && 'options' in data && Array.isArray(data.options)) ? (data.options?.[0] as any)?.value : undefined;
  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: name ? `Hello, ${name}!` : 'Hello, world!',
    },
  });
}

const handler: InteractionHandler<MyApplicationCommandInteraction> = {
  matches(msg): msg is MyApplicationCommandInteraction {
    return msg.type === InteractionType.APPLICATION_COMMAND && msg.data.name.toLowerCase() === HELLO_COMMAND.name.toLowerCase();
  },
  handle,
}

export default handler;
