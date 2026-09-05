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
    brand: 'bg-primary-500',
    emerald: 'bg-success-500',
    amber: 'bg-warning-500',
  }[variant];

  return (
    <div className="w-full space-y-2">
      {(showLabel || labelLeft || labelRight) && (
        <div className="flex justify-between items-center text-xs font-semibold text-muted">
          <span>{labelLeft || 'Progress'}</span>
          <span>{labelRight || `${clamped}%`}</span>
        </div>
      )}
      <div className={`w-full bg-surfaceHover rounded-full overflow-hidden border border-border ${heightClasses}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${variantGradients}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
