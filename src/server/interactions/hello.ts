import { InteractionResponseType } from "discord-interactions";
import { HELLO_COMMAND } from "../commands";
import { ApplicationCommandInteractionHandler } from "./config";

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
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

export default {
  name: HELLO_COMMAND.name.toLowerCase(),
  handle,
}
