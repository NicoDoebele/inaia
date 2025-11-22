"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 300,
  height = 300,
  innerRadius = 60,
  outerRadius = 140,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  const centerX = width / 2;
  const centerY = height / 2;

  if (total === 0) {
    return (
      <div className="relative flex items-center justify-center" style={{ width, height }}>
        <div className="text-gray-500 text-sm italic">No data available</div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Glow Filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          // Convert angles to radians (subtract 90deg to start from top)
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);
          
          const x1 = centerX + outerRadius * Math.cos(startRad);
          const y1 = centerY + outerRadius * Math.sin(startRad);
          const x2 = centerX + outerRadius * Math.cos(endRad);
          const y2 = centerY + outerRadius * Math.sin(endRad);
          
          const x3 = centerX + innerRadius * Math.cos(endRad);
          const y3 = centerY + innerRadius * Math.sin(endRad);
          const x4 = centerX + innerRadius * Math.cos(startRad);
          const y4 = centerY + innerRadius * Math.sin(startRad);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            `Z`
          ].join(' ');

          currentAngle += angle;

          const isHovered = hoveredIndex === index;

          return (
            <g 
              key={item.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.path
                d={pathData}
                fill={item.color || `hsl(${index * 45}, 70%, 50%)`}
                stroke={isHovered ? "white" : "rgba(255,255,255,0.05)"}
                strokeWidth={isHovered ? 2 : 1}
                initial={{ opacity: 0, scale: 0.9, pathLength: 0 }}
                animate={{ 
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1, 
                  scale: isHovered ? 1.05 : 1,
                  pathLength: 1,
                  filter: isHovered ? "url(#glow)" : "none"
                }}
                transition={{ 
                  scale: { type: "spring", stiffness: 300, damping: 20 },
                  opacity: { duration: 0.2 },
                  pathLength: { duration: 1, ease: "circOut", delay: index * 0.1 }
                }}
                className="cursor-pointer"
                style={{ transformOrigin: "center" }}
              />
            </g>
          );
        })}
        
        {/* Center Text */}
        <foreignObject x={centerX - innerRadius} y={centerY - innerRadius} width={innerRadius * 2} height={innerRadius * 2} className="pointer-events-none">
             <div className="w-full h-full flex flex-col items-center justify-center text-center">
               <AnimatePresence mode="wait">
                 {hoveredIndex !== null ? (
                   <motion.div
                     key="hovered"
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                     className="flex flex-col items-center"
                   >
                     <span className="text-inaia-gold font-bold text-2xl">{data[hoveredIndex].value}%</span>
                     <span className="text-gray-400 text-xs max-w-[80px] truncate">{data[hoveredIndex].name}</span>
                   </motion.div>
                 ) : (
                   <motion.div
                     key="default"
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                   >
                      <span className="text-white font-bold text-sm">Composition</span>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
        </foreignObject>

      </svg>
    </div>
  );
};
