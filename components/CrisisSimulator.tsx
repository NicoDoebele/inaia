"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface CrisisSimulatorProps {
    scenario: {
        headline: string;
        newsBody: string;
        impactData?: {
            amountLost: string;
            timeLost: string;
        };
        reactions: {
            id: string;
            label: string;
            description: string;
            icon: string;
        }[];
    };
    onComplete: (reactionId: string) => void;
}

export const CrisisSimulator: React.FC<CrisisSimulatorProps> = ({ scenario, onComplete }) => {
    const [step, setStep] = useState<'news' | 'reaction'>('news');

    return (
        <div className="w-full h-full flex flex-col items-center justify-center max-w-3xl mx-auto p-4">
            <AnimatePresence mode="wait">

                {/* STEP 1: BREAKING NEWS */}
                {step === 'news' && (
                    <motion.div
                        key="news"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full text-center"
                    >
                        <div className="bg-red-600 text-white px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold text-sm mb-6 animate-pulse">
                            <AlertTriangle size={16} /> BREAKING NEWS
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                            {scenario.headline}
                        </h2>

                        <div className="bg-inaia-navy-light border border-red-500/30 p-6 rounded-xl max-w-2xl mx-auto mb-8 text-left">
                            {scenario.impactData && (
                                <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-white/10">
                                    <div className="flex-1">
                                        <div className="text-sm text-red-400 uppercase tracking-wider font-bold mb-1">Estimated Loss</div>
                                        <div className="text-4xl font-black text-red-500">{scenario.impactData.amountLost}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-red-400 uppercase tracking-wider font-bold mb-1">Impact</div>
                                        <div className="text-4xl font-black text-red-500">{scenario.impactData.timeLost}</div>
                                    </div>
                                </div>
                            )}
                            <p className="text-xl text-gray-200 leading-relaxed">
                                {scenario.newsBody}
                            </p>
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            onClick={() => setStep('reaction')}
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-colors"
                        >
                            What do you do?
                        </motion.button>
                    </motion.div>
                )}

                {/* STEP 2: REACTION */}
                {step === 'reaction' && (
                    <motion.div
                        key="reaction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">The market is in freefall.</h2>
                            <p className="text-gray-400">Your portfolio is down significantly. How do you react?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {scenario.reactions.map((reaction) => (
                                <button
                                    key={reaction.id}
                                    onClick={() => onComplete(reaction.id)}
                                    className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-inaia-gold/50 hover:bg-white/10 text-left transition-all group"
                                >
                                    <div className="text-2xl mb-2">{reaction.icon}</div>
                                    <h3 className="font-bold text-white mb-1 group-hover:text-inaia-gold">{reaction.label}</h3>
                                    <p className="text-sm text-gray-400">&quot;{reaction.description}&quot;</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};
