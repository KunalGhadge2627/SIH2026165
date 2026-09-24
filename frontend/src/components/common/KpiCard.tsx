import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  badgeText?: string;
  badgeType?: 'critical' | 'high' | 'warning' | 'info' | 'success';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  icon: Icon,
  badgeText,
  badgeType = 'info',
  onClick
}) => {
  const badgeColors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-oil-blue' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-oil-navy tracking-tight">
            {value}
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-oil-blue">
          <Icon className="w-6 h-6 text-oil-navy" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        {badgeText && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColors[badgeType]}`}>
            {badgeText}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-2 text-xs font-medium text-slate-600 flex items-center gap-1">
          <span
            className={
              trendDirection === 'down'
                ? 'text-emerald-600 font-bold'
                : trendDirection === 'up'
                ? 'text-red-600 font-bold'
                : 'text-slate-600'
            }
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
