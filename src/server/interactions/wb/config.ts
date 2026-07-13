import { Type } from "@google/genai";
import { z } from "zod";

export const toGenaiPrompt = (name: string) => `
현재 일자(${new Date().toISOString().split('T')[0]})를 기준으로, 시장에서 거래되는 최신 주가를 반드시 확인하라.
이 종목(티커)을 워런 버핏의 4가지 투자 철학 (12개 항목) 관점에서 분석하라: ${name}.
만약 해당 종목이 개별 기업이 아니라 ETF나 시장 지수(Index)라면, 워런 버핏이 인덱스 펀드 투자를 긍정적으로 보았던 철학을 바탕으로 펀드 자체와 편입된 기초 자산들의 평균적인 펀더멘탈에 맞게 평가하라.
만약 파라미터로 제공된 종목이나 티커명(${name})이 존재하지 않거나 인식할 수 없는 경우, "found" 키를 false로 설정하여 반환하라.

반환 JSON의 각 필드 설명:
- found: boolean - 종목 식별 가능 여부
- title: 분석한 종목의 기업명
- currentPrice: 현재 주가 (예: "$150.25", "₩50,000")
- targetPrice: 목표 주가 / 적정 가치 (모를 경우 "N/A")
- score*: 각각 5점 만점 - Warren Buffett의 투자 원칙 12개 항목별 평가
- summary: 3~4문장 종합 의견
- action: 최종 투자 의견 (Strong Buy, Buy, Hold, Sell 등)
`;

export const genaiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    found: {
      type: Type.BOOLEAN,
      description: "종목을 식별가능하면 True, 그렇지 않으면 False.",
    },
    title: {
      type: Type.STRING,
      description: "분석한 종목/펀드/지수 등의 이름.",
    },
    currentPrice: {
      type: Type.STRING,
      description: "현재 거래 주가. 예: '$150.25', '₩50,000'. 만약 알 수 없는 경우 '없음'로 반환.",
    },
    targetPrice: {
      type: Type.STRING,
      description: "내재 가치를 바탕으로 산출한 미래 현금 흐름(DCF) 또는 컨센서스에 의한 1주당 적정 가치. 예: '$150.25', '₩50,000'. 만약 알 수 없는 경우 '없음'로 반환.",
    },
    scoreBusinessSimplicity: { type: Type.NUMBER, description: "평가 (1-5): 단순하고 이해 가능한 비즈니스 모델; 이 회사가 돈을 버는 방식을 명확히 설명할 수 있는가?" },
    scoreBusinessHistory: { type: Type.NUMBER, description: "평가 (1-5): 안정적인 영업 이력; 최소 10년 이상 꾸준하고 안정적인 실적을 내고 있는가?" },
    scoreBusinessMoat: { type: Type.NUMBER, description: "평가 (1-5): 장기적 경제적 해자; 강력한 브랜드, 전환 비용, 네트워크 효과, 원가 우위 등 진입장벽이 있는가?" },
    scoreManagementCapitalAllocation: { type: Type.NUMBER, description: "평가 (1-5): 자본 배분의 합리성; 이익을 재투자하여 높은 수익률을 내거나, 배당/자사주 매입으로 환원하는가?" },
    scoreManagementTransparency: { type: Type.NUMBER, description: "평가 (1-5): 경영진의 투명성; 실패나 실수를 숨기지 않고 주주들과 투명하게 소통하는가?" },
    scoreManagementInstitutionalImperative: { type: Type.NUMBER, description: "평가 (1-5): 타성의 늪 회피; 맹목적인 업계 관행 추종이나 무리한 M&A를 피하고 있는가?" },
    scoreFinancialROE: { type: Type.NUMBER, description: "평가 (1-5): 높은 자기자본이익률(ROE) 유지; 단순 EPS 증가가 아닌, 15% 이상의 높은 ROE를 꾸준히 유지하는가?" },
    scoreFinancialFCF: { type: Type.NUMBER, description: "평가 (1-5): '주주 이익(Owner Earnings)' 창출력; 회계상 이익뿐 아니라 잉여현금흐름(FCF)이 풍부하게 발생하는가?" },
    scoreFinancialMargin: { type: Type.NUMBER, description: "평가 (1-5): 높은 매출액 대비 이익률; 가격 결정력을 바탕으로 인플레이션 시기에도 높은 마진을 유지하는가?" },
    scoreFinancialOneDollarRule: { type: Type.NUMBER, description: "평가 (1-5): 1달러의 유보 원칙 달성 여부; 회사에 유보시킨 1달러가 시장에서 1달러 이상의 시가총액 증가를 만들었는가?" },
    scoreMarketIntrinsicValue: { type: Type.NUMBER, description: "평가 (1-5): 내재 가치 (Intrinsic Value) 산출; 미래 현금흐름(DCF) 등을 예측하여 산출한 1주당 정당한 가치는 얼마인가?" },
    scoreMarketSafetyMargin: { type: Type.NUMBER, description: "평가 (1-5): 안전 마진 (Margin of Safety) 확보; 현재 주가가 내재 가치 대비 얼마나 저렴하게 거래되는가?" },
    summary: {
      type: Type.STRING,
      description: "AI 분석 종합 의견; 모든 관점을 종합하여 이 기업이 장기 투자에 적합한지 서술",
    },
    action: {
      type: Type.STRING,
      description: "최종 투자 의견; 적극 매수, 매수, 분할매수, 관망/보유, 매도, 적극 매도 등",
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
