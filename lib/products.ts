import { z } from 'zod';

// Define INAIA Products Schema
export const InaiaProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Gold', 'Silver', 'ETF', 'Platinum']),
  description: z.string(),
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  minInvestment: z.number(),
  expectedReturn: z.string(), // e.g., "8-12%"
});

export type InaiaProduct = z.infer<typeof InaiaProductSchema>;

// Hardcoded products for context grounding (RAG-lite)
export const INAIA_PRODUCTS: InaiaProduct[] = [
  {
    id: 'gold-standard',
    name: 'INAIA Gold Standard',
    type: 'Gold',
    description: 'Physical 24k Gold stored in high-security vaults in Switzerland. The ultimate inflation hedge.',
    riskLevel: 'Low',
    minInvestment: 50,
    expectedReturn: 'Inflation + 2%'
  },
  {
    id: 'silver-growth',
    name: 'INAIA Silver Growth',
    type: 'Silver',
    description: 'Physical Silver. Historically undervalued compared to gold, offering higher growth potential.',
    riskLevel: 'Medium',
    minInvestment: 50,
    expectedReturn: 'Inflation + 4%'
  },
  {
    id: 'global-fund',
    name: 'INAIA Global Equity Fund',
    type: 'ETF',
    description: 'A curated basket of global stocks (Apple, Tesla, etc.) filtered for responsible investing.',
    riskLevel: 'High',
    minInvestment: 100,
    expectedReturn: '8-12%'
  },
  {
    id: 'platinum-income',
    name: 'INAIA Platinum Income',
    type: 'Platinum',
    description: 'Fixed-income assets providing steady rental-based returns. Stable and predictable.',
    riskLevel: 'Low',
    minInvestment: 500,
    expectedReturn: '4-6%'
  }
];
