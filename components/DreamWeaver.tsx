"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Mic, StopCircle, MessageSquare, SkipForward } from 'lucide-react';
import { generateGoalsFromDream, generateFollowUpQuestion } from '../lib/ai';
import { LifeGoal } from './ConsultationSession';
import { SpotlightCard } from './ui/SpotlightCard';

interface DreamWeaverProps {
  setGoals: React.Dispatch<React.SetStateAction<LifeGoal[]>>;
  onNext: (text?: string) => void;
}

export const DreamWeaver: React.FC<DreamWeaverProps> = ({ setGoals, onNext }) => {
  const [dreamText, setDreamText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleFirstPass = async () => {
    if (!dreamText.trim()) return;
    setIsAnalyzing(true);

    try {
      // Instead of finishing immediately, let's ask a follow-up question to deepen engagement
      const question = await generateFollowUpQuestion(dreamText);
      setFollowUp(question);
      setShowFollowUp(true);
      setIsAnalyzing(false);
    } catch {
      // Fallback to just finishing if AI fails
      finishAnalysis();
    }
  };

  const finishAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const goals = await generateGoalsFromDream(dreamText);
      setGoals(goals);
      // Pass the original text to context
      onNext(dreamText);
    } catch (error) {
      console.error("AI Failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkip = () => {
    // Just proceed to the next step without generating goals
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col items-center justify-center max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400">
            What is your <span className="text-gradient-gold">Dream Life?</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Tell us about your future. We&apos;ll translate your vision into a financial plan.
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!showFollowUp ? (
          <motion.div
            key="input"
            exit={{ opacity: 0, x: -50 }}
            className="w-full relative"
          >
            <SpotlightCard className="p-1 rounded-2xl relative z-10 overflow-hidden group focus-within:border-inaia-gold/50 transition-colors bg-black/40">
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="E.g., I want to travel the world in 5 years, buy a villa in Istanbul for my retirement, and send my two kids to medical school..."
                className="w-full h-48 bg-transparent text-xl text-white p-6 focus:outline-none resize-none placeholder:text-gray-600"
                disabled={isAnalyzing}
              />

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                  title="Mock Voice Input"
                >
                  {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </SpotlightCard>

            <div className="mt-8 flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFirstPass}
                disabled={!dreamText || isAnalyzing}
                className={`
                   group relative px-10 py-4 bg-inaia-gold text-inaia-navy font-bold text-lg rounded-full overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.3)]
                   ${(!dreamText || isAnalyzing) ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                 `}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Visualize My Future
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </motion.button>

              <button
                onClick={handleSkip}
                className="text-gray-500 text-sm hover:text-white flex items-center gap-1 transition-colors"
              >
                Skip to Manual Entry <SkipForward size={14} />
              </button>
            </div>

            <div className="mt-8 flex gap-2 justify-center">
              {["I want to retire early", "Buy a home for my parents", "Go on a world tour next year"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setDreamText(suggestion)}
                  className="text-xs text-gray-500 hover:text-inaia-gold border border-gray-800 hover:border-inaia-gold/50 rounded-full px-4 py-2 transition-colors"
                >
                  &quot;{suggestion}&quot;
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="followup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-2xl bg-inaia-navy-light border border-inaia-gold/30 rounded-2xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-inaia-gold via-white to-inaia-gold animate-pulse"></div>

            <div className="w-16 h-16 bg-inaia-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-inaia-gold">
              <MessageSquare size={32} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">Let&apos;s dig a little deeper...</h3>
            <p className="text-xl text-inaia-gold mb-8 italic">&quot;{followUp}&quot;</p>

            <div className="relative">
              <textarea
                className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-inaia-gold focus:outline-none"
                placeholder="Type your answer here..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    finishAnalysis();
                  }
                }}
              />
              <div className="text-xs text-gray-500 mt-2 text-right">Press Enter to continue</div>
            </div>

            <button
              onClick={finishAnalysis}
              className="mt-6 w-full py-3 bg-inaia-gold text-inaia-navy font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
            >
              Update Vision <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
