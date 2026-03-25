import { ApplicationCommandInteractionHandler } from "./config";
import awwHandler from "./aww";
import helloHandler from "./hello";
import inviteHandler from "./invite";
import sumHandler from "./sum";

const handler: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  // Most user commands will come as `APPLICATION_COMMAND`.
  switch (msg.data.name.toLowerCase()) {
    case awwHandler.name: {
      return awwHandler.handle(req, env, ctx, msg);
    }
    case inviteHandler.name: {
      return inviteHandler.handle(req, env, ctx, msg);
    }
    case helloHandler.name: {
      return helloHandler.handle(req, env, ctx, msg);
    }
    case sumHandler.name: {
      return sumHandler.handle(req, env, ctx, msg);
    }
    default:
      console.error('Unknown Command');
      return Response.json({ error: 'Unknown Type' }, { status: 400 });
  }
}

export default handler
