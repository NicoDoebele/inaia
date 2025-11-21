"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'single' | 'multiple' | 'slider';
  options?: { label: string; value: any; icon?: string }[];
  explanation: string; // The "Why we ask this"
}

interface GuidedDiscoveryProps {
  onComplete: (data: any) => void;
}

const QUESTIONS: Question[] = [
  {
    id: 'experience',
    text: "Have you invested in Gold or Stocks before?",
    subtext: "There is no wrong answer. We just need to know where to start.",
    type: 'single',
    options: [
      { label: "I'm brand new", value: 'beginner', icon: '🌱' },
      { label: "I've dabbled a bit", value: 'intermediate', icon: '🌿' },
      { label: "I'm an experienced investor", value: 'expert', icon: '🌳' }
    ],
    explanation: "We ask this to adjust the complexity of your portfolio. Beginners might need more stability, while experts might prefer more control."
  },
  {
    id: 'reaction',
    text: "Imagine your portfolio drops 10% next month.",
    subtext: "How would you honestly react?",
    type: 'single',
    options: [
      { label: "Sell everything immediately", value: 'panic', icon: '🚨' },
      { label: "Wait it out comfortably", value: 'hold', icon: '🍵' },
      { label: "Buy more while it's cheap", value: 'buy', icon: '💰' }
    ],
    explanation: "This helps us measure your emotional risk tolerance. Real wealth is built by staying calm, but we need to ensure you can sleep at night."
  },
  {
    id: 'time-horizon',
    text: "When do you need to access this money?",
    type: 'single', // simplified as single choice for flow
    options: [
      { label: "Less than 3 years", value: 'short', icon: '⏱️' },
      { label: "3 - 10 years", value: 'medium', icon: '📅' },
      { label: "10+ years (Long term)", value: 'long', icon: '🚀' }
    ],
    explanation: "Investments like Gold and Stocks need time to grow. If you need money soon, we should keep it safer. If you have time, we can aim higher."
  }
];

export const GuidedDiscovery: React.FC<GuidedDiscoveryProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    
    // Small delay before auto-advancing for smooth feel
    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowExplanation(false);
      } else {
        // Calculate a simple risk score based on answers
        let score = 50;
        if (newAnswers.experience === 'beginner') score -= 10;
        if (newAnswers.experience === 'expert') score += 10;
        if (newAnswers.reaction === 'panic') score -= 30;
        if (newAnswers.reaction === 'buy') score += 20;
        if (newAnswers.time === 'short') score -= 20;
        if (newAnswers.time === 'long') score += 20;
        
        // Clamp score
        score = Math.max(10, Math.min(90, score));
        
        onComplete(score);
      }
    }, 400);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-2xl mx-auto p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full"
        >
          <div className="mb-8 text-center">
             <span className="text-inaia-gold text-sm font-bold uppercase tracking-widest mb-2 block">
               Question {currentIndex + 1} of {QUESTIONS.length}
             </span>
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
               {currentQ.text}
             </h2>
             {currentQ.subtext && (
               <p className="text-xl text-gray-400">{currentQ.subtext}</p>
             )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
             {currentQ.options?.map((option) => (
               <motion.button
                 key={option.value}
                 whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => handleAnswer(option.value)}
                 className={`
                   p-6 rounded-2xl border text-left flex items-center gap-4 transition-all
                   ${answers[currentQ.id] === option.value 
                     ? 'bg-inaia-gold/20 border-inaia-gold text-white' 
                     : 'bg-white/5 border-white/10 text-gray-300 hover:border-inaia-gold/30'}
                 `}
               >
                  <span className="text-3xl">{option.icon}</span>
                  <span className="text-lg font-medium">{option.label}</span>
                  {answers[currentQ.id] === option.value && (
                    <Check className="ml-auto text-inaia-gold" />
                  )}
               </motion.button>
             ))}
          </div>

          <div className="flex justify-center">
             <button 
               onClick={() => setShowExplanation(!showExplanation)}
               className="text-gray-500 hover:text-inaia-gold flex items-center gap-2 text-sm transition-colors"
             >
               <HelpCircle size={16} /> Why are we asking this?
             </button>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-inaia-navy-light rounded-xl border border-white/10 text-gray-300 text-sm leading-relaxed text-center max-w-lg mx-auto">
                  {currentQ.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>
      
      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-800">
         <motion.div 
           className="h-full bg-inaia-gold"
           initial={{ width: 0 }}
           animate={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
         />
      </div>
    </div>
  );
};

