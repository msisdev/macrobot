import { AutoRouter, IRequest } from "itty-router";
import { verifySignature } from "./middleware";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import interactionsHandler from './interactions'
import { handleButton } from "./interactions/test";

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
    return interactionsHandler(req, env, ctx, msg)
  }

  if (msg.type == InteractionType.MESSAGE_COMPONENT) {
    switch (msg.data.custom_id) {
      case 'test_confirm_btn': {
        return handleButton(req, env, ctx, msg)
      }
    }
  }


  console.error('Unknown Type');
  return Response.json({ error: 'Unknown Type' }, { status: 400 });
});

export default {
  fetch: router.fetch
}
