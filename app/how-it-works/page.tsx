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
  FileText
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Transparent Operations
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          How DesiLearCode Connects Technology to Real Opportunity
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          A modern non-profit platform designed to replace vague fundraising with verifiable, itemized assistance, device refurbishments, and mentored digital education.
        </p>
      </div>

      {/* 5-Step Process Deep Dive */}
      <div className="space-y-8">
        {[
          {
            step: '01',
            title: 'Verified Needs Assessment',
            subtitle: 'Organizations identify tangible requirements',
            icon: Building2,
            content: 'Child-care institutions, foster homes, and community shelter schools submit detailed requests specifying exact requirements: e.g. 5 laptops for middle school coding, 2 volunteer mentors for weekend Scratch modules, or ₹12,000 for power backups. Unspecified blanket appeals are not permitted.'
          },
          {
            step: '02',
            title: 'Statutory Verification & Child Safeguarding',
            subtitle: 'Rigorous legal and physical checks before publishing',
            icon: ShieldCheck,
            content: 'Our compliance team checks government trust/society registrations, tax-exemption credentials (12A/80G in India or 501(c)(3) equivalents), and verifies that the institution has an active Child Safeguarding Officer and safe physical infrastructure.'
          },
          {
            step: '03',
            title: 'Targeted Community Participation',
            subtitle: 'Donors, volunteers, and supporters choose how to help',
            icon: Sparkles,
            content: 'Individuals and corporate teams choose their mode of contribution: donate working electronics, volunteer 2 hours a week as a programming mentor, or pledge monetary support towards a specific itemized need (like battery replacements or internet sponsorship).'
          },
          {
            step: '04',
            title: 'Hardware Refurbishing & Delivery Tracking',
            subtitle: 'DoD data wiping, educational OS installation & #TFK codes',
            icon: Wrench,
            content: 'Donated devices are collected, cryptographically wiped, upgraded with SSDs/fresh thermal paste, loaded with curated offline educational software (Scratch, Kiwix, GCompris, Python), and tracked through every stage of delivery via unique public tracking codes.'
          },
          {
            step: '05',
            title: 'Verifiable Impact Reports (Zero-PII)',
            subtitle: 'Measurable learning outcomes without exposing vulnerable children',
            icon: BarChart3,
            content: 'Partner organizations publish structured quarterly reports tracking workshop hours, skills acquired, and active terminals. Individual child identities and sensitive case files are never published.'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-200 font-mono">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <span className="text-xs font-semibold text-slate-500">— {item.subtitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Device Refurbishment Protocol Showcase */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            Hardware Lifecycle Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Our 6-Point Technical Refurbishment Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {[
            { title: '1. DoD 5220.22-M Wipe', desc: 'Complete multi-pass overwriting ensures zero remnant donor personal data.' },
            { title: '2. Battery & Thermals', desc: 'Bench tested for >80% health, dust cleaned, and thermal paste renewed.' },
            { title: '3. Educational OS Image', desc: 'Configured with Ubuntu LTS / tailored educational Linux environment.' },
            { title: '4. Offline Learning Suite', desc: 'Preloaded with Kiwix encyclopedias, Scratch 3, Typing Tutor, and Python IDE.' },
            { title: '5. Locked Child Profile', desc: 'Standard non-admin restricted profiles with DNS-level adult content blocking.' },
            { title: '6. End-to-End Tracking', desc: 'Public lifecycle code (#TFK-XXXX) updated when active in classroom.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <strong className="text-sm font-bold text-white block">{item.title}</strong>
              <p className="text-xs text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safeguarding notice */}
      <SafeguardingBanner />

    </div>
  );
}
