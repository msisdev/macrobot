import { AutoRouter, IRequest } from "itty-router";
import { verifySignature } from "./middleware";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import interactionsHandler from './interactions'

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

  // All real interactions
  return interactionsHandler(req, env, ctx, msg);
});

export default {
  fetch: router.fetch
}
