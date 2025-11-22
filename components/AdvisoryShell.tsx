"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAdvisoryStep, AdvisoryStep } from '../lib/actions';
import { TimeTravelerPostcard } from './TimeTravelerPostcard';
import { CrisisSimulator } from './CrisisSimulator';
import { PortfolioEngine } from './PortfolioEngine';
import { LifeGoalsGalaxy, LifeGoal } from './LifeGoalsGalaxy';

export const AdvisoryShell = () => {
    const [history, setHistory] = useState<{ type: string; answer: string | number | object }[]>([]);
    const [currentStep, setCurrentStep] = useState<AdvisoryStep | null>(null);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState("");

    const hasFetched = useRef(false);

    const [monthlySavings, setMonthlySavings] = useState(500); // Default value
    const [targetWealth, setTargetWealth] = useState(1000000); // Default value
    const [lifeGoals, setLifeGoals] = useState<LifeGoal[]>([]);


    const fetchNextStep = useCallback(async (currentHistory: typeof history) => {
        setLoading(true);

        // --- HARDCODED PHASE ---

        // Step 1: Life Goals Galaxy (Always first)
        if (currentHistory.length === 0) {
            setCurrentStep({
                type: 'galaxy',
                progress: 10,
                content: {
                    title: "Design Your Life Galaxy",
                    description: "Add stars for your major life goals."
                }
            });
            setLoading(false);
            return;
        }

        // Step 2: Monthly Investment (After Galaxy)
        if (currentHistory.length === 1) {
            setCurrentStep({
                type: 'question',
                progress: 10,
                content: {
                    question: "How much could you comfortably invest monthly?",
                    subtext: "We'll use this to project your future wealth.",
                    inputType: 'slider',
                    sliderConfig: {
                        min: 100,
                        max: 5000,
                        step: 50,
                        unit: "€",
                        label: "Monthly Amount"
                    }
                }
            });
            setLoading(false);
            return;
        }

        // AI Phase starts after step 2 now
        // If we have 2 or more answers, hand off to AI.

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

        // If the answer is a number (from slider), update monthly savings or target wealth
        if (typeof answer === 'number' && currentStep?.type === 'question' && currentStep.content.inputType === 'slider') {
            if (currentStep.content.sliderConfig?.label === "Monthly Amount") {
                setMonthlySavings(answer);
            }
            if (currentStep.content.sliderConfig?.label === "Target Wealth") {
                setTargetWealth(answer);
            }
        }

        setInputText(""); // Reset input for next step
        fetchNextStep(newHistory);
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleAnswer(inputText);
        setInputText("");
    };

    const handleGalaxyNext = () => {
        const total = lifeGoals.reduce((acc, g) => acc + g.cost, 0);
        setTargetWealth(total > 0 ? total : 1000000); // Default if empty
        
        // Pass detailed goal info to the history so the AI can see it
        handleAnswer({
            event: "life_goals_defined",
            totalCost: total,
            goals: lifeGoals.map(g => ({ type: g.type, year: g.year, cost: g.cost }))
        });
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
            {/* Designed Progress Bar - Hidden on Result and Galaxy */}
            {currentStep.type !== 'result' && currentStep.type !== 'galaxy' && (
                <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none">
                    <div className="max-w-3xl mx-auto flex items-center gap-2">
                        {Array.from({ length: 10 }).map((_, i) => {
                            // Static progress: 1 bar (10%) per completed step in history
                            // Galaxy (step 1) is in history when we see the next step.
                            // So history.length = 1 -> 10% (1 bar).
                            const currentProgress = Math.max(10, history.length * 10);
                            const isActive = i < (currentProgress / 100) * 10;
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
                            ) : currentStep.content.inputType === 'slider' && currentStep.content.sliderConfig ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-inaia-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10">
                                            <div className="text-center mb-10">
                                                <div className="text-sm text-inaia-gold font-bold uppercase tracking-widest mb-2">{currentStep.content.sliderConfig.label || "Amount"}</div>
                                                <div className="text-6xl font-bold text-white flex items-center justify-center gap-1">
                                                    <span className="text-3xl text-gray-500 self-start mt-2">{currentStep.content.sliderConfig.unit}</span>
                                                    {Number(inputText || currentStep.content.sliderConfig.min).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="relative h-12 flex items-center mb-8">
                                                <input
                                                    type="range"
                                                    min={currentStep.content.sliderConfig.min}
                                                    max={currentStep.content.sliderConfig.max}
                                                    step={currentStep.content.sliderConfig.step}
                                                    value={inputText || currentStep.content.sliderConfig.min}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-inaia-gold z-20 relative"
                                                />
                                                {/* Custom Track Styling could go here if needed, but accent-color works well for now */}
                                            </div>

                                            <div className="flex justify-between text-xs text-gray-500 font-mono uppercase tracking-wider mb-8">
                                                <span>{currentStep.content.sliderConfig.unit}{currentStep.content.sliderConfig.min.toLocaleString()}</span>
                                                <span>{currentStep.content.sliderConfig.unit}{currentStep.content.sliderConfig.max.toLocaleString()}</span>
                                            </div>

                                            <button
                                                onClick={() => handleAnswer(Number(inputText || currentStep.content.sliderConfig?.min))}
                                                className="w-full py-4 bg-inaia-gold text-inaia-navy font-bold text-lg rounded-xl hover:bg-yellow-400 hover:scale-[1.02] transition-all shadow-lg shadow-inaia-gold/20"
                                            >
                                                Confirm Amount
                                            </button>
                                        </div>
                                    </div>
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

                    {/* TYPE: GALAXY */}
                    {currentStep.type === 'galaxy' && (
                        <motion.div key="galaxy" className="w-full h-full">
                            <LifeGoalsGalaxy 
                                goals={lifeGoals}
                                setGoals={setLifeGoals}
                                onNext={handleGalaxyNext}
                            />
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
                                monthlySavings={monthlySavings}
                                setMonthlySavings={setMonthlySavings}
                                targetWealth={targetWealth}
                                onBack={() => { }} // No-op
                                dreamText="" // Legacy prop
                                aiRecommendation={currentStep.content} // NEW PROP
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Loading Overlay */}
            {
                loading && currentStep && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <Sparkles className="w-12 h-12 animate-spin text-inaia-gold mb-4" />
                            <p className="text-white font-medium">Thinking...</p>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
