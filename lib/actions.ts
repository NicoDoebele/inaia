'use server';

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { INAIA_PRODUCTS } from './products';

// --- Types ---

// --- Types ---
// (Types are now inferred from Zod schemas below)

// --- Schemas ---

const QuestionSchema = z.object({
  type: z.literal('question'),
  progress: z.number(),
  content: z.object({
    question: z.string(),
    subtext: z.string().optional(),
    inputType: z.enum(['text', 'choice', 'slider']),
    // Options for choice
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
      icon: z.string().optional()
    })).optional(),
    // Config for slider
    sliderConfig: z.object({
      min: z.number(),
      max: z.number(),
      step: z.number(),
      unit: z.string().optional(),
      label: z.string().optional() // e.g., "Monthly Income"
    }).optional()
  })
});

const PostcardSchema = z.object({
  type: z.literal('postcard'),
  progress: z.number(),
  content: z.object({
    title: z.string(),
    description: z.string(),
    scenarioA: z.object({
      id: z.literal('safe'),
      title: z.string(),
      description: z.string(),
      imagePrompt: z.string().describe("A detailed prompt for an image generator to visualize the 'Safe' outcome.")
    }),
    scenarioB: z.object({
      id: z.literal('risky'),
      title: z.string(),
      description: z.string(),
      imagePrompt: z.string().describe("A detailed prompt for an image generator to visualize the 'Risky' outcome.")
    })
  })
});

const CrisisSchema = z.object({
  type: z.literal('crisis'),
  progress: z.number(),
  content: z.object({
    headline: z.string(),
    newsBody: z.string(),
    impactData: z.object({
      amountLost: z.string(), // e.g. "€18,000"
      timeLost: z.string()    // e.g. "3 years"
    }),
    reactions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      description: z.string(),
      icon: z.string()
    }))
  })
});

const ResultSchema = z.object({
  type: z.literal('result'),
  progress: z.literal(100),
  content: z.object({
    summary: z.string(),
    allocations: z.array(z.object({
      productId: z.string(),
      percentage: z.number(),
      reasoning: z.string()
    })),
    projectedOutcome: z.string(),
    investmentTiers: z.object({
      low: z.object({ amount: z.number(), label: z.string() }),
      mid: z.object({ amount: z.number(), label: z.string() }),
      high: z.object({ amount: z.number(), label: z.string() })
    }).describe("Suggested monthly investment amounts: Conservative (Low), Recommended (Mid), Aggressive (High)")
  })
});

const GalaxySchema = z.object({
  type: z.literal('galaxy'),
  progress: z.number(),
  content: z.object({
    // Galaxy might not need much content if it's just "show the galaxy", 
    // but we can pass initial goals or config if needed.
    // For now, let's keep it simple.
    title: z.string().optional(),
    description: z.string().optional()
  })
});

const AdvisoryResponseSchema = z.discriminatedUnion('type', [
  QuestionSchema,
  PostcardSchema,
  CrisisSchema,
  ResultSchema,
  GalaxySchema
]);

export type GalaxyStep = z.infer<typeof GalaxySchema>;

export type QuestionStep = z.infer<typeof QuestionSchema>;
export type PostcardStep = z.infer<typeof PostcardSchema>;
export type CrisisStep = z.infer<typeof CrisisSchema>;
export type ResultStep = z.infer<typeof ResultSchema>;

export type AdvisoryStep = z.infer<typeof AdvisoryResponseSchema>;

// --- Action ---

export async function getAdvisoryStep(history: { type: string; answer: string | number | object }[]): Promise<AdvisoryStep> {
  // 1. Construct Context
  const context = `
    You are an expert Islamic Wealth Advisor. Your goal is to construct a personalized portfolio from the following products:
    ${JSON.stringify(INAIA_PRODUCTS.map(p => ({ id: p.id, name: p.name, type: p.type, risk: p.riskLevel })))}

    Current Session History:
    ${JSON.stringify(history)}

    Instructions:
    - You are guiding a meaningful discovery session.
    - Analyze the history. The user may have already answered some hardcoded questions about life goals.
    - **CRITICAL**: Look for the 'galaxy' step in the history. It contains the user's specific life goals (e.g., House in 2030, Hajj in 2026).
    - Use this information to ask RELEVANT follow-up questions. 
      - Example: If they selected "House", ask about where they want to live or what style of home.
      - Example: If they selected "Business", ask about their entrepreneurial spirit.
    - Target roughly 10 questions total.
    - **CRITICAL**: DO NOT GENERATE A 'result' STEP IF HISTORY LENGTH IS LESS THAN 10.
    - If history length < 10, you MUST ask another question or a crisis scenario.
    - If history length >= 10, YOU MUST GENERATE A RESULT.
    - Ensure you cover these key topics if missing:
      1. Risk Attitude (via Postcard).
      2. Emotional Resilience -> Use 'crisis' scenario (MANDATORY before Result).
      3. (Financial Capacity is likely already answered in history).
    - DO NOT ask direct financial questions like "What is your risk tolerance?".
    - Ask INDIRECT, psychological, or lifestyle questions.
    - Options for multiple choice MUST be either 2 or 4 options (never 3).
    
    Progress Logic:
    - Calculate progress based on history length: Math.round((history.length / 10) * 100).
    - Start at 20% (since Galaxy + Monthly Investment = 2 steps done).
    - NEVER decrease progress.
    
    Guidelines:
    - Keep questions simple and relatable.
    - Avoid financial jargon.
    - Use 'slider' for money questions (e.g. "How much could you invest monthly?").
    - ALWAYS trigger a 'crisis' scenario step before the final result to test resilience.
    - IN THE CRISIS SCENARIO:
      1. Look for the user's monthly investment amount in the history (default to 500 if not found).
      2. Calculate the "3-Year Loss" amount: (Monthly Amount * 36).
      3. Populate 'impactData':
         - amountLost: "€" + calculated_amount
         - timeLost: "3 Years of Savings"
      4. In the 'newsBody', describe the market crash and mention the bankruptcy risk.

    - In the RESULT, you MUST provide 'investmentTiers' (Low, Mid, High).
    - 'Mid' MUST be the amount the user indicated in the slider (or a reasonable estimate if not explicit).
    - 'Low' should be ~70% of Mid.
    - 'High' should be ~130% of Mid.

    IMPORTANT: Your response must be a JSON object with a single key "step" containing the advisory step data.
  `;

  try {
    // Wrap the schema in an object to satisfy OpenAI's requirement for a root object
    const WrapperSchema = z.object({
      step: AdvisoryResponseSchema
    });

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: WrapperSchema,
      prompt: context,
    });

    return object.step;
  } catch (error) {
    console.error("AI Step Generation Failed:", error);
    // Fallback for safety
    return {
      type: 'question',
      progress: 0,
      content: {
        question: "What is your primary financial goal?",
        inputType: 'choice',
        options: [
          { label: "Wealth Preservation", value: "preservation", icon: "🛡️" },
          { label: "Aggressive Growth", value: "growth", icon: "🚀" }
        ]
      }
    };
  }
}

