import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIInteraction,
  APIMessageComponentInteraction,
  APIModalSubmitInteraction,
  APIPingInteraction,
} from "discord-api-types/v10"
import { InteractionType } from "discord-interactions"

declare global {
  // Enum values are nominally typed. To map between two different enums with the same
  // numeric values, we extract the literal number and match it against the target enum.
  type MapEnum<T, TargetEnum> = `${T & number}` extends `${infer N extends number}` 
    ? Extract<TargetEnum, N> 
    : never;

  type ReplaceInteractionType<T> = T extends { type: number }
    ? Omit<T, 'type'> & { type: MapEnum<T['type'], InteractionType> }
    : T;

  type MyPingInteraction = ReplaceInteractionType<APIPingInteraction>
  type MyApplicationCommandInteraction = ReplaceInteractionType<APIApplicationCommandInteraction>
  type MyMessageComponentInteraction = ReplaceInteractionType<APIMessageComponentInteraction>
  type MyAutocompleteInteraction = ReplaceInteractionType<APIApplicationCommandAutocompleteInteraction>
  type MyModalSubmitInteraction = ReplaceInteractionType<APIModalSubmitInteraction>

  type MyInteraction = ReplaceInteractionType<APIInteraction>
}

export {}
