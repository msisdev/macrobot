import { AutoRouter, IRequest } from "itty-router";
import { verifySignature } from "./middleware";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import type2Handler from './type2'

const router = AutoRouter<IRequest, [Env, ExecutionContext], Response>()
router.all('/interactions', verifySignature)
router.post('/interactions', async (req, env, ctx) => {
  const msg = await req.json<MyInteraction>();

  if (msg.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return Response.json({
      type: InteractionResponseType.PONG,
    });
  }

  // Most user commands will come as `APPLICATION_COMMAND`.
  if (msg.type === InteractionType.APPLICATION_COMMAND) {
    return type2Handler(req, env, ctx, msg)
  }

  console.error('Unknown Type');
  return Response.json({ error: 'Unknown Type' }, { status: 400 });
});

export default {
  fetch: router.fetch
}
