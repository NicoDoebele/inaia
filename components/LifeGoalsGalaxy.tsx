"use client";

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Plus, Trash2, ArrowRight, GraduationCap, Home, Plane, Coins, Briefcase } from 'lucide-react';
import clsx from 'clsx';

export type GoalType = 'Travel' | 'Education' | 'House' | 'Retirement' | 'Business';

export interface LifeGoal {
  id: string;
  type: GoalType;
  cost: number;
  year: number;
}

interface LifeGoalsGalaxyProps {
  goals: LifeGoal[];
  setGoals: React.Dispatch<React.SetStateAction<LifeGoal[]>>;
  onNext: () => void;
}

const GOAL_TYPES: { type: GoalType; icon: React.ElementType; label: string; defaultCost: number }[] = [
  { type: 'Travel', icon: Plane, label: 'World Travel', defaultCost: 15000 },
  { type: 'Education', icon: GraduationCap, label: "Child's Education", defaultCost: 50000 },
  { type: 'House', icon: Home, label: 'Dream Home', defaultCost: 400000 },
  { type: 'Retirement', icon: Coins, label: 'Retirement', defaultCost: 600000 },
  { type: 'Business', icon: Briefcase, label: 'Ethical Business', defaultCost: 100000 },
];

const START_YEAR = new Date().getFullYear();
const TIMELINE_YEARS = 30;

// -- Helpers --
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateRandomYear = () => START_YEAR + 5 + Math.floor(Math.random() * 10);
const generateRandomY = () => (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 80 + 40);

