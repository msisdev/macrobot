import { AutoRouter, IRequest } from "itty-router";
import { verifySignature } from "./middleware";
import { InteractionResponseFlags, InteractionResponseType, InteractionType } from "discord-interactions";
import { AWW_COMMAND, INVITE_COMMAND } from "./commands";
import { getCuteUrl } from "./reddit";

const router = AutoRouter<IRequest, [Env, ExecutionContext], Response>()
router.all('/interactions', verifySignature)
router.post('/interactions', async (req, env) => {
  const message = await req.json<MyInteraction>();

  if (message.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    console.log('Handling Ping request');
    return Response.json({
      type: InteractionResponseType.PONG,
    });
  }

  if (message.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (message.data.name.toLowerCase()) {
      case AWW_COMMAND.name.toLowerCase(): {
        console.log('handling cute request');
        const cuteUrl = await getCuteUrl();
        return Response.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: cuteUrl,
          },
        });
      }
      case INVITE_COMMAND.name.toLowerCase(): {
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
      default:
        console.error('Unknown Command');
        return Response.json({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  console.error('Unknown Type');
  return Response.json({ error: 'Unknown Type' }, { status: 400 });
});

export default {
  fetch: router.fetch
}
