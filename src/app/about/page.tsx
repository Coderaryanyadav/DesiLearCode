'use client';

import React from 'react';
import Link from 'next/link';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { Laptop, HeartHandshake, ShieldCheck, Sparkles, Target, Compass, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surfaceSubtle border border-border text-xs text-muted">
          <span>About DesiLearCode</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight">
          Connecting technology with educational opportunity
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          DesiLearCode coordinates resources, volunteers, and grassroots organizations across India to build functional, sustainable computer learning labs.
        </p>
      </div>

      {/* 1. WHY DESILEARCODE EXISTS */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
          Why DesiLearCode Exists
        </h2>
        <h3 className="text-2xl font-display font-bold text-foreground">
          The digital divide is often an equipment & coordination problem.
        </h3>
        <p className="text-sm text-muted leading-relaxed max-w-3xl">
          Across urban centers in India, millions of functional laptops and computers are retired each year and left unused in closets or IT storage. At the same time, rural schools, community centers, and shelter homes lack basic computing hardware to teach foundational digital literacy and coding.
        </p>
        <p className="text-sm text-muted leading-relaxed max-w-3xl">
          DesiLearCode exists to bridge this gap by providing verified logistics, data sanitization, need pairing, and transparent milestone tracking.
        </p>
      </div>

      {/* 2. WHAT WE DO */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground">1. Device Refurbishment</h4>
            <p className="text-muted leading-relaxed">
              We intake unused computers, sanitize storage drives aligned with NIST SP 800-88 guidance, install lightweight educational Linux, and prepare them for classroom use.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground">2. Itemized Matching</h4>
            <p className="text-muted leading-relaxed">
              Rather than sending unsorted hardware, we match specific equipment and funds directly with itemized requirements in verified projects.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground">3. Mentor Coordination</h4>
            <p className="text-muted leading-relaxed">
              We connect software developers and engineers with student cohorts for weekly coding logic and foundational programming mentorship.
            </p>
          </div>
        </div>
      </div>

      {/* 3. WHO WE WORK WITH */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600">
          Who We Work With
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-surfaceSubtle rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground">Individual & Corporate Donors</h4>
            <p className="text-muted leading-relaxed">
              People and organizations who want to ensure their unused laptops and funding directly create verified educational impact.
            </p>
          </div>
          <div className="p-5 bg-surfaceSubtle rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground">Technical Volunteers</h4>
            <p className="text-muted leading-relaxed">
              Engineers and tech educators who donate 2 hours per week to guide young learners through Scratch, Python, and digital literacy.
            </p>
          </div>
          <div className="p-5 bg-surfaceSubtle rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground">Grassroots Nonprofits</h4>
            <p className="text-muted leading-relaxed">
              Reviewed community centers, shelter schools, and educational trusts that provide safe classroom environments for students.
            </p>
          </div>
        </div>
      </div>

      {/* 4. OUR PRINCIPLES */}
      <div className="bg-surfaceSubtle rounded-2xl border border-border p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            Operating Standards
          </h2>
          <h3 className="font-display font-bold text-xl text-foreground">
            Our Core Principles
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>Zero-PII Child Privacy</span>
            </div>
            <p className="text-muted leading-relaxed">
              We never publish individual children&apos;s names, photos, or shelter coordinates for marketing or fundraising appeals.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span>Honest & Verified Data</span>
            </div>
            <p className="text-muted leading-relaxed">
              No simulated numbers or fake testimonials. All impact statistics reflect verified database records and published milestones.
            </p>
          </div>
        </div>
      </div>

      {/* Safeguarding Banner */}
      <SafeguardingBanner />

    </div>
  );
}
