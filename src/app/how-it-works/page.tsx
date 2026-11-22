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
  ArrowRight,
  Truck,
  FileCheck,
  Coins,
  Search,
  Layers
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Give',
      subtitle: 'Contribute a device, funding, or skills',
      icon: Laptop,
      content: 'You contribute an unused laptop, fund an itemized project requirement (like RAM, batteries, or Wi-Fi), or sign up to volunteer 2 hours per week as a coding mentor.'
    },
    {
      number: '02',
      title: 'Verify',
      subtitle: 'Inspect hardware & review non-profits',
      icon: ShieldCheck,
      content: 'Hardware storage drives undergo data sanitization aligned with NIST SP 800-88 guidance, thermals are cleaned, and educational software is installed. Partner organizations are reviewed for legal registration and classroom safety.'
    },
    {
      number: '03',
      title: 'Match',
      subtitle: 'Connect resource with verified need',
      icon: Layers,
      content: 'Rather than shipping arbitrary equipment piles, DesiLearCode matches your contribution directly to an itemized requirement in a verified educational lab.'
    },
    {
      number: '04',
      title: 'Deliver',
      subtitle: 'Arrival & classroom setup',
      icon: Truck,
      content: 'The hardware or materials reach the learning center and are set up for scheduled student classes under the supervision of the local center coordinator.'
    },
    {
      number: '05',
      title: 'Report',
      subtitle: 'Visible milestones & child privacy',
      icon: CheckCircle2,
      content: 'Partner centers share verified progress updates and curriculum milestones. All public records adhere to strict Zero-PII child privacy rules.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surfaceSubtle border border-border text-xs text-muted">
          <span>How It Works</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight">
          How contributions reach the classroom
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          A clear, accountable five-step journey from your initial contribution to verified student outcomes in learning centers across India.
        </p>
      </div>

      {/* 5-Step Process Timeline */}
      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-6 bg-surface rounded-xl border border-border space-y-3 hover:border-borderMuted hover:shadow-subtle transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-surfaceSubtle border border-border flex items-center justify-center font-bold text-xs text-primary-600">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {step.title} — <span className="text-muted font-normal text-xs">{step.subtitle}</span>
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed sm:pl-11">
                {step.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Key Accountability Guarantees */}
      <div className="bg-surfaceSubtle rounded-2xl border border-border p-5 sm:p-8 space-y-6">
        <h2 className="font-display font-bold text-xl text-foreground">
          Our core commitments to donors & organizations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Lock className="w-4 h-4 text-primary-600" />
              <span>Safe Data Sanitization</span>
            </div>
            <p className="text-muted leading-relaxed">
              Storage erasure performed aligned with NIST SP 800-88 guidance to permanently remove all donor data before re-imaging.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>Zero-PII Child Safeguarding</span>
            </div>
            <p className="text-muted leading-relaxed">
              No individual child names, identifiable facial photos, or private shelter coordinates are ever published publicly.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">
          Ready to get involved?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/donate-device"
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-foreground text-surface font-semibold text-xs hover:bg-foreground/90 transition-colors shadow-subtle flex items-center justify-center"
          >
            Donate a Device
          </Link>
          <Link
            href="/projects"
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs hover:bg-surfaceSubtle transition-colors flex items-center justify-center"
          >
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Safeguarding Banner */}
      <SafeguardingBanner />

    </div>
  );
}
