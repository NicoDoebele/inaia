"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAdvisoryStep, AdvisoryStep } from '../lib/actions';
import { TimeTravelerPostcard } from './TimeTravelerPostcard';
import { CrisisSimulator } from './CrisisSimulator';
import { PortfolioEngine } from './PortfolioEngine';

export const AdvisoryShell = () => {
    const [history, setHistory] = useState<{ type: string; answer: string | number | object }[]>([]);
    const [currentStep, setCurrentStep] = useState<AdvisoryStep | null>(null);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState("");

    const hasFetched = useRef(false);

    const fetchNextStep = useCallback(async (currentHistory: typeof history) => {
        setLoading(true);
        try {
            const step = await getAdvisoryStep(currentHistory);
            setCurrentStep(step);
        } catch (error) {
            console.error("Failed to fetch step", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchNextStep([]);
            hasFetched.current = true;
        }
    }, [fetchNextStep]);

    const handleAnswer = (answer: string | number | object) => {
        const newHistory = [...history, { type: currentStep?.type || 'unknown', answer }];
        setHistory(newHistory);
        fetchNextStep(newHistory);
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleAnswer(inputText);
        setInputText("");
    };

    if (loading && !currentStep) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <Sparkles className="w-12 h-12 animate-spin text-inaia-gold mb-4" />
                <p className="text-xl font-light animate-pulse">Consulting AI Advisor...</p>
            </div>
        );
    }

    if (!currentStep) return null;

    return (
        <div className="w-full h-full flex flex-col relative">
            {/* Designed Progress Bar - Hidden on Result */}
            {currentStep.type !== 'result' && (
                <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none">
                    <div className="max-w-3xl mx-auto flex items-center gap-2">
                        {Array.from({ length: 6 }).map((_, i) => {
                            const isActive = i < (currentStep.progress / 100) * 6;
                            return (
                                <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: isActive ? '100%' : '0%' }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="h-full bg-gradient-to-r from-inaia-gold to-yellow-300 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
                <AnimatePresence mode="wait">

                    {/* TYPE: QUESTION */}
                    {currentStep.type === 'question' && (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {currentStep.content.question}
                            </h2>
                            {currentStep.content.subtext && (
                                <p className="text-xl text-gray-400 mb-8">{currentStep.content.subtext}</p>
                            )}

                            {currentStep.content.inputType === 'choice' && currentStep.content.options ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentStep.content.options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleAnswer(opt.value)}
                                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-inaia-gold hover:bg-white/10 transition-all text-left group"
                                        >
                                            <span className="text-3xl block mb-2">{opt.icon}</span>
                                            <span className="text-lg font-bold text-white group-hover:text-inaia-gold">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <form onSubmit={handleTextSubmit} className="relative max-w-xl mx-auto">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your answer..."
                                        className="w-full bg-white/10 border border-white/20 rounded-full px-8 py-4 text-lg text-white focus:outline-none focus:border-inaia-gold transition-colors"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim()}
                                        className="absolute right-2 top-2 bg-inaia-gold text-inaia-navy p-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {/* TYPE: POSTCARD */}
                    {currentStep.type === 'postcard' && (
                        <motion.div key="postcard" className="w-full h-full">
                            <TimeTravelerPostcard
                                scenario={currentStep.content}
                                onComplete={(choice) => handleAnswer(choice)}
                            />
                        </motion.div>
                    )}

                    {/* TYPE: CRISIS */}
                    {currentStep.type === 'crisis' && (
                        <motion.div key="crisis" className="w-full h-full">
                            <CrisisSimulator
                                scenario={currentStep.content}
                                onComplete={(reactionId) => handleAnswer(reactionId)}
                            />
                        </motion.div>
                    )}

                    {/* TYPE: RESULT */}
                    {currentStep.type === 'result' && (
                        <motion.div key="result" className="w-full h-full">
                            <PortfolioEngine
                                goals={[]} // Legacy prop, can be mocked or derived
                                riskScore={50} // Legacy prop
                                monthlySavings={1000} // Legacy prop
                                setMonthlySavings={() => { }} // No-op
                                targetWealth={1000000} // Legacy prop
                                onBack={() => { }} // No-op
                                dreamText="" // Legacy prop
                                aiRecommendation={currentStep.content} // NEW PROP
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Loading Overlay */}
            {loading && currentStep && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Sparkles className="w-12 h-12 animate-spin text-inaia-gold mb-4" />
                        <p className="text-white font-medium">Thinking...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
