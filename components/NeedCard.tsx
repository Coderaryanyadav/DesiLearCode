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
    urgent: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-amber-100 text-amber-800 border-amber-200',
    medium: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  }[need.priority || 'medium'];

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
      need.fulfilled 
        ? 'bg-slate-50 border-slate-200 opacity-80' 
        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-card-hover'
    }`}>
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              need.fulfilled 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-indigo-50 text-indigo-600'
            }`}>
              {need.fulfilled ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Icon className="w-5 h-5" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors}`}>
                {need.priority.toUpperCase()} PRIORITY
              </span>
              <h4 className="font-bold text-slate-900 text-sm md:text-base mt-1 leading-snug">
                {need.title}
              </h4>
            </div>
          </div>
        </div>

        {/* Project Context */}
        <div className="text-xs text-slate-500 flex flex-col gap-0.5">
          <span>Project: <strong className="text-slate-800 font-semibold">{need.projectTitle}</strong></span>
          <span>By: <span className="text-indigo-600 font-medium">{need.organizationName}</span></span>
        </div>

        {/* Purpose Description */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <strong className="text-slate-800 font-semibold block mb-0.5">Purpose:</strong>
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
      <div className="pt-4 mt-2 border-t border-slate-100">
        {need.type === 'mentor' ? (
          <Link
            href="/volunteer/apply"
            className="w-full py-2 text-center text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center justify-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            Volunteer for this Need
          </Link>
        ) : need.type === 'laptop' || need.type === 'desktop' || need.type === 'tablet' ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/donate-device"
              className="py-2 text-center text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1"
            >
              <Laptop className="w-3.5 h-3.5" />
              Donate Device
            </Link>
            <button
              onClick={() => onFulfillClick && onFulfillClick(need)}
              className="py-2 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
            >
              Fund Refurbish
            </button>
          </div>
        ) : (
          <button
            onClick={() => onFulfillClick && onFulfillClick(need)}
            className="w-full py-2 text-center text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Help Fulfill This Need
          </button>
        )}
      </div>
    </div>
  );
};
