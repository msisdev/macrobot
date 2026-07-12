import { z } from "zod";
import { queueBodySchema } from "./config";
import { updateDiscordMessage } from "@/src/server/util/discord";
import { generateSummary } from "./gemini";

export const toDiscordContent = (name: string, parsed: any) => {
  if (parsed.found === false) {
    return `❌ 분석 실패: 종목 또는 티커 '${name}'을(를) 찾을 수 없습니다. 정확한 명칭이나 티커 기호를 입력해 주세요.`;
  }
  
  const renderStars = (score: number) => '⭐'.repeat(score) + '▪️'.repeat(5 - score);

  const content = `# 워런 버핏 투자 분석
- **분석 종목**: ${parsed.title}
- **현재 주가**: ${parsed.currentPrice}
- **목표 주가**: ${parsed.targetPrice}

## 📋 투자 철학 평가

### 🏢 사업 부문 (Business Tenets)
- 단순하고 이해 가능: ${renderStars(parsed.scoreBusinessSimplicity)}
- 안정적인 영업 이력: ${renderStars(parsed.scoreBusinessHistory)}
- 장기적 경제적 해자: ${renderStars(parsed.scoreBusinessMoat)}

### 👥 경영진 부문 (Management Tenets)
- 자본 배분의 합리성: ${renderStars(parsed.scoreManagementCapitalAllocation)}
- 경영진의 투명성: ${renderStars(parsed.scoreManagementTransparency)}
- 타성의 늪 회피 여부: ${renderStars(parsed.scoreManagementInstitutionalImperative)}

### 📊 재무 부문 (Financial Tenets)
- 높은 ROE 유지: ${renderStars(parsed.scoreFinancialROE)}
- 잉여현금흐름 창출력: ${renderStars(parsed.scoreFinancialFCF)}
- 높은 매출액 대비 이익률: ${renderStars(parsed.scoreFinancialMargin)}
- 1달러의 유보 원칙 달성: ${renderStars(parsed.scoreFinancialOneDollarRule)}

### ⚖️ 가치와 가격 부문 (Market Tenets)
- 내재 가치 산출에 따른 매력도: ${renderStars(parsed.scoreMarketIntrinsicValue)}
- 안전 마진 확보 수준: ${renderStars(parsed.scoreMarketSafetyMargin)}

## 💡 AI 종합 의견
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
