export type DiscordCommand = {
  name: string;
  description: string;
}

export const AWW_COMMAND: DiscordCommand = {
  name: 'aww',
  description: 'Drop some cuteness on this channel.',
}

export const INVITE_COMMAND: DiscordCommand = {
  name: 'invite',
  description: 'Get an invite link to add this bot to your server.',
}

export const commands = [AWW_COMMAND, INVITE_COMMAND];
