import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Card from './Card';

/**
 * Reusable StatsCard Component
 * 
 * Displays a single key metric with a icon badge, value, trend direction, and description.
 * Inherits ProfileHub's card layout and hover aesthetics.
 * 
 * Props:
 * @param {string} title - Label for the statistic (e.g. 'Profile Views')
 * @param {string|number} value - The actual metric value to display
 * @param {React.ComponentType} icon - Lucide Icon component class to render
 * @param {string|number} trend - Percentage or volume variance (e.g. '+14.2%')
 * @param {string} trendType - Direction of growth ('up' | 'down' | 'neutral')
 * @param {string} description - Optional context summary below the value
 * @param {boolean} loading - Displays a pulsing skeleton state when true
 */
export default function StatsCard({
  title,
  value,
  icon: IconComponent,
  trend,
  trendType = 'neutral',
  description,
  loading = false,
}) {
  // 1. Loading Skeleton state
  if (loading) {
    return (
      <Card hoverEffect={false}>
        <div className="flex items-start justify-between">
          <div className="space-y-2.5">
            {/* Title skeleton */}
            <div className="h-4 w-24 rounded bg-[#032e2e] animate-pulse" />
            {/* Value skeleton */}
            <div className="h-8 w-16 rounded bg-[#032e2e] animate-pulse pt-2" />
          </div>
          {/* Icon badge skeleton */}
          <div className="h-10 w-10 rounded-full bg-[#032e2e] animate-pulse" />
        </div>
        {/* Subtext skeleton */}
        <div className="h-3 w-32 rounded bg-[#032e2e] animate-pulse mt-4" />
      </Card>
    );
  }

  // 2. Trend styling map
  const trendConfig = {
    up: {
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: ArrowUpRight,
    },
    down: {
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      icon: ArrowDownRight,
    },
    neutral: {
      color: 'text-[#7da3a3] bg-[#022424] border-[#084848]/60',
      icon: Minus,
    },
  };

  const activeTrend = trendConfig[trendType] || trendConfig.neutral;
  const TrendIcon = activeTrend.icon;

  return (
    <Card className="relative overflow-hidden group">
      {/* Subtle gold line glow at the top on group hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      {/* Main Metric content */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7da3a3]">{title}</h4>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#e2f1f1] tracking-tight pt-1">
            {value}
          </p>
        </div>

        {/* Metric circular icon badge */}
        {IconComponent && (
          <div className="flex items-center justify-center h-10 w-10 rounded-full border border-[#084848] bg-[#022424] text-emerald-400 group-hover:text-amber-400 group-hover:border-[#0c5c5c] group-hover:scale-105 transition-all duration-200 shadow-md shadow-black/25">
            <IconComponent size={18} />
          </div>
        )}
      </div>

      {/* Footer info: Trend and Subtext */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#083030]/20">
        {trend && (
          <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${activeTrend.color}`}>
            <TrendIcon size={12} />
            <span>{trend}</span>
          </div>
        )}
        
        {description && (
          <span className="text-xs text-[#7da3a3] font-medium truncate">{description}</span>
        )}
      </div>
    </Card>
  );
}
