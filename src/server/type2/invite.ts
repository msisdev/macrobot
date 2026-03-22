import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { ApplicationCommandInteractionHandler } from "./config";
import { INVITE_COMMAND } from "../commands";

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  const applicationId = env.DISCORD_APPLICATION_ID;
  const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: INVITE_URL,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  });
}

export default {
  name: INVITE_COMMAND.name.toLowerCase(),
  handle
}
