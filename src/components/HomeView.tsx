'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { FeaturedProjectCard, ProjectCard } from '@/components/ProjectCard';
import { DonationModal } from '@/components/DonationModal';
import { 
  Laptop, 
  Code, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Coins, 
  Building2, 
  Lock, 
  Clock, 
  FileCheck, 
  ArrowDown,
  Sparkles,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

interface HomeViewProps {
  featuredProjects: Project[];
  metrics: {
    verifiedOrgsCount: number;
    activeProjectsCount: number;
    devicesReceivedCount: number;
    volunteersCount: number;
    studentsReachedEstimate: number;
  };
}

export const HomeView: React.FC<HomeViewProps> = ({ featuredProjects, metrics }) => {
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<Project | null>(null);

  const primaryProject = featuredProjects.length > 0 ? featuredProjects[0] : null;
  const secondaryProjects = featuredProjects.length > 1 ? featuredProjects.slice(1, 4) : [];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      
      {/* 1. HERO SECTION: CLEAR, HUMAN, AND INSTANTLY UNDERSTANDABLE */}
      <section className="relative pt-8 sm:pt-14 md:pt-20 pb-12 sm:pb-16 md:pb-24 border-b border-border bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Mission, Value Proposition & Actions */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surfaceSubtle border border-border text-xs text-muted">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                <span className="font-medium text-foreground">Resource-to-Impact Platform</span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-tight">
                Turn unused technology into real learning opportunities.
              </h1>

              <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
                DesiLearCode connects devices, funding and technical skills with verified educational projects across India — making the journey from contribution to outcome completely visible.
              </p>

              {/* Primary & Secondary Actions (Thumb-friendly on mobile) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/projects"
                  className="min-h-[48px] px-6 py-3.5 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-subtle touch-target"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4 text-primary-400" />
                </Link>
                <Link
                  href="/donate-device"
                  className="min-h-[48px] px-6 py-3.5 rounded-lg bg-surface border border-border hover:bg-surfaceSubtle text-foreground font-semibold text-sm transition-colors flex items-center justify-center gap-2 touch-target"
                >
                  <Laptop className="w-4 h-4 text-primary-600" />
                  <span>Donate a Device</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-5 border-t border-border grid grid-cols-3 gap-2 sm:gap-4 text-xs text-muted">
                <div>
                  <span className="block font-semibold text-foreground text-xs sm:text-sm">Verified Nonprofits</span>
                  <span className="text-[11px]">Reviewed before listing</span>
                </div>
                <div>
                  <span className="block font-semibold text-foreground text-xs sm:text-sm">Safe Sanitization</span>
                  <span className="text-[11px]">NIST SP 800-88 guidance</span>
                </div>
                <div>
                  <span className="block font-semibold text-foreground text-xs sm:text-sm">Child Privacy</span>
                  <span className="text-[11px]">Zero-PII safeguarding</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Journey Flow (Vertical stack on mobile) */}
            <div className="lg:col-span-5">
              <div className="bg-surfaceSubtle rounded-2xl border border-border p-5 sm:p-7 space-y-4 shadow-panel">
                <div className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider">
                  The Connection Journey
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Step 1: Origin */}
                  <div className="p-3.5 bg-surface rounded-xl border border-border flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-primary-600 uppercase">You Have</div>
                      <div className="font-bold text-foreground text-xs">Laptop · Funding · Tech Skills</div>
                      <div className="text-muted text-[11px] mt-0.5">Idle devices or weekly mentoring hours.</div>
                    </div>
                  </div>

                  {/* Vertical Arrow */}
                  <div className="flex items-center justify-center gap-1.5 py-0.5 text-muted text-[11px] font-mono">
                    <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                    <span>DesiLearCode: Verify + Match</span>
                  </div>

                  {/* Step 2: Project Destination */}
                  <div className="p-3.5 bg-surface rounded-xl border border-border flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success-50 text-success-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-success-700 uppercase">Real Project</div>
                      <div className="font-bold text-foreground text-xs">Verified Learning Center</div>
                      <div className="text-muted text-[11px] mt-0.5">Grassroots computer lab in Darbhanga, Pune, or rural hub.</div>
                    </div>
                  </div>

                  {/* Vertical Arrow */}
                  <div className="flex items-center justify-center gap-1.5 py-0.5 text-muted text-[11px] font-mono">
                    <ArrowDown className="w-3.5 h-3.5 text-success-600" />
                    <span>Classroom Deployment</span>
                  </div>

                  {/* Step 3: Real Outcome */}
                  <div className="p-3.5 bg-surface rounded-xl border border-border flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-accent-700 uppercase">Real Outcome</div>
                      <div className="font-bold text-foreground text-xs">Students Learn to Code</div>
                      <div className="text-muted text-[11px] mt-0.5">60+ students gain foundational computing literacy.</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span>Transparent tracking</span>
                  <Link href="/how-it-works" className="text-primary-600 hover:underline font-medium">
                    Learn how it works &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT CAN YOU GIVE? (3 TANGIBLE PATHWAYS) */}
      <section className="py-12 sm:py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Contribution Options
            </span>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-foreground">
              What can you give?
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Choose how you would like to help. Every contribution connects directly to an active, verified educational need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Channel 1: Give a Device */}
            <div className="p-5 sm:p-6 bg-surface rounded-xl border border-border flex flex-col justify-between space-y-5 hover:border-borderMuted hover:shadow-panel transition-all">
              <div className="space-y-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surfaceSubtle border border-border flex items-center justify-center text-primary-600">
                  <Laptop className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                    Give a device
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                    Have an unused laptop, desktop or tablet? Give it a second life in a learning environment. We inspect, wipe and prepare it for classroom use.
                  </p>
                </div>
              </div>

              <Link
                href="/donate-device"
                className="w-full py-3 px-4 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-subtle touch-target"
              >
                <span>Donate a device</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>

            {/* Channel 2: Fund a Need */}
            <div className="p-5 sm:p-6 bg-surface rounded-xl border border-border flex flex-col justify-between space-y-5 hover:border-borderMuted hover:shadow-panel transition-all">
              <div className="space-y-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surfaceSubtle border border-border flex items-center justify-center text-accent-600">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                    Fund a need
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                    Help complete a real educational project requirement such as Wi-Fi routers, replacement batteries, robotics kits, or lab power backups.
                  </p>
                </div>
              </div>

              <Link
                href="/projects"
                className="w-full py-3 px-4 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-subtle touch-target"
              >
                <span>Explore projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>

            {/* Channel 3: Give Your Skills */}
            <div className="p-5 sm:p-6 bg-surface rounded-xl border border-border flex flex-col justify-between space-y-5 hover:border-borderMuted hover:shadow-panel transition-all">
              <div className="space-y-3.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surfaceSubtle border border-border flex items-center justify-center text-success-600">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
                    Give your skills
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                    Teach, mentor, build, translate or help an educational organization with technology. Dedicate 2 hours weekly to guide a young student cohort.
                  </p>
                </div>
              </div>

              <Link
                href="/volunteer"
                className="w-full py-3 px-4 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-subtle touch-target"
              >
                <span>Volunteer as mentor</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (SIMPLE 5-STEP EDITORIAL TIMELINE) */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Operating Process
            </span>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-foreground">
              How it works
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              A transparent journey from initial contribution to verified classroom delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            
            {/* Step 1 */}
            <div className="space-y-2 p-4 rounded-xl bg-surfaceSubtle border border-border">
              <span className="text-xs font-mono font-bold text-primary-600">01 — Give</span>
              <h3 className="font-bold text-sm text-foreground">Contribute resources</h3>
              <p className="text-xs text-muted leading-relaxed">
                You contribute a device, money for a specific need, or your technical volunteer skills.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 p-4 rounded-xl bg-surfaceSubtle border border-border">
              <span className="text-xs font-mono font-bold text-primary-600">02 — Verify</span>
              <h3 className="font-bold text-sm text-foreground">Review & inspect</h3>
              <p className="text-xs text-muted leading-relaxed">
                Organizations, needs, and hardware undergo thorough functional and compliance review.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 p-4 rounded-xl bg-surfaceSubtle border border-border">
              <span className="text-xs font-mono font-bold text-primary-600">03 — Match</span>
              <h3 className="font-bold text-sm text-foreground">Connect to need</h3>
              <p className="text-xs text-muted leading-relaxed">
                Your contribution is paired with an itemized requirement in a verified educational project.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-2 p-4 rounded-xl bg-surfaceSubtle border border-border">
              <span className="text-xs font-mono font-bold text-primary-600">04 — Deliver</span>
              <h3 className="font-bold text-sm text-foreground">Classroom arrival</h3>
              <p className="text-xs text-muted leading-relaxed">
                The resource reaches the learning lab and is set up for scheduled student classes.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-2 p-4 rounded-xl bg-surfaceSubtle border border-border sm:col-span-2 md:col-span-1">
              <span className="text-xs font-mono font-bold text-success-700">05 — Report</span>
              <h3 className="font-bold text-sm text-foreground">Visible outcome</h3>
              <p className="text-xs text-muted leading-relaxed">
                Progress milestones and classroom impact are published transparently under child privacy rules.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PROJECTS THAT NEED HELP */}
      <section className="py-12 sm:py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Active Requirements
              </span>
              <h2 className="font-display font-bold text-xl sm:text-3xl text-foreground">
                Projects that need help
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Each project lists its exact equipment needs, secured units, and remaining gap.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-foreground hover:text-primary-600 flex items-center gap-1 shrink-0 touch-target py-2"
            >
              <span>View all projects &rarr;</span>
            </Link>
          </div>

          {/* Project Showcase */}
          {primaryProject ? (
            <div className="space-y-6">
              <FeaturedProjectCard
                project={primaryProject}
                onSupportClick={() => setSelectedProjectForDonation(primaryProject)}
              />

              {secondaryProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4">
                  {secondaryProjects.map(p => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      onSupportClick={() => setSelectedProjectForDonation(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 sm:p-12 bg-surface rounded-xl border border-border text-center space-y-3">
              <h3 className="font-bold text-base text-foreground">No projects currently available</h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                Check back soon as verified partner organizations publish new classroom initiatives.
              </p>
              <Link href="/organizations" className="inline-block text-xs font-medium text-primary-600 hover:underline touch-target">
                View partner organizations &rarr;
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* 5. WHERE CONTRIBUTIONS GO (HONEST DATABASE METRICS) */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Transparency Records
              </span>
              <h2 className="font-display font-bold text-xl sm:text-3xl text-foreground">
                Where contributions go
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                These numbers reflect active, verified records in the database.
              </p>
            </div>
            <Link
              href="/impact"
              className="text-xs font-medium text-muted hover:text-foreground flex items-center gap-1 touch-target py-2"
            >
              <span>View full impact report &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="p-4 sm:p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                {metrics.devicesReceivedCount}
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Devices Received</div>
              <div className="text-[11px] text-muted mt-0.5">Refurbished & routed</div>
            </div>

            <div className="p-4 sm:p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                {metrics.activeProjectsCount}
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Projects Supported</div>
              <div className="text-[11px] text-muted mt-0.5">Active classrooms</div>
            </div>

            <div className="p-4 sm:p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                {metrics.verifiedOrgsCount}
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Verified Organizations</div>
              <div className="text-[11px] text-muted mt-0.5">Partners reviewed</div>
            </div>

            <div className="p-4 sm:p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                {metrics.studentsReachedEstimate}
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Learners Reached</div>
              <div className="text-[11px] text-muted mt-0.5">Active lab cohorts</div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. HOW WE KEEP THE SYSTEM ACCOUNTABLE */}
      <section className="py-12 sm:py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Accountability Standards
            </span>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-foreground">
              How we keep the system accountable
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              We build trust through verifiable operational constraints and privacy protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            
            <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Building2 className="w-4 h-4 text-primary-600" />
                <span>Organization verification</span>
              </div>
              <p className="text-muted leading-relaxed">
                Organizations are reviewed for valid registration and classroom safety before listing needs.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Clock className="w-4 h-4 text-primary-600" />
                <span>Need verification</span>
              </div>
              <p className="text-muted leading-relaxed">
                Every project displays tangible counts: required units, secured units, and the exact remaining gap.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Lock className="w-4 h-4 text-primary-600" />
                <span>Child privacy</span>
              </div>
              <p className="text-muted leading-relaxed">
                Public information never exposes children&apos;s private identities or photos. Reporting is aggregated at the lab level.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <FileCheck className="w-4 h-4 text-primary-600" />
                <span>Resource tracking</span>
              </div>
              <p className="text-muted leading-relaxed">
                Donated devices are tracked through their physical lifecycle stages with safe public references.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Coins className="w-4 h-4 text-primary-600" />
                <span>Financial clarity</span>
              </div>
              <p className="text-muted leading-relaxed">
                Pledges are tied directly to itemized project milestones rather than general administration pools.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>Project milestones</span>
              </div>
              <p className="text-muted leading-relaxed">
                Progress is logged as milestones are achieved, providing real evidence of educational outcomes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="font-display font-extrabold text-xl sm:text-3xl md:text-4xl text-foreground tracking-tight">
            Have an unused device? Give it a second life.
          </h2>
          <p className="text-xs sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            Your idle laptop could enable a student to write their first line of code. Start your donation today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/donate-device"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-subtle touch-target"
            >
              <Laptop className="w-4 h-4 text-primary-400" />
              <span>Donate a device</span>
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-lg bg-surface border border-border hover:bg-surfaceSubtle text-foreground font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center touch-target"
            >
              <span>Explore projects</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Intent Modal */}
      <DonationModal
        project={selectedProjectForDonation}
        isOpen={Boolean(selectedProjectForDonation)}
        onClose={() => setSelectedProjectForDonation(null)}
      />

    </div>
  );
};