const GoalStar = ({ 
  goal, 
  removeGoal, 
  updateGoalYear, 
  containerRef 
}: { 
  goal: LifeGoal; 
  removeGoal: (id: string) => void; 
  updateGoalYear: (id: string, newYear: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const GoalIcon = GOAL_TYPES.find(t => t.type === goal.type)?.icon || Plus;
  
  // -- Motion Values (Bypasses React Render Cycle for Position) --
  const x = useMotionValue(0);
  
  // -- Local State --
  const [isDragging, setIsDragging] = useState(false);
  const [localYear, setLocalYear] = useState(goal.year); 
  const [randomY] = useState(generateRandomY);

  // -- Math Helper: Convert Year to Pixel Position --
  // We use this to snap the star to the correct spot on load/resize
  const calculateXFromYear = useCallback((targetYear: number, containerWidth: number) => {
    const rawPercent = (targetYear - START_YEAR) / TIMELINE_YEARS;
    // Map 0-1 to 5%-95% of width
    return (containerWidth * 0.05) + (rawPercent * (containerWidth * 0.90));
  }, []);

  // -- Math Helper: Convert Pixel Position to Year --
  const calculateYearFromX = useCallback((currentX: number) => {
    if (!containerRef.current) return START_YEAR;
    const width = containerRef.current.getBoundingClientRect().width;
    
    const startX = width * 0.05;
    const activeWidth = width * 0.90;

    // Clamp X to active area
    const relativeX = Math.max(0, Math.min(activeWidth, currentX - startX));
    const ratio = relativeX / activeWidth;
    
    return Math.round(START_YEAR + (ratio * TIMELINE_YEARS));
  }, [containerRef]);

  // -- Sync Position on Load & Resize --
  // This ensures the star is in the right place before we even touch it
  useLayoutEffect(() => {
    if (!containerRef.current || isDragging) return;
    
    const width = containerRef.current.getBoundingClientRect().width;
    const targetX = calculateXFromYear(goal.year, width);
    
    // Update the MotionValue directly (no re-render)
    x.set(targetX);
  }, [goal.year, containerRef, calculateXFromYear, x, isDragging]);

  // Handle Window Resize to keep stars in correct relative position
  useEffect(() => {
    const handleResize = () => {
        if (!containerRef.current || isDragging) return;
        const width = containerRef.current.getBoundingClientRect().width;
        x.set(calculateXFromYear(goal.year, width));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef, goal.year, isDragging, x, calculateXFromYear]);


  // -- Event Listeners for Dragging --
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
        if (!containerRef.current) return;
        
        // 1. Calculate new X position
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        
        // 2. Direct Update to MotionValue (Instant, no React Lag)
        x.set(relativeX);

        // 3. Update Text Label (Only re-render if year integer changes)
        const newYear = calculateYearFromX(relativeX);
        setLocalYear(prev => {
            if (prev !== newYear) return newYear;
            return prev;
        });
    };

    const handlePointerUp = (e: PointerEvent) => {
        setIsDragging(false);
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const finalYear = calculateYearFromX(relativeX);
        
        // Commit the change
        if (finalYear !== goal.year) {
          updateGoalYear(goal.id, finalYear);
        } else {
            // If year didn't change but pixels did, snap back visually
            const targetX = calculateXFromYear(goal.year, rect.width);
            x.set(targetX); 
        }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, calculateYearFromX, calculateXFromYear, containerRef, goal.id, goal.year, updateGoalYear, x]);


  return (
    <motion.div
      layoutId={goal.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute z-10 select-none touch-none"
      // HERE IS THE MAGIC: 'x' is a MotionValue. Changing it updates the GPU transform directly.
      style={{ 
        x, 
        top: `calc(50% + ${randomY}px)`,
        transform: 'translate(-50%, -50%)' // Center the star on the coordinate
      }}
    >
        <div className="relative group -translate-x-1/2 -translate-y-1/2">
          
          {/* Hit Area */}
          <div 
            onPointerDown={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 setIsDragging(true);
            }}
            className="absolute inset-[-20px] z-20 cursor-grab active:cursor-grabbing rounded-full"
          />

          {/* Line */}
          <div 
             className={clsx(
              "absolute left-1/2 w-px -translate-x-1/2 -z-10 pointer-events-none transition-all duration-300",
              randomY > 0 ? "bottom-full origin-bottom" : "top-full origin-top",
              isDragging ? "bg-white opacity-50" : "bg-linear-to-b from-inaia-gold/50 to-transparent"
             )}
             style={{ height: Math.abs(randomY) }}
          />

          {/* Icon Circle */}
          <div className={clsx(
            "w-16 h-16 rounded-full bg-inaia-navy border-2 flex items-center justify-center relative z-10 transition-all duration-200 pointer-events-none",
            isDragging 
              ? "border-white scale-125 shadow-[0_0_50px_rgba(255,255,255,0.5)]" 
              : "border-inaia-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] group-hover:scale-110"
          )}>
            <GoalIcon className={isDragging ? "text-white" : "text-inaia-gold"} size={isDragging ? 28 : 24} />
          </div>

          {/* Delete Button */}
          {!isDragging && (
             <button 
               onClick={(e) => { e.stopPropagation(); removeGoal(goal.id); }}
               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-red-600 cursor-pointer pointer-events-auto"
             >
               <Trash2 size={12} />
             </button>
          )}

          {/* Label */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center w-40 pointer-events-none select-none">
            <div className="text-sm font-bold text-white shadow-black drop-shadow-md">{goal.type}</div>
            <div className="text-xs text-inaia-gold font-mono">€{goal.cost.toLocaleString()}</div>
            <div className={clsx(
              "text-xs transition-all duration-200 font-bold mt-1",
              isDragging ? "text-white text-base" : "text-gray-400"
            )}>
              {isDragging ? localYear : goal.year}
            </div>
          </div>
        </div>
    </motion.div>
  );
};

export const LifeGoalsGalaxy: React.FC<LifeGoalsGalaxyProps> = ({ goals, setGoals, onNext }) => {
  const universeRef = useRef<HTMLDivElement>(null);

  const addGoal = (type: GoalType) => {
    const template = GOAL_TYPES.find(g => g.type === type);
    const newGoal: LifeGoal = {
      id: generateId(),
      type,
      cost: template?.defaultCost || 0,
      year: generateRandomYear()
    };
    setGoals([...goals, newGoal]);
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateGoalYear = (id: string, newYear: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, year: newYear } : g));
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
          <p className="text-sm text-gray-400 mb-6">Drag to timeline to add goals. Drag stars to adjust year.</p>
          
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
            Next Step <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* The Universe (Visualization Area) */}
      <div className="flex-1 glass-panel relative overflow-hidden flex flex-col select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-inaia-blue-accent/20 via-inaia-navy to-inaia-navy z-0"></div>
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
            <div className="w-full h-full relative" ref={universeRef}>
               {/* Timeline Line */}
               <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-inaia-gold/50 to-transparent"></div>
               
               {/* Year Markers */}
               <div className="absolute top-1/2 left-0 w-full h-0 pointer-events-none">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const year = START_YEAR + (i * 5);
                    const percent = 5 + ((i * 5) / TIMELINE_YEARS) * 90;
                    return (
                      <div key={year} className="absolute transform -translate-x-1/2 top-4 flex flex-col items-center" style={{ left: `${percent}%` }}>
                          <div className="w-px h-2 bg-white/20 mb-1"></div>
                          <div className="text-[10px] text-gray-500">{year}</div>
                      </div>
                    );
                  })}
               </div>

               <AnimatePresence>
                 {goals.map((goal) => (
                    <GoalStar 
                      key={goal.id} 
                      goal={goal} 
                      removeGoal={removeGoal} 
                      updateGoalYear={updateGoalYear}
                      containerRef={universeRef}
                    />
                 ))}
               </AnimatePresence>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-inaia-navy/50 backdrop-blur-sm border-t border-white/5 flex justify-between text-xs text-gray-500 uppercase tracking-wider z-20 relative">
           <span>{START_YEAR}</span>
           <span>Timeline Horizon ({START_YEAR + TIMELINE_YEARS})</span>
        </div>
      </div>
    </motion.div>
  );
};