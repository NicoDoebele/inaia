"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Shield, CheckCircle, Info } from 'lucide-react';
import { LifeGoal } from './ConsultationSession';
import { INAIA_PRODUCTS } from '../lib/products';
import { SpotlightCard } from './ui/SpotlightCard';

interface PortfolioEngineProps {
  goals: LifeGoal[];
  riskScore: number;
  monthlySavings: number;
  setMonthlySavings: React.Dispatch<React.SetStateAction<number>>;
  targetWealth: number;
  onBack: () => void;
  dreamText?: string;
}

export const PortfolioEngine: React.FC<PortfolioEngineProps> = ({ 
  goals, 
  riskScore, 
  monthlySavings, 
  setMonthlySavings, 
  targetWealth,
  onBack,
  dreamText
}) => {
  
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      
      // Dynamic Mock Logic based on inputs
      const isConservative = riskScore < 40;
      const isAggressive = riskScore > 70;
      
      const result = {
        summary: isConservative 
          ? "We've prioritized capital preservation with Gold and Platinum to ensure your short-term goals are met safely."
          : "This high-growth allocation leverages global equities to maximize wealth over your long 20+ year horizon.",
        projectedOutcome: "Projected to reach €" + (monthlySavings * 12 * 30 * 1.07).toLocaleString() + " in 30 years.",
        allocations: [
          { 
            productId: 'global-fund', 
            percentage: isAggressive ? 70 : (isConservative ? 20 : 50), 
            reasoning: isAggressive ? "Maximum exposure to global markets for compounding." : "Base growth component."
          },
          { 
            productId: 'gold-standard', 
            percentage: isAggressive ? 20 : (isConservative ? 50 : 30), 
            reasoning: "Your anchor against currency devaluation."
          },
          { 
            productId: 'platinum-income', 
            percentage: isAggressive ? 10 : (isConservative ? 30 : 20), 
            reasoning: "Steady, rental-based income stream."
          }
        ]
      };
      
      setRecommendation(result);
      setLoading(false);
    };

    fetchAI();
  }, [riskScore, goals, monthlySavings]);

  // Calculate projection data
  const years = 30;
  const returnRate = 0.07;
  
  // Generate smooth path data for the area chart
  const generatePath = (width: number, height: number) => {
    const data = Array.from({ length: years + 1 }, (_, i) => {
        const compound = (monthlySavings * 12) * ((Math.pow(1 + returnRate, i) - 1) / returnRate);
        return i === 0 ? 0 : compound;
    });
    const max = data[years];
    
    // SVG Path generation
    let d = `M 0 ${height}`;
    data.forEach((val, i) => {
        const x = (i / years) * width;
        const y = height - ((val / max) * height * 0.8); // Use 80% of height
        d += ` L ${x} ${y}`;
    });
    
    // Close the path for area fill
    const areaD = `${d} L ${width} ${height} Z`;
    
    return { line: d, area: areaD, max };
  };
  
  const { line, area, max: maxVal } = generatePath(600, 300); // Virtual dimensions

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Scenarios
        </button>
        <h2 className="text-2xl font-bold text-gradient-gold">Your Intelligent Portfolio</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        
        {/* Left Col: AI Recommendation */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          
          <SpotlightCard className="p-6 bg-gradient-to-br from-inaia-navy-light to-inaia-gold/5 border-inaia-gold/20">
             {loading ? (
                <div className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
             ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <div className="flex gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-inaia-gold/20 flex items-center justify-center text-inaia-gold">
                         <Shield size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-white text-lg">Strategy: {riskScore > 60 ? 'Aggressive Growth' : 'Balanced Wealth'}</h3>
                         <p className="text-sm text-inaia-gold">{recommendation?.projectedOutcome}</p>
                      </div>
                   </div>
                   <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-inaia-gold/30 pl-4 italic">
                     "{recommendation?.summary}"
                   </p>
                </motion.div>
             )}
          </SpotlightCard>

          <div className="glass-panel p-0 overflow-hidden flex-1 flex flex-col">
             <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Allocation Strategy</h3>
                <span className="text-xs text-inaia-gold">100% Ethical & Secure</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  [1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)
                ) : (
                  recommendation?.allocations.map((alloc: any) => {
                    const product = INAIA_PRODUCTS.find(p => p.id === alloc.productId);
                    return (
                      <motion.div 
                        key={alloc.productId}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-inaia-gold/30 transition-colors group"
                      >
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <div className="text-inaia-gold font-bold">{product?.name}</div>
                               <div className="text-xs text-gray-500">{product?.type} • {product?.expectedReturn} Return</div>
                            </div>
                            <div className="text-xl font-bold text-white">{alloc.percentage}%</div>
                         </div>
                         
                         <div className="w-full h-1.5 bg-gray-800 rounded-full mb-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${alloc.percentage}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full ${product?.type === 'Gold' ? 'bg-inaia-gold' : 'bg-blue-500'}`} 
                            />
                         </div>
                         
                         <div className="flex gap-2 items-start">
                           <Info size={12} className="text-gray-500 mt-0.5 shrink-0" />
                           <p className="text-[11px] text-gray-400 leading-tight">
                             {alloc.reasoning}
                           </p>
                         </div>
                      </motion.div>
                    );
                  })
                )}
             </div>
          </div>
        </div>

        {/* Right Col: Organic Graph */}
        <SpotlightCard className="flex-1 flex flex-col relative overflow-hidden bg-inaia-navy-light" spotlightColor="rgba(59, 130, 246, 0.1)">
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)]"></div>

          <div className="p-8 flex justify-between items-start relative z-10">
             <div>
               <h3 className="text-xl font-bold text-white">Wealth Projection</h3>
               <p className="text-sm text-gray-400">Compounding power over 30 years</p>
             </div>
             <div className="text-right">
               <div className="text-sm text-gray-400">Year 2055 Value</div>
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
                   <CheckCircle size={12} /> Goal Achieved
                 </div>
               ) : (
                 <div className="text-red-400 text-xs font-bold flex items-center justify-end gap-1">
                   Gap: €{Math.round(targetWealth - maxVal).toLocaleString()}
                 </div>
               )}
             </div>
          </div>

          <div className="flex-1 w-full relative z-10">
             <svg className="w-full h-full overflow-visible" viewBox="0 0 600 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
                    <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
                  </linearGradient>
                </defs>
                
                {/* Area */}
                <motion.path
                  d={area}
                  fill="url(#graphGradient)"
                  initial={{ d: `M 0 300 L 600 300 Z` }}
                  animate={{ d: area }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                
                {/* Line */}
                <motion.path
                  d={line}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, d: line }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
             </svg>
             
             {/* Hover interaction overlay could go here */}
          </div>

          <div className="p-8 bg-white/5 backdrop-blur-sm border-t border-white/5 relative z-20">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Monthly Contribution</span>
                <span className="text-lg font-bold text-inaia-gold">€{monthlySavings}</span>
             </div>
             <input 
               type="range" 
               min="100" 
               max="5000" 
               step="100" 
               value={monthlySavings} 
               onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
               className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-inaia-gold"
             />
             <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>€100</span>
                <span>€5,000</span>
             </div>
          </div>

        </SpotlightCard>

      </div>
    </motion.div>
  );
};
