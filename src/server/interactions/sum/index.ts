import { SUM_COMMAND } from "../../commands";
import { handle } from "./handle";

export default {
  name: SUM_COMMAND.name.toLowerCase(),
  handle,
}
