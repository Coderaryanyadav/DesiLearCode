'use client';

import React from 'react';
import Link from 'next/link';
import { NeedItem } from '@/lib/types';
import { ProgressBar } from './ProgressBar';
import { Laptop, Code, Wifi, BookOpen, Cpu, Wrench, Shield, CheckCircle2 } from 'lucide-react';

const NEED_ICONS: Record<string, any> = {
  laptop: Laptop,
  desktop: Laptop,
  tablet: Laptop,
  mentor: Code,
  refurbishment_fund: Wrench,
  arduino_kit: Cpu,
  books: BookOpen,
  internet_sponsorship: Wifi,
  peripherals: Cpu,
  school_supplies: BookOpen,
};

export const NeedCard: React.FC<{ 
  need: NeedItem; 
  onFulfillClick?: (need: NeedItem) => void;
}> = ({ need, onFulfillClick }) => {
  const Icon = NEED_ICONS[need.type] || Laptop;
  const percentage = Math.min(100, Math.round((need.quantityFulfilled / need.quantityRequired) * 100));

  const priorityClasses = {
    urgent: 'bg-error-50 text-error-700 border-error-200',
    high: 'bg-accent-50 text-accent-700 border-accent-200',
    medium: 'bg-primary-50 text-primary-700 border-primary-200',
    low: 'bg-surfaceSubtle text-muted border-border',
  }[need.priority || 'medium'];

  return (
    <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
      need.fulfilled 
        ? 'bg-surfaceSubtle border-border opacity-75' 
        : 'bg-surface border-border hover:border-borderMuted hover:shadow-panel'
    }`}>
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border ${
              need.fulfilled 
                ? 'bg-success-50 text-success-600 border-success-200' 
                : 'bg-surfaceSubtle text-primary-600 border-border'
            }`}>
              {need.fulfilled ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <div>
              <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${priorityClasses}`}>
                {(need.priority || 'NORMAL').toUpperCase()}
              </span>
              <h4 className="font-bold text-foreground text-sm mt-1 leading-snug">
                {need.title}
              </h4>
            </div>
          </div>
        </div>

        {/* Project Context */}
        <div className="text-xs text-muted flex flex-col gap-0.5 font-mono">
          <span>PROJECT: <strong className="text-foreground font-sans font-medium">{need.projectTitle}</strong></span>
          <span>ORG: <span className="text-primary-600 font-sans">{need.organizationName}</span></span>
        </div>

        {/* Purpose Description */}
        <p className="text-xs text-muted leading-relaxed bg-surfaceSubtle p-2.5 rounded-md border border-border">
          <strong className="text-foreground block font-medium mb-0.5 font-sans">Required For:</strong>
          {need.purpose}
        </p>

        {/* Progress */}
        <div className="pt-1">
          <ProgressBar
            percentage={percentage}
            labelLeft={`${need.quantityFulfilled} / ${need.quantityRequired} ${need.unit}`}
            labelRight={`${percentage}%`}
            variant={percentage >= 100 ? 'emerald' : 'brand'}
            size="sm"
          />
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-3 mt-3 border-t border-border">
        {need.type === 'mentor' ? (
          <Link
            href="/volunteer/apply"
            className="w-full py-2 text-center text-xs font-medium rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors flex items-center justify-center gap-1.5 border border-primary-200"
          >
            <Code className="w-3.5 h-3.5" />
            Volunteer for this Need
          </Link>
        ) : need.type === 'laptop' || need.type === 'desktop' || need.type === 'tablet' ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/donate-device"
              className="py-2 text-center text-xs font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Laptop className="w-3.5 h-3.5" />
              Pledge Device
            </Link>
            <button
              onClick={() => onFulfillClick && onFulfillClick(need)}
              className="py-2 text-center text-xs font-medium rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors"
            >
              Sponsor Fund
            </button>
          </div>
        ) : (
          <button
            onClick={() => onFulfillClick && onFulfillClick(need)}
            className="w-full py-2 text-center text-xs font-medium rounded-md bg-foreground hover:bg-foreground/90 text-surface transition-colors"
          >
            Fulfill Requirement
          </button>
        )}
      </div>
    </div>
  );
};
