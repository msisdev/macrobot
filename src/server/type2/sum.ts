import { InteractionResponseType } from "discord-interactions";
import { SUM_COMMAND } from "../commands";
import { ApplicationCommandInteractionHandler } from "./config";
import { GoogleGenAI, Type } from "@google/genai";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The title of the content at the provided URL",
    },
    source: {
      type: Type.STRING,
      description: "The source of the content at the provided URL. For example, the name of the website or publication.",
    },
    date: {
      type: Type.STRING,
      description: "The publication date of the content at the provided URL in YYYY-MM-DD format",
    },
    content: {
      type: Type.STRING,
      description: "The markdown formatted summary of the content at the provided URL in Korean",
    },
  },
  required: ["title", "date", "content"],
}

const getPrompt = (url: string) => `
이 URL을 요약하라: ${url}.
결과를 "title", "source", "date", "content" 키를 가진 JSON 형식으로 엄격하게 반환하라.
- "title"은 제공된 URL의 콘텐츠의 제목이어야한다.
- "date"는 제공된 URL의 콘텐츠의 발행 날짜여야 하며, YYYY-MM-DD 형식이어야한다.
- "source"는 제공된 URL의 콘텐츠의 출처여야한다. 예를 들어, 웹사이트나 출판물의 이름이 될 수 있다. 유튜브의 경우 채널명이 될 수 있다.
- "content"은 제공된 URL의 콘텐츠에 대한 한국어로 된 마크다운 형식의 요약이어야한다. 유튜브의 경우 영상의 주요 내용을 요약해야한다.
  최상단 \`#\` 제목은 생략하고 \`##\` 부터 시작하라.
  건조체 또는 간결체로 작성하라.
  제목을 제외한 모든 내용은 다양한 깊이의 리스트 형식으로 작성하라. 줄바꿈을 활용하되 최소한으로 사용하라. 
`

const getResponse = (url: string, parsed: any) => {
  const content = `# [${parsed.title}](${url})\n- ${parsed.date}\n- ${parsed.source}\n\n${parsed.content}`;
  return content.replace(/\n/g, ' \n ');
}

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  const data = msg.data;
  const url = (data && 'options' in data && Array.isArray(data.options)) ? (data.options?.[0] as any)?.value : undefined;

  try {
    new URL(url)
  } catch (err) {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Please provide a valid URL.',
      },
    });
  }

  const applicationId = msg.application_id;
  const interactionToken = msg.token;

  ctx.waitUntil((async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Default or typical models 
        contents: getPrompt(url),
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (!parsed.title || !parsed.date || !parsed.content) {
        throw new Error('Invalid response schema');
      }

      await fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: getResponse(url, parsed) }),
      });
    } catch (error) {
      await fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Failed to summarize the URL or invalid response.',
        }),
      });
    }
  })());

  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
}

export default {
  name: SUM_COMMAND.name.toLowerCase(),
  handle,
}
