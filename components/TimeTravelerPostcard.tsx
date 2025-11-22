"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface TimeTravelerPostcardProps {
    scenario: {
        title: string;
        description: string;
        scenarioA: {
            id: 'safe';
            title: string;
            description: string;
            imagePrompt: string;
        };
        scenarioB: {
            id: 'risky';
            title: string;
            description: string;
            imagePrompt: string;
        };
    };
    onComplete: (riskPreference: 'safe' | 'risky') => void;
}

export const TimeTravelerPostcard: React.FC<TimeTravelerPostcardProps> = ({ scenario, onComplete }) => {
    const [selected, setSelected] = useState<'safe' | 'risky' | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    React.useEffect(() => {
        // Simulate AI Generation time
        const timer = setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSelect = (choice: 'safe' | 'risky') => {
        setSelected(choice);
        setTimeout(() => {
            onComplete(choice);
        }, 800);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl mx-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {scenario.title}
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    {scenario.description}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Safe Option */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isGenerating && handleSelect('safe')}
                    className={`
            relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300
            ${selected === 'safe' ? 'border-inaia-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'border-transparent hover:border-white/20'}
            ${isGenerating ? 'pointer-events-none' : ''}
          `}
                >
                    <div className="aspect-video relative bg-gray-900 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    key="generating"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20"
                                >
                                    <div className="w-12 h-12 border-4 border-inaia-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-inaia-gold font-mono text-xs animate-pulse">GENERATING SCENARIO A...</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="image"
                                    initial={{ opacity: 0, filter: 'brightness(2) blur(10px)' }}
                                    animate={{ opacity: 1, filter: 'brightness(1) blur(0px)' }}
                                    transition={{ duration: 0.8 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src="/assets/safe-cottage.png"
                                        alt={scenario.scenarioA.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {selected === 'safe' && (
                            <div className="absolute inset-0 bg-inaia-gold/20 flex items-center justify-center z-30">
                                <div className="bg-inaia-gold text-inaia-navy p-4 rounded-full">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                        <h3 className="text-2xl font-bold text-white mb-2">{scenario.scenarioA.title}</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p className="text-xs text-gray-500 mt-2 italic">
                                &quot;{scenario.scenarioA.description}&quot;
                            </p>
                            {/* Show Prompt to simulate generation */}
                            <div className="text-[10px] text-gray-600 font-mono mt-2 truncate opacity-50">
                                PROMPT: {scenario.scenarioA.imagePrompt}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Risky Option */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isGenerating && handleSelect('risky')}
                    className={`
            relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300
            ${selected === 'risky' ? 'border-inaia-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'border-transparent hover:border-white/20'}
            ${isGenerating ? 'pointer-events-none' : ''}
          `}
                >
                    <div className="aspect-video relative bg-gray-900 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    key="generating"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20"
                                >
                                    <div className="w-12 h-12 border-4 border-inaia-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-inaia-gold font-mono text-xs animate-pulse">GENERATING SCENARIO B...</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="image"
                                    initial={{ opacity: 0, filter: 'brightness(2) blur(10px)' }}
                                    animate={{ opacity: 1, filter: 'brightness(1) blur(0px)' }}
                                    transition={{ duration: 0.8, delay: 0.2 }} // Slight stagger
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src="/assets/risky-villa.png"
                                        alt={scenario.scenarioB.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {selected === 'risky' && (
                            <div className="absolute inset-0 bg-inaia-gold/20 flex items-center justify-center z-30">
                                <div className="bg-inaia-gold text-inaia-navy p-4 rounded-full">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                        <h3 className="text-2xl font-bold text-white mb-2">{scenario.scenarioB.title}</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p className="text-xs text-gray-500 mt-2 italic">
                                &quot;{scenario.scenarioB.description}&quot;
                            </p>
                            {/* Show Prompt to simulate generation */}
                            <div className="text-[10px] text-gray-600 font-mono mt-2 truncate opacity-50">
                                PROMPT: {scenario.scenarioB.imagePrompt}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
