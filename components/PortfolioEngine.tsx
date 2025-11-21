"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, PieChart, TrendingUp, RefreshCw } from 'lucide-react';
import { LifeGoal } from './ConsultationSession';

interface PortfolioEngineProps {
  goals: LifeGoal[];
  riskScore: number;
  monthlySavings: number;
  setMonthlySavings: React.Dispatch<React.SetStateAction<number>>;
  targetWealth: number;
  onBack: () => void;
}

export const PortfolioEngine: React.FC<PortfolioEngineProps> = ({ 
  goals, 
  riskScore, 
  monthlySavings, 
  setMonthlySavings, 
  targetWealth,
  onBack 
}) => {
  
  // Calculate allocation based on risk
  const calculateAllocation = (risk: number) => {
    // Linear interpolation for simplicity
    const etf = 20 + (risk * 0.6); // 20% to 80%
    const gold = 50 - (risk * 0.4); // 50% to 10%
    const silver = 20 - (risk * 0.15); // 20% to 5%
    const other = 100 - etf - gold - silver; // Remainder (Sukuk/Cash)
    
    return [
      { name: 'Islamic ETFs', value: etf, color: '#3B82F6' }, // Blue
      { name: 'Gold Dinar', value: gold, color: '#D4AF37' }, // Gold
      { name: 'Silver Dirham', value: silver, color: '#94A3B8' }, // Silver
      { name: 'Sukuk/Cash', value: other, color: '#10B981' }, // Green
    ];
  };

  const allocation = calculateAllocation(riskScore);

  // Calculate projection
  const years = 30;
  const returnRate = 0.03 + (riskScore / 100) * 0.07; // 3% to 10%
  
  const projectionData = Array.from({ length: years + 1 }, (_, i) => {
    const invested = monthlySavings * 12 * i;
    const compound = (monthlySavings * 12) * ((Math.pow(1 + returnRate, i) - 1) / returnRate);
    return { year: 2025 + i, invested, value: i === 0 ? 0 : compound };
  });

  const maxVal = projectionData[years].value;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Risk
        </button>
        <h2 className="text-2xl font-bold text-gradient-gold">Your Personalized Halal Portfolio</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        
        {/* Left Col: Controls & Breakdown */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Monthly Savings Input */}
          <div className="glass-panel p-6">
             <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Monthly Contribution</h3>
             <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setMonthlySavings(Math.max(100, monthlySavings - 100))}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold"
                >-</button>
                <div className="text-4xl font-bold text-inaia-white">
                   €{monthlySavings.toLocaleString()}
                </div>
                <button 
                  onClick={() => setMonthlySavings(monthlySavings + 100)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold"
                >+</button>
             </div>
             <input 
               type="range" 
               min="100" 
               max="5000" 
               step="100" 
               value={monthlySavings} 
               onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
               className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
             />
          </div>

          {/* Allocation Donut */}
          <div className="glass-panel p-6 flex-1 flex flex-col">
             <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-6">Asset Allocation</h3>
             <div className="flex-1 flex items-center justify-center relative">
                {/* CSS Conic Gradient Donut */}
                <motion.div 
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-48 h-48 rounded-full relative"
                  style={{
                    background: `conic-gradient(
                      ${allocation[0].color} 0% ${allocation[0].value}%, 
                      ${allocation[1].color} ${allocation[0].value}% ${allocation[0].value + allocation[1].value}%, 
                      ${allocation[2].color} ${allocation[0].value + allocation[1].value}% ${allocation[0].value + allocation[1].value + allocation[2].value}%, 
                      ${allocation[3].color} ${allocation[0].value + allocation[1].value + allocation[2].value}% 100%
                    )`
                  }}
                >
                   <div className="absolute inset-4 bg-inaia-navy rounded-full flex items-center justify-center flex-col z-10">
                      <span className="text-xs text-gray-400">Exp. Return</span>
                      <span className="text-xl font-bold text-inaia-gold">{(returnRate * 100).toFixed(1)}%</span>
                   </div>
                </motion.div>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-6">
                {allocation.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <div className="text-xs text-gray-400">{item.name}</div>
                      <div className="font-bold text-sm">{item.value.toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Col: Projection Graph */}
        <div className="flex-1 glass-panel p-8 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-8 z-10">
             <div>
               <h3 className="text-xl font-bold text-white">Wealth Projection</h3>
               <p className="text-sm text-gray-400">Based on your monthly savings and risk profile</p>
             </div>
             <div className="text-right">
               <div className="text-sm text-gray-400">Projected Wealth (30 Years)</div>
               <motion.div 
                 key={maxVal}
                 initial={{ scale: 1.2, color: '#D4AF37' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-3xl font-bold text-white"
               >
                 €{Math.round(maxVal).toLocaleString()}
               </motion.div>
               {maxVal >= targetWealth ? (
                 <div className="text-green-400 text-xs font-bold flex items-center justify-end gap-1">
                   <TrendingUp size={12} /> Goal Achieved
                 </div>
               ) : (
                 <div className="text-red-400 text-xs font-bold flex items-center justify-end gap-1">
                   Gap: €{Math.round(targetWealth - maxVal).toLocaleString()}
                 </div>
               )}
             </div>
          </div>

          {/* Bars Graph */}
          <div className="flex-1 flex items-end gap-1 relative z-10">
            {projectionData.map((data, i) => {
               if (i % 2 !== 0) return null; // Show every 2nd bar for spacing
               const heightPercent = (data.value / maxVal) * 80;
               const investedPercent = (data.invested / maxVal) * 80;
               
               return (
                 <div key={data.year} className="flex-1 flex flex-col justify-end group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
                      Year {data.year}: €{Math.round(data.value).toLocaleString()}
                    </div>
                    
                    {/* Growth Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ delay: i * 0.02, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-inaia-gold/20 to-inaia-gold rounded-t-sm"
                    />
                    {/* Invested Bar (Overlay/Base) */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${investedPercent}%` }}
                      transition={{ delay: i * 0.02, duration: 0.5 }}
                      className="w-full bg-inaia-blue-accent/50 absolute bottom-0"
                    />
                 </div>
               );
            })}
          </div>

          {/* Goals overlay lines */}
          {goals.map((goal) => {
             // Calculate approximate position on X axis (assuming 2025 start)
             const yearIndex = goal.year - 2025;
             if (yearIndex < 0 || yearIndex > years) return null;
             const leftPos = `${(yearIndex / years) * 100}%`;

             return (
               <div key={goal.id} className="absolute bottom-0 top-20 border-l border-dashed border-white/20 pointer-events-none" style={{ left: leftPos }}>
                  <div className="absolute top-0 -translate-x-1/2 bg-inaia-navy/80 p-1 rounded border border-white/10">
                     <div className="text-[10px] text-gray-400">{goal.type}</div>
                  </div>
               </div>
             );
          })}

        </div>

      </div>
    </motion.div>
  );
};

