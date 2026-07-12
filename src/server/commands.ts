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
  description: '주어진 URL의 글을 요약해줍니다.',
  options: [
    {
      name: 'url',
      description: '요약할 글의 URL 주소',
      type: 3, // Discord ApplicationCommandOptionType.STRING
      required: true,
    },
  ],
}

export const WB_COMMAND: DiscordCommand = {
  name: 'wb',
  description: '워런 버핏의 투자 철학을 바탕으로 선택한 종목을 분석해줍니다.',
  options: [
    {
      name: 'name',
      description: '분석할 종목 이름 또는 종목 코드(티커)',
      type: 3, // Discord ApplicationCommandOptionType.STRING
      required: true,
    },
  ],
}

export const HELLO_COMMAND: DiscordCommand = {
  name: 'hello',
  description: '봇에게 인사를 건네보세요.',
  options: [
    {
      name: 'name',
      description: '인사할 대상의 이름',
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
