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
    inputType: z.enum(['text', 'choice']),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
      icon: z.string().optional()
    })).optional()
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
    projectedOutcome: z.string()
  })
});

const AdvisoryResponseSchema = z.discriminatedUnion('type', [
  QuestionSchema,
  PostcardSchema,
  CrisisSchema,
  ResultSchema
]);

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
    - You are guiding a short, impactful discovery session (Max 6 steps).
    - Analyze the history. If history length is > 5, YOU MUST GENERATE A RESULT.
    - Ensure you cover these key topics if missing:
      1. Life Goals (House, Kids, Retirement).
      2. Risk Attitude (via Postcard or indirect question).
      3. Investment Horizon.
      4. Financial Capacity (Monthly savings potential) - Ask this near the end.
    - DO NOT ask direct financial questions like "What is your risk tolerance?".
    - Ask INDIRECT, psychological, or lifestyle questions.
    - Options for multiple choice MUST be either 2 or 4 options (never 3).
    
    Progress Logic:
    - Calculate progress based on history length: Math.round(((history.length + 1) / 7) * 100).
    - Start at ~15% for the first question.
    - NEVER decrease progress.
    
    Guidelines:
    - Keep questions simple and relatable.
    - Avoid financial jargon.
    - If you have enough info (or history > 4), provide the RESULT.

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

