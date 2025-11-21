"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { generateScenarios, Scenario } from '../lib/ai';

interface ScenarioSimulatorProps {
  riskScore: number;
  onNext: () => void;
  onBack: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ riskScore, onNext, onBack }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await generateScenarios(riskScore);
      setScenarios(data);
      setLoading(false);
    };
    load();
  }, [riskScore]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full flex flex-col gap-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold text-white mb-2">Stress Test Your Portfolio</h3>
        <p className="text-gray-400">
          True resilience is tested in crisis. See how your chosen risk profile ({riskScore}/100) performs under AI-simulated market conditions.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
           <div className="w-16 h-16 border-4 border-inaia-gold border-t-transparent rounded-full animate-spin"></div>
           <p className="text-inaia-gold animate-pulse">Generating Market Scenarios...</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
              className={`
                glass-panel p-6 cursor-pointer relative overflow-hidden group transition-all duration-300
                ${activeScenario === scenario.id ? 'border-inaia-gold bg-inaia-gold/10' : 'hover:border-white/20'}
              `}
            >
              <div className={`text-4xl mb-4 ${scenario.color}`}>
                 {scenario.impact < 0 ? <TrendingDown /> : <TrendingUp />}
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{scenario.title}</h4>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{scenario.description}</p>
              
              <div className={`
                inline-block px-3 py-1 rounded text-sm font-bold
                ${scenario.impact < 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}
              `}>
                Impact: {scenario.impact > 0 ? '+' : ''}{scenario.impact * 100}%
              </div>

              {/* Simulated graph overlay when active */}
              {activeScenario === scenario.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                   <div className="text-xs text-gray-300 mb-1">Your Portfolio Resilience:</div>
                   {/* Mock calculation based on risk vs scenario */}
                   {/* If high risk and negative scenario -> Bad resilience. Low risk and negative -> Good resilience */}
                   {(riskScore > 60 && scenario.impact < 0) ? (
                      <div className="text-red-400 font-bold flex gap-2 items-center">
                        <AlertTriangle size={14} /> High Volatility Detected
                      </div>
                   ) : (
                      <div className="text-green-400 font-bold flex gap-2 items-center">
                         <AlertTriangle size={14} /> Capital Preserved
                      </div>
                   )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-auto">
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Adjust Risk
        </button>
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-inaia-gold text-inaia-navy font-bold rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2"
        >
          Finalize Portfolio <ArrowRight size={18} />
        </button>
      </div>

    </motion.div>
  );
};

