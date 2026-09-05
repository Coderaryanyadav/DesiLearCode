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

  const priorityColors = {
    urgent: 'bg-error-100 text-error-800 border-error-200',
    high: 'bg-warning-100 text-warning-800 border-warning-200',
    medium: 'bg-info-100 text-info-800 border-info-200',
    low: 'bg-surfaceHover text-muted border-border',
  }[need.priority || 'medium'];

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
      need.fulfilled 
        ? 'bg-surfaceHover border-border opacity-80' 
        : 'bg-surface border-border hover:border-primary-200 hover:shadow-card-hover'
    }`}>
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              need.fulfilled 
                ? 'bg-success-50 text-success-600 border-success-100' 
                : 'bg-primary-50 text-primary-600 border-primary-100'
            }`}>
              {need.fulfilled ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${priorityColors}`}>
                {need.priority.toUpperCase()} PRIORITY
              </span>
              <h4 className="font-display font-bold text-foreground text-sm md:text-base mt-1.5 leading-snug">
                {need.title}
              </h4>
            </div>
          </div>
        </div>

        {/* Project Context */}
        <div className="text-xs text-muted flex flex-col gap-1">
          <span>Project: <strong className="text-foreground font-semibold">{need.projectTitle}</strong></span>
          <span>By: <span className="text-primary-600 font-medium">{need.organizationName}</span></span>
        </div>

        {/* Purpose Description */}
        <p className="text-sm text-muted leading-relaxed bg-surfaceHover p-3 rounded-xl border border-border">
          <strong className="text-foreground font-semibold block mb-1">Purpose:</strong>
          {need.purpose}
        </p>

        {/* Progress */}
        <div className="pt-2">
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
      <div className="pt-5 mt-3 border-t border-border">
        {need.type === 'mentor' ? (
          <Link
            href="/volunteer/apply"
            className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
          >
            <Code className="w-4 h-4" />
            Volunteer for this Need
          </Link>
        ) : need.type === 'laptop' || need.type === 'desktop' || need.type === 'tablet' ? (
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/donate-device"
              className="py-2.5 text-center text-sm font-semibold rounded-xl bg-success-600 hover:bg-success-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Laptop className="w-4 h-4" />
              Donate Device
            </Link>
            <button
              onClick={() => onFulfillClick && onFulfillClick(need)}
              className="py-2.5 text-center text-sm font-semibold rounded-xl bg-surfaceHover hover:bg-border text-foreground transition-colors border border-transparent hover:border-muted/30"
            >
              Fund Refurbish
            </button>
          </div>
        ) : (
          <button
            onClick={() => onFulfillClick && onFulfillClick(need)}
            className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-foreground hover:bg-foreground/90 text-surface transition-all shadow-card"
          >
            Help Fulfill This Need
          </button>
        )}
      </div>
    </div>
  );
};
