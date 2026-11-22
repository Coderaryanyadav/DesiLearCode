import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { 
  Laptop, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Compass, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  FileCode, 
  Terminal, 
  Cpu, 
  BookOpen, 
  Building2 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About DesiLearCode — Open Technology & STEM Infrastructure',
  description: 'Learn how DesiLearCode coordinates refurbished hardware logistics, software engineering mentors, and zero-PII learning labs across India.',
  keywords: [
    'about desilearncode',
    'stem education india',
    'laptop donation non-profit',
    'refurbished laptops for schools',
    'volunteer coding mentors',
    'child digital safeguarding',
    'zero-pii education platform',
    'verified grassroots ngos',
    'nist-sp-800-88 sanitization',
    'digital literacy'
  ],
};

const FOCUS_TAGS = [
  { label: '#RefurbishedHardware', desc: 'Securely wiped laptops & learning kits' },
  { label: '#STEMEducation', desc: 'Practical programming & digital literacy' },
  { label: '#ZeroPIISafeguarding', desc: 'Protecting minor identity & dignity' },
  { label: '#NISTSanitization', desc: 'NIST SP 800-88 standard drive wiping' },
  { label: '#GrassrootsNGOs', desc: 'Verified on-ground educational partners' },
  { label: '#VolunteerMentors', desc: 'Engineers mentoring young coders' },
  { label: '#ItemizedNeeds', desc: 'Zero ambiguous charity pools' },
  { label: '#AppendOnlyAudit', desc: 'Transparent cryptographic audit ledger' },
  { label: '#DigitalInclusion', desc: 'Reaching under-resourced Indian regions' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surfaceSubtle border border-border text-xs text-muted">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          <span>About DesiLearCode</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight">
          Connecting technology with educational opportunity
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          DesiLearCode coordinates resources, volunteers, and grassroots organizations across India to build functional, sustainable computer learning labs.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/projects"
            className="px-4 py-2 rounded-lg bg-foreground text-surface text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <span>Explore Initiatives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/donate-device"
            className="px-4 py-2 rounded-lg bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surfaceSubtle transition-colors flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5 text-primary-600" />
            <span>Donate Hardware</span>
          </Link>
          <Link
            href="/volunteer"
            className="px-4 py-2 rounded-lg bg-surface border border-border text-foreground text-xs font-semibold hover:bg-surfaceSubtle transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-success-600" />
            <span>Become a Mentor</span>
          </Link>
        </div>
      </div>

      {/* PLATFORM TOPICS & CORE TAGS */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 font-mono">
            Platform Focus & Architecture Tags
          </h2>
        </div>
        <p className="text-xs text-muted leading-relaxed max-w-2xl">
          Core thematic pillars and operational tags defining our verified hardware pipeline, curriculum, and governance:
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          {FOCUS_TAGS.map((tag) => (
            <div
              key={tag.label}
              className="group p-2.5 rounded-lg bg-surfaceSubtle hover:bg-surface border border-border hover:border-primary-500/40 transition-all flex flex-col gap-0.5 text-left"
            >
              <span className="text-xs font-mono font-bold text-foreground group-hover:text-primary-600 transition-colors">
                {tag.label}
              </span>
              <span className="text-[11px] text-muted">
                {tag.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 1. WHY DESILEARCODE EXISTS */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 font-mono">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 font-mono">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600">
              <Laptop className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground">1. Device Refurbishment</h4>
            <p className="text-muted leading-relaxed">
              We intake unused computers, sanitize storage drives aligned with NIST SP 800-88 guidance, install lightweight educational Linux, and prepare them for classroom use.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground">2. Itemized Matching</h4>
            <p className="text-muted leading-relaxed">
              Rather than sending unsorted hardware, we match specific equipment and funds directly with itemized requirements in verified projects.
            </p>
          </div>
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-foreground">3. Mentor Coordination</h4>
            <p className="text-muted leading-relaxed">
              We connect software developers and engineers with student cohorts for weekly coding logic and foundational programming mentorship.
            </p>
          </div>
        </div>
      </div>

      {/* 3. WHO WE WORK WITH */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 font-mono">
          Who We Work With
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-surfaceSubtle rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-muted" />
              <span>Donors & Enterprises</span>
            </h4>
            <p className="text-muted leading-relaxed">
              Individuals and corporate organizations who ensure retired tech assets directly empower learners with transparent chain-of-custody tracking.
            </p>
          </div>
          <div className="p-5 bg-surfaceSubtle rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-muted" />
              <span>Technical Volunteers</span>
            </h4>
            <p className="text-muted leading-relaxed">
              Engineers and tech educators who commit weekly sessions to guide young learners through Python, Scratch, web basics, and digital literacy.
            </p>
          </div>
          <div className="p-5 bg-surfaceSubtle rounded-xl border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-muted" />
              <span>Grassroots Nonprofits</span>
            </h4>
            <p className="text-muted leading-relaxed">
              Reviewed community centers, shelter schools, and educational trusts that provide safe, structured classroom environments.
            </p>
          </div>
        </div>
      </div>

      {/* 4. OUR PRINCIPLES */}
      <div className="bg-surfaceSubtle rounded-2xl border border-border p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
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
