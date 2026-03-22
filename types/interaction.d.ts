import { APIApplicationCommandAutocompleteInteraction, APIApplicationCommandInteraction, APIMessageComponentInteraction, APIModalSubmitInteraction, APIPingInteraction } from "discord-api-types/v10"
import { InteractionType } from "discord-interactions"

declare global {

  type MyPingInteraction = Omit<APIPingInteraction, 'type'> & { type: InteractionType.PING }
  type MyApplicationCommandInteraction = Omit<APIApplicationCommandInteraction, 'type'> & { type: InteractionType.APPLICATION_COMMAND }
  type MyMessageComponentInteraction = Omit<APIMessageComponentInteraction, 'type'> & { type: InteractionType.MESSAGE_COMPONENT }
  type MyAutocompleteInteraction = Omit<APIApplicationCommandAutocompleteInteraction, 'type'> & { type: InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE }
  type MyModalSubmitInteraction = Omit<APIModalSubmitInteraction, 'type'> & { type: InteractionType.MODAL_SUBMIT }

  type MyInteraction = MyPingInteraction
    | MyApplicationCommandInteraction
    | MyMessageComponentInteraction
    | MyAutocompleteInteraction
    | MyModalSubmitInteraction
}

export {}
