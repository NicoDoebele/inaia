"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield, TrendingUp, Zap } from 'lucide-react';

interface RiskAssessmentProps {
  riskScore: number;
  setRiskScore: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  onBack: () => void;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ riskScore, setRiskScore, onNext, onBack }) => {

  const getRiskLabel = (score: number) => {
    if (score < 30) return { label: "Conservative", color: "text-green-400", icon: Shield };
    if (score < 70) return { label: "Moderate", color: "text-yellow-400", icon: TrendingUp };
    return { label: "Aggressive", color: "text-red-400", icon: Zap };
  };

  const riskInfo = getRiskLabel(riskScore);
  const RiskIcon = riskInfo.icon;

  // Generate path for the graph based on risk score
  // Higher risk = higher amplitude, more jagged
  const generateGraphPath = (score: number) => {
    const width = 600;
    const height = 200;
    const points = 20;
    let path = `M 0 ${height}`;
    
    const volatility = score / 100; // 0 to 1
    const growthFactor = 0.5 + (score / 200); // Steeper slope for higher risk

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      // Base curve (exponential growth)
      const baseY = height - (Math.pow(i / points, 2) * height * 0.8); 
      // Random noise (volatility)
      const noise = (Math.random() - 0.5) * 50 * volatility * (i/points); // More volatility later in time
      
      path += ` L ${x} ${baseY + noise}`;
    }
    return path;
  };
  
  // Use a consistent seed/memo for the path so it doesn't jitter uncontrollably, 
  // actually we want it to change when risk changes to show "simulation" effect.
  // But purely random causes too much flicker. 
  // Let's use a sine wave combination for smooth transition.
  const generateSmoothGraph = (score: number) => {
    const width = 1000;
    const height = 300;
    let d = `M 0 ${height/2 + 100}`;
    
    // 3 sine waves combined
    const amp1 = 20 + (score * 1.5); 
    const freq1 = 0.01 + (score * 0.0005);
    
    for (let x = 0; x <= width; x+=10) {
      const y = (height/2 + 50) 
                - (x * 0.15 * (0.5 + score/100)) // General Upward trend
                + Math.sin(x * freq1) * amp1 // Volatility
                + Math.sin(x * 0.05) * (score * 0.2); // Micro jitter
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full flex flex-col lg:flex-row gap-8"
    >
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="glass-panel p-8 flex-1 flex flex-col justify-center">
           <h3 className="text-2xl font-bold text-white mb-2">Risk Tolerance</h3>
           <p className="text-gray-400 mb-8">Adjust the slider to find your comfort zone between safety and growth.</p>

           <div className="mb-10">
             <div className="flex justify-between mb-4">
               <span className="text-xs uppercase tracking-wider text-gray-500">Safety</span>
               <span className="text-xs uppercase tracking-wider text-gray-500">Growth</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={riskScore} 
               onChange={(e) => setRiskScore(parseInt(e.target.value))}
               className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-inaia-gold"
             />
           </div>

           <div className="bg-black/20 rounded-2xl p-6 border border-white/5 text-center">
              <div className={`inline-flex p-4 rounded-full bg-white/5 mb-4 ${riskInfo.color}`}>
                <RiskIcon size={32} />
              </div>
              <h4 className={`text-3xl font-bold mb-2 transition-colors ${riskInfo.color}`}>{riskInfo.label}</h4>
              <p className="text-sm text-gray-400">
                {riskScore < 30 && "Prioritizing capital preservation over high returns. Minimal fluctuation."}
                {riskScore >= 30 && riskScore < 70 && "Balanced approach seeking growth with moderate fluctuations."}
                {riskScore >= 70 && "Seeking maximum long-term growth, accepting significant short-term volatility."}
              </p>
           </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button 
            onClick={onNext}
            className="flex-1 py-3 bg-inaia-gold text-inaia-navy font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel relative overflow-hidden flex flex-col p-8">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-inaia-gold/10 via-transparent to-transparent pointer-events-none"></div>
         
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-inaia-gold">Projected Volatility Simulation</h3>
            <div className="flex gap-4 text-xs text-gray-500">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-inaia-gold"></div> Portfolio</div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-600"></div> Market Avg</div>
            </div>
         </div>

         <div className="flex-1 relative flex items-end pb-10">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#333" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="100%" stroke="#333" strokeWidth="1" />

              {/* Animated Graph Path */}
              <motion.path
                d={generateSmoothGraph(riskScore)}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ d: generateSmoothGraph(riskScore), pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              
              {/* Area under curve (optional, complex to animate d properly with fill) */}
              <motion.path
                 d={`${generateSmoothGraph(riskScore)} L 1000 400 L 0 400 Z`}
                 fill="url(#gradient-gold)"
                 opacity="0.2"
                 animate={{ d: `${generateSmoothGraph(riskScore)} L 1000 400 L 0 400 Z` }}
                 transition={{ duration: 0.5 }}
              />

              <defs>
                <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Labels for effect */}
            <motion.div 
               className="absolute top-[20%] right-[10%] bg-inaia-navy/80 backdrop-blur px-3 py-1 rounded border border-inaia-gold/30 text-inaia-gold text-xs font-mono"
               animate={{ y: riskScore > 50 ? -20 : 20 }}
            >
              Potential Return: {3 + (riskScore * 0.08).toFixed(1)}%
            </motion.div>
         </div>
      </div>
    </motion.div>
  );
};

