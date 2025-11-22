import { LifeGoal } from '../components/LifeGoalsGalaxy';

// Mocked response for now, simulating structured output from an LLM
// In a real app, this would call OpenAI/Gemini with the user's text
export const generateGoalsFromDream = async (dreamText: string): Promise<LifeGoal[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 2000));

  const keywords = dreamText.toLowerCase();
  const newGoals: LifeGoal[] = [];

  const currentYear = new Date().getFullYear();

  if (keywords.includes('house') || keywords.includes('home') || keywords.includes('villa') || keywords.includes('apartment')) {
    newGoals.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'House',
      cost: 500000, // AI would infer cost based on location mentioned (e.g., London vs Bali)
      year: currentYear + 10, // AI would infer timeline
    });
  }

  if (keywords.includes('travel') || keywords.includes('trip') || keywords.includes('tour') || keywords.includes('hajj') || keywords.includes('umrah') || keywords.includes('mecca')) {
    newGoals.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'Travel',
      cost: 15000,
      year: currentYear + 5,
    });
  }
  
  if (keywords.includes('retire') || keywords.includes('retirement') || keywords.includes('stop working')) {
    newGoals.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'Retirement',
      cost: 800000,
      year: currentYear + 25,
    });
  }

  if (keywords.includes('school') || keywords.includes('education') || keywords.includes('university') || keywords.includes('college')) {
    newGoals.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'Education',
      cost: 60000,
      year: currentYear + 15,
    });
  }
  
  if (keywords.includes('business') || keywords.includes('company') || keywords.includes('startup')) {
    newGoals.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'Business',
      cost: 100000,
      year: currentYear + 8,
    });
  }
  
  // Fallback if no specific keywords match but input is valid length
  if (newGoals.length === 0 && dreamText.length > 10) {
     // Assume general wealth building
     newGoals.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'Retirement',
        cost: 1000000,
        year: currentYear + 20,
     });
  }

  return newGoals;
};

export interface Scenario {
  id: string;
  title: string;
  description: string;
  impact: number; // Percentage impact on wealth (e.g., -0.2 for -20%)
  color: string;
}

export const generateScenarios = async (riskScore: number): Promise<Scenario[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock scenario generation based on riskScore
  // In production, this would call an LLM to generate tailored scenarios
  if (riskScore < 40) {
    return [
      {
        id: 'inflation',
        title: 'High Inflation',
        description: 'Inflation rises to 8%. Your gold holdings protect your purchasing power.',
        impact: 0.05, // Positive relative to cash
        color: 'text-green-400'
      },
      {
        id: 'market-correction',
        title: 'Market Dip',
        description: 'Global markets drop 10%. Your conservative allocation minimizes losses.',
        impact: -0.03,
        color: 'text-orange-400'
      },
      {
        id: 'recession',
        title: 'Global Recession',
        description: 'Economic slowdown. Your capital preservation strategy keeps you safe.',
        impact: -0.05,
        color: 'text-yellow-400'
      }
    ];
  } else {
    return [
      {
        id: 'inflation',
        title: 'High Inflation (8%)',
        description: 'Global supply chains disrupt, pushing inflation up. Cash loses value rapidly.',
        impact: -0.15,
        color: 'text-red-400'
      },
      {
        id: 'market-correction',
        title: 'Market Correction',
        description: 'A temporary 20% dip in global equities due to geopolitical tension.',
        impact: -0.2,
        color: 'text-orange-400'
      },
      {
        id: 'gold-rally',
        title: 'Gold Bull Run',
        description: 'Economic uncertainty drives investors to safe havens. Gold hits record highs.',
        impact: 0.25, // Positive impact if they have gold
        color: 'text-green-400'
      }
    ];
  }
};

// New function for generating follow-up questions
export const generateFollowUpQuestion = async (dreamText: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lower = dreamText.toLowerCase();
  if (lower.includes('travel') || lower.includes('trip') || lower.includes('hajj') || lower.includes('umrah')) return "Where is the first place you want to visit?";
  if (lower.includes('house')) return "Do you have a specific location in mind for this property?";
  if (lower.includes('retire')) return "What kind of lifestyle do you envision for your retirement? (e.g., Travel, Quiet, Family)";
  
  return "What is the most important emotion you want to feel when you achieve this?";
};
