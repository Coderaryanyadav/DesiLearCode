'use client';

import React from 'react';
import Link from 'next/link';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { Laptop, HeartHandshake, ShieldCheck, Sparkles, Target, Compass, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Mission & Vision
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          About DesiLearCode
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We believe technology is the great equalizer. Our mission is to ensure every vulnerable and orphaned child has access to computing tools, digital literacy, and inspiring mentors.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To connect individuals, software engineers, and companies with verified non-profits and childcare institutions, equipping classrooms with refurbished hardware, structured coding curricula, and continuous technical mentorship.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Guiding Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A future where institutional care is not a barrier to digital capability, where young minds are producers of technology—not just passive observers—with opportunities to pursue careers in engineering, science, and digital vocations.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <h2 className="text-2xl font-extrabold text-center tracking-tight">
          Our Non-Negotiable Core Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white text-sm font-bold block">1. Trust Over Hype</strong>
            <p className="text-slate-400">Zero vague claims. Every initiative is backed by specific hardware counts and milestone schedules.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white text-sm font-bold block">2. Privacy Over Publicity</strong>
            <p className="text-slate-400">We never exploit children&apos;s identities for marketing or emotional appeals. Zero PII strictly enforced.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white text-sm font-bold block">3. Verified Non-Profits Only</strong>
            <p className="text-slate-400">Strict statutory audits of 80G/12A trust deeds and physical facilities prior to project publishing.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white text-sm font-bold block">4. Skills Alongside Hardware</strong>
            <p className="text-slate-400">Devices without mentors gather dust. We pair every computer with structured workshop hours.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white text-sm font-bold block">5. Circular Electronics Economy</strong>
            <p className="text-slate-400">Extending the lifespan of working laptops through professional refurbishment and data wiping.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white text-sm font-bold block">6. Open & Auditable</strong>
            <p className="text-slate-400">Transparent donation intents and public immutable tracking codes for all hardware donations.</p>
          </div>
        </div>
      </div>

      {/* Safeguarding */}
      <SafeguardingBanner />

    </div>
  );
}
