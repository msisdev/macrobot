import { getCuteUrl } from "@/src/server/util/reddit";
import { ApplicationCommandInteractionHandler } from "./config"
import { InteractionResponseType } from "discord-interactions";
import { AWW_COMMAND } from "../commands";

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  console.log('handling cute request');
  const cuteUrl = await getCuteUrl();
  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: cuteUrl,
    },
  });
}

export default {
  name: AWW_COMMAND.name.toLowerCase(),
  handle
}
