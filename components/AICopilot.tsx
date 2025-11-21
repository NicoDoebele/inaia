"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, ArrowRight } from 'lucide-react';
import { LifeGoal } from './ConsultationSession';

interface AICopilotProps {
  step: 'welcome' | 'goals' | 'risk' | 'result';
  goals: LifeGoal[];
  riskScore: number;
}

export const AICopilot: React.FC<AICopilotProps> = ({ step, goals, riskScore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'ai'|'user', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Smart suggestions based on context
  useEffect(() => {
    const generateSuggestion = () => {
      setIsTyping(true);
      let text = "";

      if (step === 'goals' && goals.length === 0) {
        text = "I recommend starting with major milestones like 'Hajj' or 'Retirement'. These anchor your financial timeline.";
      } else if (step === 'goals' && goals.length > 2) {
        text = "Great job! Adding more specific goals helps us build a more accurate wealth target.";
      } else if (step === 'risk' && riskScore < 30) {
        text = "A conservative approach is excellent for preserving wealth, especially if you have short-term goals like Hajj soon.";
      } else if (step === 'risk' && riskScore > 70) {
        text = "Aggressive growth fits well with long-term horizons (15+ years). Consider allocating more to Islamic Equities.";
      } else if (step === 'result') {
        text = "Based on your profile, I've optimized your portfolio with a mix of Gold Dinar for stability and Halal ETFs for growth.";
      } else {
        text = "I'm here to analyze your choices and provide real-time Sharia-compliant financial advice.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'ai', text }]);
        setIsTyping(false);
        // Only auto-open if not explicitly closed? For now just auto-open on first tip if needed, 
        // but let's avoid annoyance. Only auto-open on 'goals' start.
        if (step === 'goals' && goals.length === 0) setIsOpen(true);
      }, 1500);
    };

    const timer = setTimeout(generateSuggestion, 1000);

    return () => clearTimeout(timer);
  }, [step, goals.length, riskScore]); 

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-inaia-gold to-yellow-600 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="text-inaia-navy font-bold" /> : <Bot className="text-inaia-navy font-bold" />}
        {!isOpen && messages.length > 0 && (
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-inaia-navy"></span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-80 md:w-96 h-[500px] glass-panel flex flex-col z-50 overflow-hidden"
          >
             <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Bot className="text-inaia-gold" size={20} />
                   <span className="font-bold text-white">INAIA Co-Pilot</span>
                </div>
                <span className="text-xs bg-inaia-gold/20 text-inaia-gold px-2 py-1 rounded uppercase">Beta</span>
             </div>

             <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-hide">
                {messages.map((msg, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`p-3 rounded-lg text-sm ${
                       msg.type === 'ai' 
                         ? 'bg-white/10 text-gray-200 rounded-tl-none' 
                         : 'bg-inaia-gold/20 text-inaia-gold rounded-tr-none ml-auto'
                     }`}
                   >
                      {msg.text}
                   </motion.div>
                ))}
                {isTyping && (
                   <div className="flex gap-1 p-2">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-gray-500 rounded-full"></motion.div>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-2 h-2 bg-gray-500 rounded-full"></motion.div>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-500 rounded-full"></motion.div>
                   </div>
                )}
             </div>

             <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="Ask about Halal investing..." 
                     className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-inaia-gold/50"
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         // Mock user input logic could go here
                       }
                     }}
                   />
                   <button className="bg-inaia-gold/20 text-inaia-gold p-2 rounded-lg hover:bg-inaia-gold/30">
                      <ArrowRight size={18} />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
