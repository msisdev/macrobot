import { z } from "zod";
import { queueBodySchema } from "./config";
import { updateDiscordMessage } from "@/src/server/util/discord";
import { generateSummary } from "./gemini";

export const toDiscordContent = (name: string, parsed: any) => {
  if (parsed.found === false) {
    return `❌ 분석 실패: 종목 또는 티커 '${name}'을(를) 찾을 수 없습니다. 정확한 명칭이나 티커 기호를 입력해 주세요.`;
  }
  
  const content = `# 워런 버핏 투자 분석: ${parsed.title} (${name})
- **현재 주가**: ${parsed.currentPrice}

| 부문 | 평가 항목 | 점수 |
| :--- | :--- | :--- |
| **🏢 사업** | 단순하고 이해 가능한가? | ${'⭐'.repeat(parsed.scoreBusinessSimplicity)} |
| | 안정적인 영업 이력을 가졌는가? | ${'⭐'.repeat(parsed.scoreBusinessHistory)} |
| | 장기적 경제적 해자가 있는가? | ${'⭐'.repeat(parsed.scoreBusinessMoat)} |
| **👥 경영진** | 자본 배분의 합리성 | ${'⭐'.repeat(parsed.scoreManagementCapitalAllocation)} |
| | 경영진의 투명성 | ${'⭐'.repeat(parsed.scoreManagementTransparency)} |
| | 타성의 늪 회피 여부 | ${'⭐'.repeat(parsed.scoreManagementInstitutionalImperative)} |
| **📊 재무** | 높은 ROE 유지 | ${'⭐'.repeat(parsed.scoreFinancialROE)} |
| | 잉여현금흐름 창출력 | ${'⭐'.repeat(parsed.scoreFinancialFCF)} |
| | 높은 매출액 대비 이익률 | ${'⭐'.repeat(parsed.scoreFinancialMargin)} |
| | 1달러의 유보 원칙 달성 여부 | ${'⭐'.repeat(parsed.scoreFinancialOneDollarRule)} |
| **⚖️ 가치와 가격** | 내재 가치 산출에 따른 매력도 | ${'⭐'.repeat(parsed.scoreMarketIntrinsicValue)} |
| | 안전 마진 확보 수준 | ${'⭐'.repeat(parsed.scoreMarketSafetyMargin)} |

## 💡 AI 분석 종합 의견
${parsed.summary}

## 🎯 최종 Action
**${parsed.action}**`;
  return content.replace(/\\n/g, '\n');
}

export const processSum = async (env: Env, body: z.output<typeof queueBodySchema>) => {
  try {
    const parsed = await generateSummary(env.GOOGLE_GENAI_API_KEY, body.name);

    await updateDiscordMessage(
      body.applicationId,
      body.interactionToken,
      toDiscordContent(body.name, parsed),
    )
  } catch (error) {
    await updateDiscordMessage(
      body.applicationId,
      body.interactionToken,
      'Failed to summarize the URL or invalid response.',
    )
  }
}
