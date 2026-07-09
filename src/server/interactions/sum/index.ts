import { InteractionType } from "discord-interactions";
import { SUM_COMMAND } from "../../commands";
import { InteractionHandler } from "../config";
import { handle } from "./handle";

const handler: InteractionHandler<MyApplicationCommandInteraction> = {
  matches(msg): msg is MyApplicationCommandInteraction {
    return msg.type === InteractionType.APPLICATION_COMMAND && msg.data.name.toLowerCase() === SUM_COMMAND.name.toLowerCase();
  },
  handle,
}

export default handler;
