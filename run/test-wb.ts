import { generateSummary } from "@/src/server/interactions/wb/gemini";
import { toDiscordContent } from "@/src/server/interactions/wb/queue";

async function main() {
  const name = process.argv[2] || "버크셔 해서웨이";

  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY!;
    const parsed = await generateSummary(apiKey, name);
    
    const content = toDiscordContent(name, parsed);

    console.log(content);
  } catch (error) {
    console.error(error);
  }
}

main();

/*
$ bun run/test-genai.ts https://www.jpmorgan.com/insights/global-research/commodities/gold-prices
{
  "summary": "### J.P. Morgan Gold Price Outlook Summary\n\nJ.P. Morgan Research indicates that gold prices have reached record highs in 2024, driven by shifting monetary policies and geopolitical tensions. Key points include:\n\n*   **Federal Reserve Influence:** The primary catalyst for gold's upward trajectory is the cycle of interest rate cuts by the Federal Reserve. Lower real yields historically support gold prices by reducing the opportunity cost of holding non-yielding assets.\n*   **Central Bank Demand:** Continued robust purchasing by central banks remains a structural tailwind for the market, providing a solid floor for prices even during periods of volatility.\n*   **Price Projections:** Analysts forecast gold prices to average around **$2,500/oz** by the fourth quarter of 2024, with the potential for further growth reaching **$2,600/oz** in 2025.\n*   **Investment Flows:** A return of retail investor interest and increased inflows into gold-backed ETFs are expected to further bolster price momentum as the Fed's easing cycle progresses."
}
*/
