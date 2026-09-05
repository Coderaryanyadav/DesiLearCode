'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'emerald' | 'amber';
  labelLeft?: string;
  labelRight?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  size = 'md',
  variant = 'brand',
  labelLeft,
  labelRight,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  const variantGradients = {
    brand: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-500',
  }[variant];

  return (
    <div className="w-full space-y-1.5">
      {(showLabel || labelLeft || labelRight) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
          <span>{labelLeft || 'Progress'}</span>
          <span>{labelRight || `${clamped}%`}</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 ${heightClasses}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${variantGradients}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
