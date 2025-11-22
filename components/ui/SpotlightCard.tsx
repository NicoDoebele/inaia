"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(212, 175, 55, 0.2)", // Unused in simple version but kept for API compatibility
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-inaia-gold/30 transition-colors duration-300 ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};
