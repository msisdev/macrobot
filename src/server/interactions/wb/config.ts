import { Type } from "@google/genai";
import { z } from "zod";

export const toGenaiPrompt = (name: string) => `
현재 일자(${new Date().toISOString().split('T')[0]})를 기준으로, 시장에서 거래되는 최신 주가를 반드시 확인하라.
이 종목(티커)을 워런 버핏의 4가지 투자 철학 (12개 항목) 관점에서 분석하라: ${name}.
만약 해당 종목이 개별 기업이 아니라 ETF나 시장 지수(Index)라면, 워런 버핏이 인덱스 펀드 투자를 긍정적으로 보았던 철학을 바탕으로 펀드 자체(운용사의 신뢰도, 낮은 수수료 등)와 편입된 기초 자산들의 평균적인 펀더멘탈에 맞게 12개 항목의 의미를 유연하게 적용하여 평가하라.
만약 파라미터로 제공된 종목이나 티커명(${name})이 존재하지 않거나 인식할 수 없는 경우, "found" 키를 false로 설정하여 반환하고 나머지 필드는 비우거나 0으로 채워라.
인식하거나 분석이 가능하다면 "found" 키를 true로 설정하여 반환하라.
결과를 "found", "title", "currentPrice", "targetPrice", "scoreBusinessSimplicity", "scoreBusinessHistory", "scoreBusinessMoat", "scoreManagementCapitalAllocation", "scoreManagementTransparency", "scoreManagementInstitutionalImperative", "scoreFinancialROE", "scoreFinancialFCF", "scoreFinancialMargin", "scoreFinancialOneDollarRule", "scoreMarketIntrinsicValue", "scoreMarketSafetyMargin", "summary", "action" 키를 가진 JSON 형식으로 엄격하게 반환하라.
- "found"는 주어진 종목이나 티커를 식별하여 분석이 가능한지 여부 (boolean)
- "title"은 분석한 종목의 기업명이어야 한다.
- "currentPrice"는 확인한 이 종목의 현재(최신) 주가이다 (예: "$150.25", "₩50,000").
- "targetPrice"는 AI의 분석을 통해 도출한 적정 가치 혹은 목표 주가이다. 만약 추정할 수 없거나 모른다면 "N/A" 또는 "알 수 없음"으로 기입하라 (예: "$180", "₩65,000" 혹은 "N/A").
- "scoreBusinessSimplicity": 단순하고 이해 가능한 비즈니스 모델인가 (5점 만점 숫자)
- "scoreBusinessHistory": 안정적인 영업 이력을 가졌는가 (5점 만점 숫자)
- "scoreBusinessMoat": 장기적 경제적 해자가 있는가 (5점 만점 숫자)
- "scoreManagementCapitalAllocation": 자본 배분의 합리성 (5점 만점 숫자)
- "scoreManagementTransparency": 경영진의 투명성 (5점 만점 숫자)
- "scoreManagementInstitutionalImperative": 타성의 늪 회피 여부 (5점 만점 숫자)
- "scoreFinancialROE": 높은 ROE 유지 (5점 만점 숫자)
- "scoreFinancialFCF": 잉여현금흐름 창출력 (5점 만점 숫자)
- "scoreFinancialMargin": 높은 매출액 대비 이익률 (5점 만점 숫자)
- "scoreFinancialOneDollarRule": 1달러의 유보 원칙 달성 여부 (5점 만점 숫자)
- "scoreMarketIntrinsicValue": 내재 가치 산출에 따른 매력도 (5점 만점 숫자)
- "scoreMarketSafetyMargin": 안전 마진 확보 수준 (5점 만점 숫자). 현재 가격("currentPrice")을 기준으로 가치를 판단하라.
- "summary"는 12개 항목 관점을 종합하여 이 기업이 장기 투자에 적합한지에 대한 종합 의견 3~4문장이다.
- "action"은 현재 가격("currentPrice")을 바탕으로 한 최종 투자 의견(예: "Strong Buy", "Buy", "Accumulate (분할 매수)", "Hold", "Sell", "Strong Sell" 등)이다. 영어 원문이나 한글 등 직관적인 표현을 자유롭게 사용하라.
`;

export const genaiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    found: {
      type: Type.BOOLEAN,
      description: "True if the stock/ticker was successfully identified, false otherwise.",
    },
    title: {
      type: Type.STRING,
      description: "The name of the company",
    },
    currentPrice: {
      type: Type.STRING,
      description: "The current or latest known price of the stock/ticker",
    },
    targetPrice: {
      type: Type.STRING,
      description: "AI's estimated intrinsic value or target price for the stock/ticker. Use 'N/A' or 'Unknown' if uncertain.",
    },
    scoreBusinessSimplicity: { type: Type.NUMBER, description: "Score (1-5) for Simple and understandable business model" },
    scoreBusinessHistory: { type: Type.NUMBER, description: "Score (1-5) for Consistent and stable operating history" },
    scoreBusinessMoat: { type: Type.NUMBER, description: "Score (1-5) for Long-term economic moat / competitive advantage" },
    scoreManagementCapitalAllocation: { type: Type.NUMBER, description: "Score (1-5) for Rationality of capital allocation by management" },
    scoreManagementTransparency: { type: Type.NUMBER, description: "Score (1-5) for Candor and transparency of management" },
    scoreManagementInstitutionalImperative: { type: Type.NUMBER, description: "Score (1-5) for Resistance to the institutional imperative" },
    scoreFinancialROE: { type: Type.NUMBER, description: "Score (1-5) for Maintaining a high return on equity (ROE)" },
    scoreFinancialFCF: { type: Type.NUMBER, description: "Score (1-5) for Capability to generate abundant owner earnings (Free Cash Flow)" },
    scoreFinancialMargin: { type: Type.NUMBER, description: "Score (1-5) for High profit margins relative to sales" },
    scoreFinancialOneDollarRule: { type: Type.NUMBER, description: "Score (1-5) for The one-dollar premise (market value created per dollar retained)" },
    scoreMarketIntrinsicValue: { type: Type.NUMBER, description: "Score (1-5) for Attractiveness based on calculated intrinsic value" },
    scoreMarketSafetyMargin: { type: Type.NUMBER, description: "Score (1-5) for Sufficient margin of safety relative to current price" },
    summary: {
      type: Type.STRING,
      description: "Overall AI analysis and opinion on long-term investment",
    },
    action: {
      type: Type.STRING,
      description: "Final Action recommendation (e.g. Strong Buy, Buy, Accumulate, Hold, Sell, Strong Sell)",
    },
  },
  required: [
    "found", "title", "currentPrice", "targetPrice",
    "scoreBusinessSimplicity", "scoreBusinessHistory", "scoreBusinessMoat",
    "scoreManagementCapitalAllocation", "scoreManagementTransparency", "scoreManagementInstitutionalImperative",
    "scoreFinancialROE", "scoreFinancialFCF", "scoreFinancialMargin", "scoreFinancialOneDollarRule",
    "scoreMarketIntrinsicValue", "scoreMarketSafetyMargin",
    "summary", "action"
  ],
}

export const queueBodySchema = z.object({
  type: z.literal('wb'),
  name: z.string(),
  applicationId: z.string(),
  interactionToken: z.string(),
})
