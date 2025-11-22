"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeTravelerPostcard } from './TimeTravelerPostcard';
import { CrisisSimulator } from './CrisisSimulator';

interface GuidedDiscoveryProps {
  onComplete: (score: number) => void;
}

const DEFAULT_POSTCARD_SCENARIO = {
  title: "The Time Machine",
  description: "You travel 20 years into the future. Two versions of yourself exist.",
  scenarioA: {
    id: 'safe' as const,
    title: "The Safe Path",
    description: "You lived comfortably but never took big risks. You have enough, but wonder 'what if'.",
    imagePrompt: "A cozy but modest home, peaceful garden, elderly person reading a book."
  },
  scenarioB: {
    id: 'risky' as const,
    title: "The Bold Path",
    description: "You took chances. You had failures, but also massive successes. You built an empire.",
    imagePrompt: "A modern skyscraper office, looking out over a city, elderly person in a suit."
  }
};

const DEFAULT_CRISIS_SCENARIO = {
  headline: "Global Market Crash",
  newsBody: "Markets have tumbled 20% overnight due to unexpected geopolitical tensions.",
  impactData: {
    amountLost: "€15,000",
    timeLost: "2 Years"
  },
  reactions: [
    { id: 'panic', label: 'Sell Everything', description: 'Stop the bleeding immediately.', icon: '😱' },
    { id: 'safety', label: 'Move to Cash', description: 'Wait for things to settle.', icon: '🛡️' },
    { id: 'ignore', label: 'Do Nothing', description: 'Stick to the long-term plan.', icon: '🧘' },
    { id: 'opportunity', label: 'Buy More', description: 'Stocks are on sale!', icon: '🚀' }
  ]
};

export const GuidedDiscovery: React.FC<GuidedDiscoveryProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'postcard' | 'crisis' | 'horizon'>('postcard');
  const [answers, setAnswers] = useState({
    riskPreference: '',
    reaction: '',
    timeHorizon: ''
  });

  const handlePostcardComplete = (preference: 'safe' | 'risky') => {
    setAnswers(prev => ({ ...prev, riskPreference: preference }));
    setStep('crisis');
  };

  const handleCrisisComplete = (reaction: string) => {
    setAnswers(prev => ({ ...prev, reaction }));
    setStep('horizon');
  };

  const handleHorizonComplete = (horizon: 'short' | 'medium' | 'long') => {
    const finalAnswers = { ...answers, timeHorizon: horizon };
    setAnswers(finalAnswers);

    // Calculate Score
    let score = 50;

    // 1. Postcard (Base Preference)
    if (finalAnswers.riskPreference === 'safe') score -= 10;
    if (finalAnswers.riskPreference === 'risky') score += 20;

    // 2. Crisis Reaction (Emotional Resilience)
    if (finalAnswers.reaction === 'panic') score -= 30;
    if (finalAnswers.reaction === 'safety') score -= 10;
    if (finalAnswers.reaction === 'ignore') score += 5;
    if (finalAnswers.reaction === 'opportunity') score += 25;

    // 3. Time Horizon (Capacity)
    if (finalAnswers.timeHorizon === 'short') score -= 20;
    if (finalAnswers.timeHorizon === 'long') score += 20;

    // Clamp
    score = Math.max(10, Math.min(90, score));

    onComplete(score);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">

        {step === 'postcard' && (
          <motion.div
            key="postcard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full"
          >
            <TimeTravelerPostcard 
              scenario={DEFAULT_POSTCARD_SCENARIO}
              onComplete={handlePostcardComplete} 
            />
          </motion.div>
        )}

        {step === 'crisis' && (
          <motion.div
            key="crisis"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full"
          >
            <CrisisSimulator 
              scenario={DEFAULT_CRISIS_SCENARIO}
              onComplete={(id) => handleCrisisComplete(id)} 
            />
          </motion.div>
        )}

        {step === 'horizon' && (
          <motion.div
            key="horizon"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl mx-auto p-4"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                One last thing.
              </h2>
              <p className="text-xl text-gray-400">
                When do you need to access this money?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Less than 3 years", value: 'short', icon: '⏱️' },
                { label: "3 - 10 years", value: 'medium', icon: '📅' },
                { label: "10+ years (Long term)", value: 'long', icon: '🚀' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHorizonComplete(option.value as 'short' | 'medium' | 'long')}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 text-left flex items-center gap-4 hover:border-inaia-gold/30 transition-all"
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className="text-lg font-medium text-gray-200">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

