"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, GraduationCap, Home, Plane, Coins, Briefcase } from 'lucide-react';
import { GoalType, LifeGoal } from './ConsultationSession';
import clsx from 'clsx';

interface LifeGoalsGalaxyProps {
  goals: LifeGoal[];
  setGoals: React.Dispatch<React.SetStateAction<LifeGoal[]>>;
  onNext: () => void;
}

const GOAL_TYPES: { type: GoalType; icon: React.ElementType; label: string; defaultCost: number }[] = [
  { type: 'Hajj', icon: Plane, label: 'Hajj / Umrah', defaultCost: 15000 },
  { type: 'Education', icon: GraduationCap, label: "Child's Education", defaultCost: 50000 },
  { type: 'House', icon: Home, label: 'Dream Home', defaultCost: 400000 },
  { type: 'Retirement', icon: Coins, label: 'Retirement', defaultCost: 600000 },
  { type: 'Business', icon: Briefcase, label: 'Halal Business', defaultCost: 100000 },
];

export const LifeGoalsGalaxy: React.FC<LifeGoalsGalaxyProps> = ({ goals, setGoals, onNext }) => {
  
  const addGoal = (type: GoalType) => {
    const template = GOAL_TYPES.find(g => g.type === type);
    const newGoal: LifeGoal = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      cost: template?.defaultCost || 0,
      year: new Date().getFullYear() + 5 + Math.floor(Math.random() * 10) // Random future date
    };
    setGoals([...goals, newGoal]);
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const totalNeed = goals.reduce((acc, g) => acc + g.cost, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full flex flex-col lg:flex-row gap-8"
    >
      {/* Sidebar Controls */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6">
        <div className="glass-panel p-6 flex-1">
          <h3 className="text-xl font-bold text-inaia-gold mb-4">Life Goal Stars</h3>
          <p className="text-sm text-gray-400 mb-6">Drag or click to add goals to your universe.</p>
          
          <div className="grid grid-cols-1 gap-3">
            {GOAL_TYPES.map((goal) => (
              <motion.button
                key={goal.type}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addGoal(goal.type)}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-inaia-gold/30 transition-colors bg-white/5 text-left group"
              >
                <div className="p-2 bg-inaia-navy rounded-lg text-inaia-gold group-hover:text-white transition-colors">
                  <goal.icon size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">{goal.label}</div>
                  <div className="text-xs text-gray-500">Est. €{goal.defaultCost.toLocaleString()}</div>
                </div>
                <Plus className="ml-auto opacity-0 group-hover:opacity-100 text-inaia-gold transition-opacity" size={16} />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Target Wealth</h4>
          <motion.div 
            key={totalNeed}
            initial={{ scale: 1.2, color: '#D4AF37' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-4xl font-bold"
          >
            €{totalNeed.toLocaleString()}
          </motion.div>
          <button 
            onClick={onNext}
            className="mt-6 w-full py-3 bg-inaia-gold text-inaia-navy font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
          >
            Next: Risk Profile <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* The Universe (Visualization Area) */}
      <div className="flex-1 glass-panel relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-inaia-blue-accent/20 via-inaia-navy to-inaia-navy z-0"></div>
        
        {/* Stars/Grid Animation Background */}
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        <div className="relative z-10 flex-1 p-8 flex items-center justify-center">
          {goals.length === 0 ? (
            <div className="text-center text-gray-500">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-dashed border-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Plus className="text-gray-700" />
              </motion.div>
              <p>Your universe is empty. Add a goal to begin.</p>
            </div>
          ) : (
            <div className="w-full h-full relative">
               {/* Timeline Line */}
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-inaia-gold/50 to-transparent"></div>
               
               <AnimatePresence>
                 {goals.map((goal, index) => {
                   const GoalIcon = GOAL_TYPES.find(t => t.type === goal.type)?.icon || Plus;
                   // Random positioning for "Galaxy" feel but somewhat ordered
                   const randomY = (index % 2 === 0 ? -1 : 1) * (Math.random() * 100 + 50);
                   const leftPos = `${((index + 1) / (goals.length + 1)) * 100}%`;

                   return (
                     <motion.div
                       key={goal.id}
                       layoutId={goal.id}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1, left: leftPos, top: `calc(50% + ${randomY}px)` }}
                       exit={{ scale: 0, opacity: 0 }}
                       drag
                       dragConstraints={{ left: 0, right: 0, top: -200, bottom: 200 }} // Allow some vertical play
                       className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group"
                       style={{ left: leftPos, top: '50%' }} // Initial layout position, overridden by animate
                     >
                        <div className="relative">
                          {/* Connecting Line to timeline */}
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: Math.abs(randomY) }}
                            className={clsx(
                              "absolute left-1/2 w-[1px] bg-gradient-to-b from-inaia-gold/50 to-transparent -translate-x-1/2 -z-10",
                              randomY > 0 ? "bottom-full origin-bottom" : "top-full origin-top"
                            )}
                          />

                          {/* The Star/Planet */}
                          <div className="w-16 h-16 rounded-full bg-inaia-navy border-2 border-inaia-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                            <GoalIcon className="text-inaia-gold w-8 h-8" />
                          </div>

                          {/* Delete Button */}
                          <button 
                            onClick={() => removeGoal(goal.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600"
                          >
                            <Trash2 size={12} />
                          </button>

                          {/* Label */}
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center w-32 pointer-events-none">
                            <div className="text-sm font-bold text-white shadow-black drop-shadow-md">{goal.type}</div>
                            <div className="text-xs text-inaia-gold font-mono">€{goal.cost.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400">{goal.year}</div>
                          </div>
                        </div>
                     </motion.div>
                   );
                 })}
               </AnimatePresence>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-inaia-navy/50 backdrop-blur-sm border-t border-white/5 flex justify-between text-xs text-gray-500 uppercase tracking-wider">
           <span>Present Day</span>
           <span>Future Horizon (20+ Years)</span>
        </div>
      </div>
    </motion.div>
  );
};

