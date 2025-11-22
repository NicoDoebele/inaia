"use client";

import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string; // Kept for API compatibility
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor, // Unused but destructured to avoid passing to div
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
