import React from 'react';
import { RiskLevel } from '../../types/safety';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold tracking-wide',
    lg: 'px-3.5 py-1.5 text-sm font-bold tracking-wider'
  };

  const badgeStyles = {
    CRITICAL: 'bg-red-100 text-red-800 border border-red-300 shadow-sm',
    HIGH: 'bg-orange-100 text-orange-800 border border-orange-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border border-amber-300',
    LOW: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
  };

  return (
    <span className={`inline-flex items-center rounded-md uppercase ${sizeClasses[size]} ${badgeStyles[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        level === 'CRITICAL' ? 'bg-red-600 animate-pulse' :
        level === 'HIGH' ? 'bg-orange-500' :
        level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
      }`}></span>
      {level}
    </span>
  );
};
