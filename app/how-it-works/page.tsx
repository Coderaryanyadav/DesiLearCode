'use client';

import React from 'react';
import Link from 'next/link';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { 
  Building2, 
  ShieldCheck, 
  Laptop, 
  Code, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ArrowRight,
  Truck,
  Wrench,
  BarChart3,
  Terminal,
  Cpu
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>OPERATIONAL ARCHITECTURE & TRACEABILITY</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          How DesiLearCode Routes Technology to Grassroots Labs
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Open infrastructure designed to replace vague fundraising with verifiable, itemized hardware intake, cryptographic drive sanitization, and mentored STEM education.
        </p>
      </div>

      {/* 5-Step Process Deep Dive */}
      <div className="space-y-4">
        {[
          {
            step: '01',
            title: 'Itemized Lab Assessment',
            subtitle: 'Organizations specify concrete equipment & workshop counts',
            icon: Building2,
            content: 'Grassroots learning centers and shelter schools submit itemized requirements: e.g. 8 laptops for a middle-school coding lab, 2 weekend Python mentors, or router funding. Vague, unitemized appeals are strictly rejected.'
          },
          {
            step: '02',
            title: 'Statutory Verification & Physical Lab Audit',
            subtitle: 'Legal and facility vetting prior to public listing',
            icon: ShieldCheck,
            content: 'Our compliance team checks government non-profit deeds, 80G/12A tax exemption filings, surge-protected electrical safety in classrooms, and designated Child Protection Officer assignments.'
          },
          {
            step: '03',
            title: 'Targeted Hardware & Skill Pledging',
            subtitle: 'Direct hardware contributions and engineer mentorship',
            icon: Sparkles,
            content: 'Individuals and engineering teams choose their participation: pledge idle company laptops, volunteer 2 hours/week to mentor visual block programming, or sponsor specific peripheral components.'
          },
          {
            step: '04',
            title: 'NIST Sanitization & Educational Provisioning',
            subtitle: 'Cryptographic data erasure, Linux OS deployment & #DL tracking codes',
            icon: Wrench,
            content: 'Hardware intake undergoes multi-pass NIST 800-88 sanitization, thermal testing, SSD upgrades, and installation of curated offline curriculum suites (Scratch 3, Python 3, Kiwix offline library).'
          },
          {
            step: '05',
            title: 'Verifiable Milestone Ledgers (Zero-PII)',
            subtitle: 'Measurable learning outcomes without exposing vulnerable children',
            icon: BarChart3,
            content: 'Partner centers publish structured milestone completion reports tracking workshop hours and active terminals. Individual child identities, faces, or shelter coordinates are never exposed.'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-surface rounded-xl border border-border p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-muted/30 font-mono">
                  {item.step}
                </span>
                <div className="w-9 h-9 rounded-md bg-surfaceSubtle text-primary-600 flex items-center justify-center border border-border">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <span className="text-xs text-muted font-mono">— {item.subtitle}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technical Refurbishment Standard Showcase */}
      <div className="bg-[#090c10] text-[#8b949e] rounded-xl p-6 sm:p-8 border border-[#21262d] space-y-5 font-mono text-xs shadow-panel">
        <div className="max-w-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            Hardware Lifecycle Standard
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white font-sans">
            6-Point Technical Refurbishment Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {[
            { title: '1. NIST 800-88 Sanitization', desc: 'Multi-pass cryptographic drive wiping guarantees zero remnant donor data.' },
            { title: '2. Thermals & Battery Diagnostic', desc: 'Bench-tested for battery health, cooling fans cleaned, and thermal paste renewed.' },
            { title: '3. Educational Linux Image', desc: 'Configured with Ubuntu LTS / tailored educational Linux desktop environment.' },
            { title: '4. Offline Learning Suite', desc: 'Preloaded with Scratch 3, Python 3 IDE, Kiwix encyclopedias, and typing tutors.' },
            { title: '5. Restricted Safe Profile', desc: 'Standard non-admin learner profiles with DNS-level content filtering.' },
            { title: '6. Immutable Asset ID', desc: 'Tracked via barcode tag (#DL-XXXX) through field delivery and active lab hours.' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-md bg-[#0d1117] border border-[#21262d] space-y-1">
              <strong className="text-xs font-bold text-white block font-sans">{item.title}</strong>
              <p className="text-[11px] text-[#8b949e] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safeguarding notice */}
      <SafeguardingBanner />

    </div>
  );
}
