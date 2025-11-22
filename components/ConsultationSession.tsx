"use client";

import React from 'react';
import { ParticleBackground } from './ui/ParticleBackground';
import { AdvisoryShell } from './AdvisoryShell';

// Legacy types kept for compatibility if needed elsewhere
export interface LifeGoal {
  id: string;
  type: 'house' | 'hajj' | 'wedding' | 'education' | 'retirement' | 'other';
  title: string;
  cost: number;
  year: number;
  icon: React.ReactNode;
}

export const ConsultationSession = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-inaia-navy text-white font-sans selection:bg-inaia-gold selection:text-inaia-navy">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-inaia-navy via-transparent to-inaia-navy pointer-events-none"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <header className="w-full p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-inaia-gold rounded-tr-xl rounded-bl-xl flex items-center justify-center font-bold text-inaia-navy">
              I
            </div>
            <span className="font-bold text-xl tracking-tight">INAIA</span>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            AI Wealth Advisor
          </div>
        </header>

        {/* AI Advisory Shell */}
        <div className="flex-1 overflow-hidden relative">
          <AdvisoryShell />
        </div>
      </div>
    </div>
  );
};
