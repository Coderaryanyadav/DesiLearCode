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
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const variantFills = {
    brand: 'bg-primary-500',
    emerald: 'bg-success-600',
    amber: 'bg-accent-500',
  }[variant];

  return (
    <div className="w-full space-y-1.5">
      {(showLabel || labelLeft || labelRight) && (
        <div className="flex justify-between items-center text-xs font-medium text-muted">
          <span className="truncate">{labelLeft || 'Funded allocation'}</span>
          <span className="font-mono text-foreground font-semibold shrink-0 ml-2">{labelRight || `${clamped}%`}</span>
        </div>
      )}
      <div className={`w-full bg-surfaceSubtle rounded-sm overflow-hidden border border-borderMuted ${heightClasses}`}>
        <div
          className={`h-full rounded-xs transition-all duration-500 ease-out ${variantFills}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
