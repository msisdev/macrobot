import { InteractionType } from "discord-interactions";
import { WB_COMMAND } from "../../commands";
import { InteractionHandler } from "../config";
import { handle } from "./handle";

const handler: InteractionHandler<MyApplicationCommandInteraction> = {
  matches(msg): msg is MyApplicationCommandInteraction {
    return msg.type === InteractionType.APPLICATION_COMMAND && msg.data.name.toLowerCase() === WB_COMMAND.name.toLowerCase();
  },
  handle,
}

export default handler;
