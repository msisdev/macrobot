import helloHandler from "./hello";
import sumHandler from "./sum";

const handlers = [helloHandler, sumHandler];

const handler = async (req: Request, env: Env, ctx: ExecutionContext, msg: MyInteraction) => {
  for (const handler of handlers) {
    if (handler.matches(msg)) {
      return handler.handle(req, env, ctx, msg as any);
    }
  }

  console.error('Unknown Interaction');
  return Response.json({ error: 'Unknown Interaction' }, { status: 400 });
}

export default handler
