import { verifyKey } from "discord-interactions";
import { IRequest, RequestHandler } from "itty-router";

async function _verifySignature(req: Request, env: Env): Promise<boolean> {
  const signature = req.headers.get('x-signature-ed25519');
  if (!signature) {
    console.error('Missing signature');
    return false;
  }

  const timestamp = req.headers.get('x-signature-timestamp');
  if (!timestamp) {
    console.error('Missing timestamp');
    return false;
  }

  const body = await req.clone().arrayBuffer();

  return verifyKey(
    body,
    signature,
    timestamp,
    env.DISCORD_PUBLIC_KEY,
  )
}

export const verifySignature: RequestHandler<
  IRequest,
  [Env, ExecutionContext]
> = async (req, env) => {
  const isValid = await _verifySignature(req, env);
  if (!isValid) {
    return new Response('Invalid request signature', { status: 401 });
  }
}
