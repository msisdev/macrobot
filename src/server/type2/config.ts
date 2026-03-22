export type ApplicationCommandInteractionHandler = (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  msg: MyApplicationCommandInteraction,
) => Promise<Response>;
