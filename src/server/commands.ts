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

export const WB_COMMAND: DiscordCommand = {
  name: 'wb',
  description: 'Submit a url and the bot will summarize it for you like sum.',
  options: [
    {
      name: 'name',
      description: '종목 이름 또는 티커',
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
  HELLO_COMMAND,
  SUM_COMMAND,
  WB_COMMAND,
];
