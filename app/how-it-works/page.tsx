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
  Coins,
  Search,
  FileCheck,
  Cpu,
  Layers
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      stage: 'STAGE 01',
      title: 'Resource Contribution',
      subtitle: 'Devices, funding, or mentorship time',
      icon: Laptop,
      content: 'Individuals and companies have functional unused laptops, desktops, or tablets sitting idle. Engineers have coding skills to share. Donors can also fund itemized hardware components (RAM, SSDs, Wi-Fi routers).',
      tag: 'Input: Community Resources'
    },
    {
      stage: 'STAGE 02',
      title: 'Standardized Submission',
      subtitle: 'Intake wizard & cryptographic tracking identifier',
      icon: FileCheck,
      content: 'Contributors submit hardware specs, volunteer availability, or project funding intent. An unguessable, high-entropy tracking reference (e.g. #DLC-XXXX-XXXX) is generated via CSPRNG for transparent public telemetry.',
      tag: 'Tracking: #DLC-XXXX-XXXX'
    },
    {
      stage: 'STAGE 03',
      title: 'Rigorous Verification',
      subtitle: 'NIST SP 800-88 guidance sanitization & statutory NGO vetting',
      icon: ShieldCheck,
      content: 'Hardware storage drives undergo complete data sanitization aligned with NIST SP 800-88 guidance, thermals are serviced, and lightweight Linux OS is deployed. Non-profit partners must pass statutory checks, classroom electrical safety checks, and child protection officer verification.',
      tag: 'Security: Zero Donor Data'
    },
    {
      stage: 'STAGE 04',
      title: 'Precision Matching',
      subtitle: 'Pairing verified resources with itemized project needs',
      icon: Layers,
      content: 'Instead of shipping arbitrary piles of e-waste to unprepared centers, DesiLearCode matches hardware directly to itemized project requirements (e.g. "12 laptops for Darbhanga middle school coding batch").',
      tag: 'Coordination: Itemized Allocation'
    },
    {
      stage: 'STAGE 05',
      title: 'Secure Delivery & Setup',
      subtitle: 'Doorstep transit & classroom deployment',
      icon: Truck,
      content: 'Refurbished assets and pre-imaged curriculum suites (Scratch 3, Python 3, Kiwix offline library) are delivered directly to the vetted learning center. Physical receipt is recorded in the immutable audit log.',
      tag: 'Logistics: Classroom Receipt'
    },
    {
      stage: 'STAGE 06',
      title: 'Audited Project Updates',
      subtitle: 'Structured progress reports with child safeguarding checks',
      icon: Wrench,
      content: 'Partner centers publish regular updates tracking curriculum progress, student attendance, and hardware maintenance. All updates pass automated PII scans and safeguarding checks before publication.',
      tag: 'Integrity: Safeguarded Feeds'
    },
    {
      stage: 'STAGE 07',
      title: 'Verified Public Impact',
      subtitle: 'Aggregated learning metrics with zero child PII exposure',
      icon: BarChart3,
      content: 'Impact is derived from actual classroom logs: students trained, active terminals, and mentor hours completed. No individual child identities, faces, or private locations are ever exposed.',
      tag: 'Outcome: Open Audit Ledger'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>THE DESILEARCODE OPERATING SYSTEM</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight">
          How DesiLearCode Moves Resources from Donor to Verified Classroom
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          We replace vague charitable appeals with a transparent, 7-stage technology infrastructure: itemized intake, data sanitization, non-profit vetting, direct matching, and verified public impact.
        </p>
      </div>

      {/* 7-Stage Visual Pipeline */}
      <div className="space-y-4">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-surface rounded-xl border border-border p-6 flex flex-col md:flex-row gap-6 items-start shadow-subtle hover:border-borderMuted transition-all">
              
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-muted/30 font-mono">
                  0{idx + 1}
                </span>
                <div className="w-10 h-10 rounded-lg bg-surfaceSubtle text-primary-600 flex items-center justify-center border border-border">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <span className="text-xs text-muted font-mono hidden sm:inline">— {item.subtitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {item.content}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Technical Refurbishment Standard */}
      <div className="bg-[#090c10] text-[#8b949e] rounded-xl p-6 sm:p-8 border border-[#21262d] space-y-6 font-mono text-xs shadow-panel">
        <div className="max-w-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            Technical Standards
          </span>
          <h2 className="text-base sm:text-xl font-bold text-white font-sans">
            Refurbishment & Data Sanitization Protocol
          </h2>
          <p className="text-xs text-[#8b949e] font-sans">
            Every donated device is treated as mission-critical learning hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {[
            { 
              title: 'NIST SP 800-88 Sanitization', 
              desc: 'Storage drives undergo cryptographic erasure or multi-pass overwrite aligned with NIST SP 800-88 guidance. Zero donor personal data is preserved.' 
            },
            { 
              title: 'Thermals & Diagnostic Bench', 
              desc: 'Fans cleaned, thermal compound renewed, keyboard and battery health tested under load.' 
            },
            { 
              title: 'Lightweight Educational OS', 
              desc: 'Configured with lightweight Linux / ChromeOS Flex for smooth performance on older hardware.' 
            },
            { 
              title: 'Offline Curriculum Suite', 
              desc: 'Preloaded with Scratch 3, Python 3 IDE, VS Code OSS, and Kiwix offline encyclopedias for zero-internet classrooms.' 
            },
            { 
              title: 'Statutory NGO Audit', 
              desc: 'Physical electrical surge protection, locked classroom security, and verified Child Safeguarding Officer assignment.' 
            },
            { 
              title: 'High-Entropy Asset Telemetry', 
              desc: 'Each unit is tagged with a CSPRNG identifier (#DLC-XXXX-XXXX) for public logistics tracking without leaking donor PII.' 
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[#0d1117] border border-[#21262d] space-y-1.5">
              <strong className="text-xs font-bold text-white block font-sans">{item.title}</strong>
              <p className="text-[11px] text-[#8b949e] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA array */}
      <div className="p-8 bg-surface rounded-xl border border-border text-center space-y-4">
        <h3 className="font-display font-bold text-xl text-foreground">
          Ready to put unused resources to work?
        </h3>
        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
          Whether you have an idle laptop, professional coding skills to share, or funding for a learning center, your contribution is tracked with full accountability.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/donate-device"
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <Laptop className="w-4 h-4 text-primary-400" />
            <span>Donate a Device</span>
          </Link>
          <Link
            href="/projects"
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Active Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/volunteer"
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Code className="w-4 h-4 text-primary-600" />
            <span>Volunteer as Mentor</span>
          </Link>
        </div>
      </div>

      {/* Safeguarding notice */}
      <SafeguardingBanner />

    </div>
  );
}
