"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PieChart as PieIcon, Layers, TrendingUp, Globe, Info, Briefcase, Map as MapIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PRODUCTS_DATA from '../products.json';
import { PieChart } from './PieChart';
import { SpotlightCard } from './ui/SpotlightCard';

// Helper to generate nice finance-themed colors
const getPalette = (count: number) => {
  const palette = [
    '#D4AF37', // Gold
    '#10B981', // Emerald
    '#3B82F6', // Royal Blue
    '#8B5CF6', // Violet
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
  ];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

interface EtfAnalysisProps {
  onBack?: () => void;
}

export const EtfAnalysis: React.FC<EtfAnalysisProps> = ({ onBack }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  
  // Filter only products that have allocations (ETFs)
  const etfs = useMemo(() => {
    return PRODUCTS_DATA.investment_products.filter(p => p.allocations);
  }, []);

  const [selectedEtfId, setSelectedEtfId] = useState<string>(etfs[0]?.id || "");
  const [viewMode, setViewMode] = useState<'sectors' | 'regions'>('sectors');

  const selectedEtf = useMemo(() => 
    etfs.find(p => p.id === selectedEtfId), 
  [selectedEtfId, etfs]);

  // Parse allocations for Pie Chart
  const chartData = useMemo(() => {
    if (!selectedEtf?.allocations) return [];
    
    let source: string[] = [];
    
    // Determine source based on viewMode and availability
    if (viewMode === 'sectors') {
      source = selectedEtf.allocations.top_sectors || [];
    } else {
      source = selectedEtf.allocations.top_regions || [];
    }
    
    // Sort by value descending for deterministic visual order
    return source.map((item, index) => {
      let parsedItem;
      // Parse "Name (Value%)" string
      // Support "Name (20%)", "Name (20.5%)", "Name ( 20% )"
      const match = item.match(/(.*?)\s*\(\s*(\d+(?:\.\d+)?)\s*%\s*\)/);
      if (match) {
        parsedItem = {
          name: match[1].trim(),
          value: parseFloat(match[2]),
          // We'll assign color later after sorting
        };
      } else {
        // If just a string
        parsedItem = {
          name: item,
          value: Math.round(100 / source.length),
        };
      }
      return parsedItem;
    })
    .sort((a, b) => b.value - a.value) // Sort descending
    .map((item, index) => ({
       ...item,
       color: getPalette(source.length)[index] // Assign colors based on sorted order for consistency
    }));
  }, [selectedEtf, viewMode]);

  // Check availability for toggle buttons
  const hasSectors = (selectedEtf?.allocations?.top_sectors?.length || 0) > 0;
  const hasRegions = (selectedEtf?.allocations?.top_regions?.length || 0) > 0;

  // Auto-switch if current view is empty but other is available
  React.useEffect(() => {
    if (viewMode === 'sectors' && !hasSectors && hasRegions) setViewMode('regions');
    if (viewMode === 'regions' && !hasRegions && hasSectors) setViewMode('sectors');
  }, [selectedEtfId, hasSectors, hasRegions, viewMode]);

  return (
    <div className="w-full min-h-screen bg-inaia-navy text-white p-6 md:p-12 flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack} 
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} className="text-inaia-gold" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Fund Composition Analysis</h1>
            <p className="text-gray-400">Deep dive into your portfolio's underlying assets</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Selector & Info */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers size={16} /> Select Fund
            </h3>
            <div className="flex flex-col gap-2">
              {etfs.map((etf) => (
                <button
                  key={etf.id}
                  onClick={() => setSelectedEtfId(etf.id)}
                  className={`p-4 rounded-xl text-left transition-all border group relative overflow-hidden ${
                    selectedEtfId === etf.id 
                      ? 'bg-inaia-gold/10 border-inaia-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                   {selectedEtfId === etf.id && (
                      <motion.div 
                        layoutId="active-glow"
                        className="absolute inset-0 bg-gradient-to-r from-inaia-gold/10 to-transparent pointer-events-none"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                   )}
                  <div className="font-bold relative z-10">{etf.name}</div>
                  <div className="text-xs opacity-70 mt-1 relative z-10 flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${selectedEtfId === etf.id ? 'bg-inaia-gold' : 'bg-gray-600'}`}></span>
                     {etf.type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedEtf && (
            <SpotlightCard className="bg-gradient-to-br from-inaia-navy-light to-inaia-navy border-white/10 p-6">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                   <TrendingUp size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-xl text-white">Performance Profile</h3>
                   <p className="text-xs text-blue-300 uppercase tracking-wider font-bold">Analysis</p>
                 </div>
               </div>
               
               <div className="space-y-5">
                 <div className="flex justify-between items-center border-b border-white/5 pb-3">
                   <span className="text-gray-400 text-sm flex items-center gap-2">
                      <TrendingUp size={14} /> Expected Return
                   </span>
                   <span className="text-green-400 font-bold text-lg">{selectedEtf.expected_return}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/5 pb-3">
                   <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Info size={14} /> Risk Level
                   </span>
                   <span className="text-white font-medium bg-white/10 px-2 py-1 rounded text-sm">
                      {selectedEtf.risk_profile.level}
                   </span>
                 </div>
                 
                 <div className="relative p-4 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-inaia-gold"></div>
                    <p className="text-sm text-gray-300 italic leading-relaxed pl-2">
                      "{selectedEtf.scenario_2_crisis.best_for_user_who_says}"
                    </p>
                 </div>
               </div>
            </SpotlightCard>
          )}
        </div>

        {/* Right Column: Visualization */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
           {selectedEtf && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
               
               {/* Pie Chart Section */}
               <SpotlightCard className="bg-inaia-navy-light border-white/10 p-8 flex flex-col items-center justify-between relative min-h-[500px]">
                 <div className="w-full flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <PieIcon size={20} className="text-inaia-gold" />
                      Composition
                    </h3>
                 </div>
                 
                 <div className="my-4 relative z-10 h-[300px] w-full flex items-center justify-center">
                   {/* Key triggers re-render of internal state/animations when data changes */}
                   <PieChart 
                     key={`${selectedEtfId}-${viewMode}`}
                     data={chartData} 
                     width={300} 
                     height={300} 
                     innerRadius={85}
                     outerRadius={145}
                   />
                 </div>

                 <div className="w-full flex flex-col items-center gap-4 mt-auto">
                    
                    {/* View Toggle - Moved Below Chart */}
                    <div className="flex bg-white/5 rounded-full p-1 gap-1 border border-white/5">
                      <button
                        onClick={() => setViewMode('sectors')}
                        disabled={!hasSectors}
                        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
                          viewMode === 'sectors' 
                          ? 'bg-inaia-gold text-inaia-navy shadow-lg scale-105' 
                          : 'text-gray-400 hover:text-white'
                        } ${!hasSectors ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <PieIcon size={12} /> Sectors
                      </button>
                      <button
                         onClick={() => setViewMode('regions')}
                         disabled={!hasRegions}
                         className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
                          viewMode === 'regions' 
                          ? 'bg-inaia-gold text-inaia-navy shadow-lg scale-105' 
                          : 'text-gray-400 hover:text-white'
                        } ${!hasRegions ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <MapIcon size={12} /> Regions
                      </button>
                    </div>

                    {/* Legend Grid */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-2 border-t border-white/5 pt-4">
                      <AnimatePresence mode="wait">
                        {chartData.length > 0 ? (
                          chartData.map((item, idx) => (
                            <motion.div 
                                key={item.name} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex items-center gap-3 text-xs p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5"
                            >
                              <div className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}40` }}></div>
                              <span className="text-gray-300 font-medium truncate">{item.name}</span>
                              <span className="text-white font-bold ml-auto bg-white/10 px-1.5 py-0.5 rounded">{item.value}%</span>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center text-gray-500 py-4 text-sm italic">
                            No breakdown data available for this view.
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                 </div>
               </SpotlightCard>

               {/* Top Holdings Section */}
               <div className="flex flex-col gap-6">
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 overflow-hidden relative">
                    {/* Background Decoration */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-inaia-gold/5 rounded-full blur-3xl pointer-events-none"></div>

                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                      <Globe size={20} className="text-inaia-gold" /> Top Holdings
                    </h3>
                    <div className="space-y-3 relative z-10">
                      {selectedEtf.allocations?.top_companies?.map((company, i) => (
                        <motion.div 
                          key={company}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/10 hover:border-inaia-gold/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all"
                        >
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-xs font-bold border border-white/5">
                                {company.charAt(0)}
                             </div>
                             <span className="font-medium text-gray-200 group-hover:text-white">{company}</span>
                          </div>
                          <span className="text-xs text-inaia-gold font-mono opacity-50 group-hover:opacity-100 transition-opacity">
                            #{i + 1}
                          </span>
                        </motion.div>
                      ))}
                      {(!selectedEtf.allocations?.top_companies || selectedEtf.allocations.top_companies.length === 0) && (
                        <div className="text-gray-500 italic text-center py-10">No holding data available</div>
                      )}
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-inaia-gold/10 to-transparent border border-inaia-gold/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-20 h-20 bg-inaia-gold/10 rounded-bl-full pointer-events-none"></div>
                    <h4 className="text-inaia-gold font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                      <Briefcase size={14} /> Investment Thesis
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                      {selectedEtf.risk_profile.description}
                    </p>
                 </div>
               </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
};
