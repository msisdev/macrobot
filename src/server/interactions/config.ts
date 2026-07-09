export interface InteractionHandler<T extends MyInteraction = MyInteraction> {
  matches(msg: MyInteraction): msg is T;
  handle(req: Request, env: Env, ctx: ExecutionContext, msg: T): Promise<Response>;
}
