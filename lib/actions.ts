'use server';

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { INAIA_PRODUCTS } from './products';

// Schema for the AI's recommendation logic
const RecommendationSchema = z.object({
  summary: z.string().describe("A 1-sentence persuasive summary of why this mix fits the user."),
  allocations: z.array(z.object({
    productId: z.string(),
    percentage: z.number(),
    reasoning: z.string().describe("Why this specific product was chosen for this user's specific goal."),
  })),
  projectedOutcome: z.string().describe("A short vision of what this portfolio could achieve in 10 years.")
});

export async function generatePortfolioRecommendation(
  goals: { type: string; cost: number; year: number }[],
  riskScore: number,
  dreamText?: string
) {
  // Context construction
  const context = `
    User Risk Score: ${riskScore}/100 (0=Safe, 100=Aggressive).
    User Goals: ${JSON.stringify(goals)}.
    User Dream/Vision: "${dreamText || 'Build wealth ethically'}".
    
    Available INAIA Products:
    ${JSON.stringify(INAIA_PRODUCTS)}
    
    Task:
    Create a custom portfolio allocation.
    - If risk is LOW (<40), prioritize Gold Standard and Platinum.
    - If risk is HIGH (>70), prioritize Global Equity Fund.
    - If user mentions "Inflation" or "Crisis" in dream, boost Gold.
    - If user mentions "Retirement" (long term), boost Equity.
    
    Allocations must sum to 100%.
  `;

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: RecommendationSchema,
      prompt: context,
    });

    return object;
  } catch (error) {
    console.error("AI Generation Failed:", error);
    // Fallback logic (Deterministic) if AI fails/no key
    return {
      summary: "Based on your risk profile, we recommend a balanced growth strategy.",
      allocations: [
        { productId: 'global-fund', percentage: 50, reasoning: "Core growth engine." },
        { productId: 'gold-standard', percentage: 30, reasoning: "Stability and inflation hedge." },
        { productId: 'platinum-income', percentage: 20, reasoning: "Steady income." }
      ],
      projectedOutcome: "Steady growth aiming for 8% annual returns."
    };
  }
}

