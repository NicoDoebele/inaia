"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LifeGoalsGalaxy } from './LifeGoalsGalaxy';
import { PortfolioEngine } from './PortfolioEngine';
import { DreamWeaver } from './DreamWeaver';
import { ScenarioSimulator } from './ScenarioSimulator';
import { GuidedDiscovery } from './GuidedDiscovery';

export type GoalType = 'Hajj' | 'Education' | 'House' | 'Retirement' | 'Business';

export interface LifeGoal {
  id: string;
  type: GoalType;
  cost: number;
  year: number;
}

export const ConsultationSession = () => {
  const [step, setStep] = useState<'welcome' | 'dream' | 'refine' | 'discovery' | 'scenarios' | 'result'>('welcome');
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [riskScore, setRiskScore] = useState(50); // 0 (Conservative) to 100 (Aggressive)
  const [monthlySavings, setMonthlySavings] = useState(1000);

  // Calculate Total Target Wealth based on goals
  const targetWealth = goals.reduce((acc, goal) => acc + goal.cost, 0);

  const getStepNumber = () => {
    switch(step) {
      case 'dream': return 1;
      case 'refine': return 2;
      case 'discovery': return 3; // Replaces 'Risk'
      case 'scenarios': return 4;
      case 'result': return 5;
      default: return 0;
    }
  };

  const handleDiscoveryComplete = (score: number) => {
    setRiskScore(score);
    setStep('scenarios');
  };

  return (
    <div className="min-h-screen bg-inaia-navy text-inaia-white overflow-hidden relative font-sans selection:bg-inaia-gold selection:text-inaia-navy">
      
      {/* Background Ambient Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <motion.div 
           animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-inaia-blue-accent/10 rounded-full blur-[100px]" 
         />
         <motion.div 
           animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
           transition={{ duration: 15, repeat: Infinity, delay: 2 }}
           className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-inaia-gold/5 rounded-full blur-[120px]" 
         />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        
        {/* Header */}
        <header className="p-6 flex justify-between items-center glass-panel m-4 mb-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-inaia-gold to-yellow-600 rounded-full flex items-center justify-center font-bold text-inaia-navy">I</div>
            <h1 className="text-xl font-bold tracking-wider text-gradient-gold">INAIA</h1>
          </div>
          
          {/* Progress Steps */}
          {step !== 'welcome' && (
            <div className="hidden md:flex items-center gap-2">
               {['Dream', 'Refine', 'Discovery', 'Stress Test', 'Portfolio'].map((label, i) => {
                 const stepNum = i + 1;
                 const currentStepNum = getStepNumber();
                 const isActive = stepNum === currentStepNum;
                 const isCompleted = stepNum < currentStepNum;
                 
                 return (
                   <React.Fragment key={label}>
                     <div className="flex items-center gap-2">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                          ${isActive ? 'bg-inaia-gold text-inaia-navy' : isCompleted ? 'bg-inaia-gold/50 text-inaia-navy' : 'bg-gray-800 text-gray-500'}
                        `}>
                          {stepNum}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>{label}</span>
                     </div>
                     {i < 4 && <div className="w-8 h-[1px] bg-gray-800"></div>}
                   </React.Fragment>
                 );
               })}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 flex relative">
          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full h-full flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                   <Sparkles className="w-16 h-16 text-inaia-gold mx-auto mb-6" />
                   <h2 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                     The Future of <br/> 
                     <span className="text-gradient-gold">Ethical Wealth</span>
                   </h2>
                   <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                     Welcome to your personalized financial journey. Let&apos;s build a portfolio that aligns with your values and life goals.
                   </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('dream')}
                  className="group relative px-8 py-4 bg-inaia-gold text-inaia-navy font-bold text-lg rounded-full overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Consultation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </motion.button>
              </motion.div>
            )}

            {step === 'dream' && (
              <DreamWeaver 
                key="dream"
                setGoals={setGoals}
                onNext={() => setStep('refine')}
              />
            )}

            {step === 'refine' && (
              <LifeGoalsGalaxy 
                key="refine" 
                goals={goals} 
                setGoals={setGoals} 
                onNext={() => setStep('discovery')} 
              />
            )}

            {step === 'discovery' && (
              <GuidedDiscovery 
                key="discovery"
                onComplete={handleDiscoveryComplete}
              />
            )}

            {step === 'scenarios' && (
              <ScenarioSimulator
                key="scenarios"
                riskScore={riskScore}
                onNext={() => setStep('result')}
                onBack={() => setStep('discovery')}
              />
            )}

            {step === 'result' && (
              <PortfolioEngine 
                key="result" 
                goals={goals} 
                riskScore={riskScore}
                monthlySavings={monthlySavings}
                setMonthlySavings={setMonthlySavings}
                targetWealth={targetWealth}
                onBack={() => setStep('scenarios')}
              />
            )}
          </AnimatePresence>
          
        </main>

      </div>
    </div>
  );
};
