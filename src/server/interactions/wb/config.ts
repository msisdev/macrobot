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
    scoreBusinessSimplicity: { type: Type.NUMBER, description: "Score (1-5) for Simple and understandable business model. Criteria: 5 = The revenue model is extremely clear and can be explained in one sentence; 4 = Mostly simple with minor complexity; 3 = Understandable but has some complex segments; 2 = Difficult to explain without in-depth knowledge; 1 = Highly complex or opaque business structure." },
    scoreBusinessHistory: { type: Type.NUMBER, description: "Score (1-5) for Consistent and stable operating history of at least 10 years. Criteria: 5 = 10+ years of uninterrupted profitability and steady revenue growth; 4 = Mostly stable with one minor down year; 3 = Generally positive but with notable cyclicality or a significant dip; 2 = Less than 10 years of history or frequent earnings volatility; 1 = Chronic losses or highly erratic performance." },
    scoreBusinessMoat: { type: Type.NUMBER, description: "Score (1-5) for Long-term economic moat (competitive advantage). Criteria: 5 = Possesses multiple strong moats (powerful brand, high switching costs, network effects, cost advantages, etc.); 4 = Has at least one clearly identifiable and durable moat; 3 = Some competitive advantages but they appear narrow or at risk of erosion; 2 = Weak or temporary competitive advantages; 1 = No discernible moat; operates in a commodity-like environment." },
    scoreManagementCapitalAllocation: { type: Type.NUMBER, description: "Score (1-5) for Rationality of capital allocation by management. Criteria: 5 = Consistently achieves high ROIC (>15%) on reinvestment and/or returns cash via buybacks and dividends when opportunities are scarce; 4 = Generally good allocator with a strong track record; 3 = Adequate but with some questionable investments; 2 = History of value-destructive acquisitions or poor reinvestment decisions; 1 = Chronic misallocation of capital." },
    scoreManagementTransparency: { type: Type.NUMBER, description: "Score (1-5) for Candor and transparency of management. Criteria: 5 = Management proactively acknowledges mistakes and communicates openly and honestly with shareholders; 4 = Generally transparent with minor reservations; 3 = Standard corporate communications; rarely admits errors publicly; 2 = Tends to obscure bad news or issue misleading guidance; 1 = History of deception, accounting irregularities, or significant lack of candor." },
    scoreManagementInstitutionalImperative: { type: Type.NUMBER, description: "Score (1-5) for Resistance to the institutional imperative (avoiding blind industry-following and reckless M&A). Criteria: 5 = Consistently acts independently; avoids unnecessary acquisitions and industry fads; 4 = Generally disciplined with rare exceptions; 3 = Some instances of following trends or making questionable deals; 2 = Notable pattern of value-dilutive acquisitions or trend-chasing; 1 = Routinely follows industry herd or pursues empire-building M&A." },
    scoreFinancialROE: { type: Type.NUMBER, description: "Score (1-5) for Maintaining a high return on equity (ROE) without excessive leverage. Criteria: 5 = Average ROE consistently above 20% over the last 5-10 years; 4 = Average ROE between 15-20%; 3 = Average ROE between 10-15%; 2 = Average ROE between 5-10% or highly inconsistent; 1 = Average ROE below 5% or negative." },
    scoreFinancialFCF: { type: Type.NUMBER, description: "Score (1-5) for Capability to generate abundant owner earnings (Free Cash Flow). Criteria: 5 = FCF conversion rate (FCF / Net Income) consistently above 90%; 4 = FCF conversion rate between 70-90%; 3 = FCF conversion rate between 50-70%; 2 = FCF conversion rate below 50% or highly volatile; 1 = Persistently negative or negligible free cash flow." },
    scoreFinancialMargin: { type: Type.NUMBER, description: "Score (1-5) for High and stable profit margins, reflecting pricing power and inflation defense. Criteria: 5 = 5-year average operating margin above 25%; 4 = 5-year average operating margin between 15-25%; 3 = 5-year average operating margin between 8-15%; 2 = 5-year average operating margin between 3-8% or shrinking trend; 1 = 5-year average operating margin below 3% or negative." },
    scoreFinancialOneDollarRule: { type: Type.NUMBER, description: "Score (1-5) for The one-dollar premise: every $1 of retained earnings should create at least $1 of market value. Criteria: 5 = Historically, each $1 retained has created more than $1.50 in market cap; 4 = Ratio between $1.00 and $1.50; 3 = Ratio approximately $1.00 (breakeven); 2 = Ratio below $1.00 (value destruction); 1 = Significant and persistent value destruction from retained earnings." },
    scoreMarketIntrinsicValue: { type: Type.NUMBER, description: "Score (1-5) for Attractiveness based on calculated intrinsic value (e.g., DCF analysis). Criteria: 5 = Current price is significantly below the calculated intrinsic value (deeply undervalued); 4 = Current price is moderately below intrinsic value; 3 = Current price is roughly at or near intrinsic value (fairly valued); 2 = Current price is moderately above intrinsic value (overvalued); 1 = Current price is significantly above intrinsic value (highly overvalued)." },
    scoreMarketSafetyMargin: { type: Type.NUMBER, description: "Score (1-5) for Sufficient margin of safety relative to current price. Criteria: 5 = Current price offers a margin of safety of 30% or more below intrinsic value; 4 = Margin of safety between 15-30%; 3 = Margin of safety between 5-15%; 2 = Little to no margin of safety (current price near or above intrinsic value); 1 = No margin of safety; the stock is trading at a significant premium to intrinsic value." },
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
