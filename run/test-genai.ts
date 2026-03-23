import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The title of the content at the provided URL",
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
};

const getPrompt = (url: string) => `
이 URL을 요약하라: ${url}.
결과를 "title", "date", "content" 키를 가진 JSON 형식으로 엄격하게 반환하라.
- "title"은 제공된 URL의 콘텐츠의 제목이어야한다.
- "content"은 제공된 URL의 콘텐츠에 대한 한국어로 된 마크다운 형식의 요약이어야한다.
  최상단 \`#\` 제목은 생략하고 \`##\` 부터 시작하라.
  건조체 또는 간결체로 작성하라.
  제목을 제외한 모든 내용은 다양한 깊이의 리스트 형식으로 작성하라.
- "date"는 제공된 URL의 콘텐츠의 발행 날짜여야 하며, YYYY-MM-DD 형식이어야한다.
`;

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Please provide a URL as an argument.");
    process.exit(1);
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: getPrompt(url),
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });
  
  const parsed = JSON.parse(response.text || '{}');
  const content = `# ${parsed.title}\n${parsed.date}\n${parsed.content}`;
  console.log(content);
}

main();

/*
$ bun run/test-genai.ts https://www.jpmorgan.com/insights/global-research/commodities/gold-prices
{
  "summary": "### J.P. Morgan Gold Price Outlook Summary\n\nJ.P. Morgan Research indicates that gold prices have reached record highs in 2024, driven by shifting monetary policies and geopolitical tensions. Key points include:\n\n*   **Federal Reserve Influence:** The primary catalyst for gold's upward trajectory is the cycle of interest rate cuts by the Federal Reserve. Lower real yields historically support gold prices by reducing the opportunity cost of holding non-yielding assets.\n*   **Central Bank Demand:** Continued robust purchasing by central banks remains a structural tailwind for the market, providing a solid floor for prices even during periods of volatility.\n*   **Price Projections:** Analysts forecast gold prices to average around **$2,500/oz** by the fourth quarter of 2024, with the potential for further growth reaching **$2,600/oz** in 2025.\n*   **Investment Flows:** A return of retail investor interest and increased inflows into gold-backed ETFs are expected to further bolster price momentum as the Fed's easing cycle progresses."
}
*/
