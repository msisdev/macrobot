import { Type } from "@google/genai";
import { z } from "zod";

export const toGenaiPrompt = (url: string) => `
이 URL을 요약하라: ${url}.
결과를 "title", "source", "date", "sentiment", "sentimentEmoji", "content" 키를 가진 JSON 형식으로 엄격하게 반환하라.
- "title"은 제공된 URL의 콘텐츠의 제목이어야한다.
- "date"는 제공된 URL의 콘텐츠의 발행 날짜여야 한다.
  현재 일자(${new Date().toISOString().split('T')[0]})를 기준으로 날짜를 파악하고 계산하라.
  YYYY-MM-DD 형식으로 작성하라.
  발행 날짜를 정확히 알 수 없다면 "알 수 없음"으로 표기하라.
- "source"는 제공된 URL의 콘텐츠의 출처여야한다. 예를 들어, 웹사이트나 출판물의 이름이 될 수 있다. 유튜브의 경우 채널명이 될 수 있다.
- "sentiment"는 이 콘텐츠 내용에 대한 사람들의 반응, 주가의 향방 등 종합 평가로서 긍정적인지 여부를 의미한다. "호재", "악재", "복합적" 중 하나로 분류하라.
- "sentimentEmoji"는 해당 콘텐츠의 전반적인 분위기나 뉘앙스를 가장 잘 담아내는 이모지 1개를 자유롭게 선택하라. 정해진 틀에서 벗어나 더 넓고 풍부한 느낌을 표현하면 좋다.
- "content"은 제공된 URL의 콘텐츠에 대한 한국어로 된 마크다운 형식의 요약이어야한다.
  유튜브의 경우 영상의 주요 내용을 요약해야한다.
  건조체 또는 간결체로 작성하라.
  제목은 생략하고 각 소제목을 \`##\`부터 사용하라.
  모든 내용은 들여쓰기를 0칸 또는 1칸을 사용한 리스트 형식으로 작성하라.
  줄바꿈을 활용하되 최소한으로 사용하라. 
`

export const genaiResponseSchema = {
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
    sentiment: {
      type: Type.STRING,
      description: "The overall sentiment of the content, categorized as '호재', '악재', or '복합적'",
    },
    sentimentEmoji: {
      type: Type.STRING,
      description: "A single emoji representing the sentiment",
    },
    content: {
      type: Type.STRING,
      description: "The markdown formatted summary of the content at the provided URL in Korean",
    },
  },
  required: ["title", "date", "sentiment", "sentimentEmoji", "content"],
}

export const queueBodySchema = z.object({
  type: z.literal('sum'),
  url: z.string(),
  applicationId: z.string(),
  interactionToken: z.string(),
})
