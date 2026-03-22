export type DiscordCommand = {
  name: string;
  description: string;
  options?: Array<{
    name: string;
    description: string;
    type: number;
    required?: boolean;
  }>;
}

// for tutorial
export const AWW_COMMAND: DiscordCommand = {
  name: 'aww',
  description: 'Drop some cuteness on this channel.',
}

// for tutorial
export const INVITE_COMMAND: DiscordCommand = {
  name: 'invite',
  description: 'Get an invite link to add this bot to your server.',
}

export const SUM_COMMAND: DiscordCommand = {
  name: 'sum',
  description: 'Submit a url and the bot will summarize it for you.',
  options: [
    {
      name: 'url',
      description: 'The URL of the article to summarize.',
      type: 3, // Discord ApplicationCommandOptionType.STRING
      required: true,
    },
  ],
}

export const HELLO_COMMAND: DiscordCommand = {
  name: 'hello',
  description: 'Say hello to the bot.',
  options: [
    {
      name: 'name',
      description: 'The name of the user to say hello to.',
      type: 3, // Discord ApplicationCommandOptionType.STRING
      required: false,
    },
  ],
}

export const commands = [
  AWW_COMMAND,
  HELLO_COMMAND,
  INVITE_COMMAND,
  SUM_COMMAND,
];
