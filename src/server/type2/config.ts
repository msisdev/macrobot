import { APIApplicationCommandInteraction } from "discord-api-types/v10";

export type ApplicationCommandInteractionHandler = (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  msg: MyApplicationCommandInteraction,
) => Promise<Response>;
