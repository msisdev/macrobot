import { ApplicationCommandInteractionHandler } from "./config";
import helloHandler from "./hello";
import sumHandler from "./sum";
import testHandler from "./test";

const handler: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  // Most user commands will come as `APPLICATION_COMMAND`.
  switch (msg.data.name.toLowerCase()) {
    case helloHandler.name: {
      return helloHandler.handle(req, env, ctx, msg);
    }
    case sumHandler.name: {
      return sumHandler.handle(req, env, ctx, msg);
    }
    case testHandler.name: {
      return testHandler.handle(req, env, ctx, msg);
    }
    default:
      console.error('Unknown Command');
      return Response.json({ error: 'Unknown Type' }, { status: 400 });
  }
}

export default handler
