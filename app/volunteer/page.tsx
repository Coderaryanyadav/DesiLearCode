import React from 'react';
import Link from 'next/link';
import { getActiveVolunteerOpportunities } from '@/lib/db/volunteers';
import { 
  Code, 
  ShieldCheck, 
  Clock, 
  Users, 
  Laptop, 
  ArrowRight, 
  CheckCircle2,
  Calendar,
  BookOpen,
  Terminal,
  Cpu
} from 'lucide-react';

export const metadata = {
  title: 'Engineering & STEM Mentorship — DesiLearCode',
  description: 'Volunteer technical skills to teach programming, computational logic, and digital literacy to student cohorts in verified learning centers.',
};

export default async function VolunteerLandingPage() {
  const volunteerOpportunities = await getActiveVolunteerOpportunities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Editorial Mission Hero */}
      <div className="bg-surface rounded-xl p-8 sm:p-12 border border-border space-y-6 tech-grid-pattern shadow-panel">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
            <span>TECHNICAL MENTORSHIP CHARTER • 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight leading-tight">
            Volunteer Your Engineering Skills.<br />
            <span className="text-primary-600">Mentor Grassroots Innovators.</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl">
            Dedicate 2 hours per week to guide young learners through structured visual block coding (Scratch), introductory Python, and foundational computing logic. All sessions use pre-approved offline curricula.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/volunteer/apply"
              className="px-5 py-2.5 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors flex items-center gap-2"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Submit Mentor Application</span>
            </Link>
            <a
              href="#opportunities"
              className="px-4 py-2.5 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground font-medium text-xs transition-colors border border-border"
            >
              View Active Cohorts
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border text-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">2 Hours / Weekend</strong>
              <span className="text-muted text-[11px]">Structured modules with lab coordinator support.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">Ready-to-Teach Syllabus</strong>
              <span className="text-muted text-[11px]">Scratch 3.0, Python 3, and basic Web dev guides.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">Safeguarding Supervised</strong>
              <span className="text-muted text-[11px]">Zero-PII compliance in monitored lab settings.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Tracks */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-primary-600 uppercase">Syllabus Framework</span>
          <h2 className="text-lg font-bold text-foreground">Standardized Learning Tracks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <div className="text-[10px] font-mono font-bold text-primary-600">TRACK 01</div>
            <h3 className="font-bold text-sm text-foreground">Visual Logic & Scratch</h3>
            <p className="text-xs text-muted leading-relaxed">
              Loops, conditional branching, game design, and algorithmic problem-solving for first-time learners.
            </p>
          </div>

          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <div className="text-[10px] font-mono font-bold text-success-600">TRACK 02</div>
            <h3 className="font-bold text-sm text-foreground">Python Fundamentals</h3>
            <p className="text-xs text-muted leading-relaxed">
              Variables, functions, simple data structures, and text-based mathematical scripts.
            </p>
          </div>

          <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
            <div className="text-[10px] font-mono font-bold text-accent-600">TRACK 03</div>
            <h3 className="font-bold text-sm text-foreground">Web Basics & Hardware STEM</h3>
            <p className="text-xs text-muted leading-relaxed">
              HTML/CSS structure and basic micro-controller interactions (Raspberry Pi / Arduino).
            </p>
          </div>
        </div>
      </div>

      {/* Active Openings Section */}
      <div id="opportunities" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-muted uppercase">Active Cohorts</span>
            <h2 className="text-lg font-bold text-foreground">Open Mentorship Opportunities</h2>
          </div>
          <Link href="/volunteer/apply" className="text-xs font-mono text-primary-600 hover:underline">
            GENERAL APPLICATION &rarr;
          </Link>
        </div>

        {volunteerOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteerOpportunities.map((opp) => (
              <div key={opp.id} className="bg-surface rounded-xl p-5 border border-border flex flex-col justify-between space-y-4 hover:border-borderMuted hover:shadow-subtle transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-muted">{opp.organizationName}</span>
                    <span className="font-mono text-[10px] bg-surfaceSubtle px-2 py-0.5 rounded border border-border uppercase">
                      {opp.mode}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground">{opp.roleTitle}</h3>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">{opp.description}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {opp.skillsRequired.map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surfaceSubtle text-foreground border border-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted font-mono text-[11px]">{opp.hoursPerWeek} hrs/week • {opp.durationWeeks} wks</span>
                  <Link
                    href={`/volunteer/apply?opp=${opp.id}`}
                    className="py-1.5 px-3 rounded bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs transition-colors"
                  >
                    Apply for Role
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface rounded-xl border border-border text-center space-y-2">
            <h3 className="font-bold text-sm text-foreground">General Mentor Intake Active</h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              Submit your engineering profile to be matched with upcoming verified lab workshop cohorts.
            </p>
            <div className="pt-2">
              <Link
                href="/volunteer/apply"
                className="inline-block px-4 py-2 rounded bg-foreground text-surface text-xs font-medium hover:bg-foreground/90 transition-colors"
              >
                Submit General Application
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
