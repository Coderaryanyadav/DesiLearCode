'use client';

import React from 'react';
import Link from 'next/link';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { Laptop, HeartHandshake, ShieldCheck, Sparkles, Target, Compass, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Editorial Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>INSTITUTIONAL CHARTER • 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Technology Infrastructure for Social Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          DesiLearCode operates open logistics and educational frameworks across India. We route refurbished corporate computing hardware, deploy offline coding curricula, and coordinate verified engineering mentors for grassroots student cohorts.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl p-6 border border-border space-y-3 shadow-panel">
          <div className="w-9 h-9 rounded-md bg-surfaceSubtle text-primary-600 flex items-center justify-center border border-border">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">Operational Mission</h2>
          <p className="text-xs text-muted leading-relaxed">
            To connect individuals, software engineers, and enterprise technology donors directly with vetted non-profits and learning centers, equipping classrooms with sanitized hardware, structured coding syllabi, and verified milestone governance.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-3 shadow-panel">
          <div className="w-9 h-9 rounded-md bg-surfaceSubtle text-success-600 flex items-center justify-center border border-border">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">Engineering Philosophy</h2>
          <p className="text-xs text-muted leading-relaxed">
            A future where institutional care is not a barrier to digital capability, where young minds are active creators of technology—empowered with computational logic, Python, and open-source tools to pursue modern vocations.
          </p>
        </div>
      </div>

      {/* Core Operational Principles */}
      <div className="bg-[#090c10] text-[#8b949e] rounded-xl p-6 sm:p-8 border border-[#21262d] space-y-6 font-mono text-xs shadow-panel">
        <h2 className="text-base font-bold text-white font-sans">
          Non-Negotiable Operating Standards
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
            <strong className="text-white text-xs font-bold font-sans block">1. Traceability Over Hype</strong>
            <p className="text-[11px] text-[#8b949e] font-sans">Zero vague charity claims. Every initiative is backed by specific hardware counts and milestone schedules.</p>
          </div>

          <div className="p-3.5 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
            <strong className="text-white text-xs font-bold font-sans block">2. Zero-PII Child Privacy</strong>
            <p className="text-[11px] text-[#8b949e] font-sans">We never expose children&apos;s identities, faces, or shelter coordinates for marketing or emotional appeals.</p>
          </div>

          <div className="p-3.5 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
            <strong className="text-white text-xs font-bold font-sans block">3. Verified Non-Profits Only</strong>
            <p className="text-[11px] text-[#8b949e] font-sans">Strict statutory audits of 80G/12A trust deeds and physical facilities prior to project publishing.</p>
          </div>

          <div className="p-3.5 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
            <strong className="text-white text-xs font-bold font-sans block">4. Mentorship Alongside Hardware</strong>
            <p className="text-[11px] text-[#8b949e] font-sans">Hardware without instructors sits idle. We pair every device with structured weekend coding workshops.</p>
          </div>

          <div className="p-3.5 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
            <strong className="text-white text-xs font-bold font-sans block">5. Circular Electronics Economy</strong>
            <p className="text-[11px] text-[#8b949e] font-sans">Extending the lifespan of working laptops through professional refurbishment and NIST data sanitization.</p>
          </div>

          <div className="p-3.5 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
            <strong className="text-white text-xs font-bold font-sans block">6. Open & Auditable</strong>
            <p className="text-[11px] text-[#8b949e] font-sans">Transparent donation intents and public immutable tracking codes (#DL-XXXX) for all hardware donations.</p>
          </div>
        </div>
      </div>

      {/* Safeguarding */}
      <SafeguardingBanner />

    </div>
  );
}
