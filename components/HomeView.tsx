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
  ChevronRight,
  Workflow,
  Coins,
  Search,
  Building2,
  Lock,
  Clock,
  FileCheck,
  Check,
  Layers,
  Sparkles
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
      
      {/* 1. HERO SECTION: EDITORIAL HIERARCHY & DIRECT ROUTING */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 border-b border-border bg-surface tech-grid-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Clear Mission, Purpose & Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                <span className="font-semibold text-foreground">DESILEARCODE</span>
                <span>• EDUCATIONAL RESOURCE LOGISTICS</span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.08]">
                Turn unused technology into verified learning labs.
              </h1>

              <div className="text-base sm:text-lg text-muted max-w-xl leading-relaxed space-y-2 font-normal">
                <p>
                  Urban centers have idle laptops, funding, and engineering skills. Grassroots community centers lack computers for foundational digital education.
                </p>
                <p className="text-foreground font-medium">
                  DesiLearCode coordinates physical intake, data sanitization, need pairing, and milestone-verified delivery across India.
                </p>
              </div>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-subtle"
                >
                  <span>Explore Projects Needing Support</span>
                  <ArrowRight className="w-4 h-4 text-primary-400" />
                </Link>
                <Link
                  href="/donate-device"
                  className="px-6 py-3.5 rounded-md bg-surface border border-border hover:bg-surfaceSubtle text-foreground font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Laptop className="w-4 h-4 text-primary-600" />
                  <span>Donate a Device</span>
                </Link>
              </div>

              {/* Secondary Explorations */}
              <div className="flex items-center gap-6 pt-1 text-xs text-muted">
                <Link href="/volunteer" className="hover:text-foreground flex items-center gap-1.5 font-medium transition-colors">
                  <Code className="w-3.5 h-3.5 text-primary-600" />
                  <span>Volunteer Technical Skills</span>
                  <ChevronRight className="w-3 h-3 text-muted" />
                </Link>
                <Link href="/how-it-works" className="hover:text-foreground flex items-center gap-1.5 font-medium transition-colors">
                  <Workflow className="w-3.5 h-3.5 text-primary-600" />
                  <span>Operating Architecture</span>
                  <ChevronRight className="w-3 h-3 text-muted" />
                </Link>
              </div>

              {/* Trust & Architecture Badges */}
              <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-xs font-mono text-muted">
                <div>
                  <span className="block font-bold text-foreground">Verified Nonprofits</span>
                  <span className="text-[11px]">Trust deeds & legal vetted</span>
                </div>
                <div>
                  <span className="block font-bold text-foreground">NIST SP 800-88</span>
                  <span className="text-[11px]">Guidance-aligned erasure</span>
                </div>
                <div>
                  <span className="block font-bold text-foreground">Zero-PII Child Safety</span>
                  <span className="text-[11px]">Aggregated cohorts only</span>
                </div>
              </div>

            </div>

            {/* Right Column: Structured Schematic of Resource Routing */}
            <div className="lg:col-span-5">
              <div className="bg-surfaceSubtle rounded-xl border border-border p-6 shadow-panel space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-primary-600" />
                    <span>Direct Resource Routing</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                    Live Pipeline
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Origin */}
                  <div className="p-3 bg-surface rounded-lg border border-border flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
                      01
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Donor Resource Contribution</div>
                      <div className="text-muted text-[11px] mt-0.5">Unused laptops, itemized lab funding, and engineering mentorship hours.</div>
                    </div>
                  </div>

                  {/* Middleware Route */}
                  <div className="pl-6 border-l-2 border-dashed border-primary-300 ml-4 py-1 text-[11px] font-mono text-primary-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                    <span>Intake → Diagnostic Wipe → Offline OS Image → Allocation</span>
                  </div>

                  {/* Destination */}
                  <div className="p-3 bg-surface rounded-lg border border-border flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-success-50 text-success-700 flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
                      02
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Verified Classroom Deployment</div>
                      <div className="text-muted text-[11px] mt-0.5">Grassroots coding labs, robotics batches, and student digital literacy centers.</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>Transparent Public Ledger</span>
                  <Link href="/how-it-works" className="text-primary-600 hover:underline font-semibold flex items-center gap-1">
                    <span>Inspect System Model</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE CONNECTED OPERATING MODEL: RESOURCE → IMPACT */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600">
              The Operational Architecture
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-foreground tracking-tight">
              How DesiLearCode Coordinates Resource to Impact
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              We are not an opaque charity pool. Every contribution follows a strict, verifiable custody pipeline with itemized need tracking and zero-PII privacy.
            </p>
          </div>

          {/* Connected Linear Journey */}
          <div className="relative">
            
            {/* Desktop Connector Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-border -translate-y-6 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
              
              {/* Stage 1 */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-subtle flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase">STAGE 01</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                  </div>
                  <div className="text-[11px] font-mono text-primary-600 font-semibold">INPUT: RESOURCES</div>
                  <h3 className="font-bold text-base text-foreground">You Have</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Unused laptop, desktop, tablet, itemized project funding, or professional developer mentorship hours.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-muted pt-3 border-t border-border">
                  • Hardware / Funds / Skills
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-subtle flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase">STAGE 02</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                  </div>
                  <div className="text-[11px] font-mono text-primary-600 font-semibold">PROCESS: VERIFY & PREP</div>
                  <h3 className="font-bold text-base text-foreground">DesiLearCode</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Physical intake, NIST SP 800-88 guidance data sanitization, offline educational Linux imaging, and requirement matching.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-muted pt-3 border-t border-border">
                  • Wiped & Asset-Tagged
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-subtle flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase">STAGE 03</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                  </div>
                  <div className="text-[11px] font-mono text-primary-600 font-semibold">PARTNER: VETTED NGO</div>
                  <h3 className="font-bold text-base text-foreground">Verified NGO</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Grassroots non-profit with legal trust deeds, child protection officers, electrical safety, and verified classroom needs.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-muted pt-3 border-t border-border">
                  • Legal Compliance Audited
                </div>
              </div>

              {/* Stage 4 */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-subtle flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase">STAGE 04</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                  </div>
                  <div className="text-[11px] font-mono text-primary-600 font-semibold">DELIVERY: LAB DEPLOYMENT</div>
                  <h3 className="font-bold text-base text-foreground">Educational Project</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Physical computer lab, scheduled coding batches, Scratch logic sessions, and structured STEM modules in action.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-muted pt-3 border-t border-border">
                  • Deployed to Classroom
                </div>
              </div>

              {/* Stage 5 */}
              <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-subtle flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase">STAGE 05</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-success-600 ring-4 ring-success-100" />
                  </div>
                  <div className="text-[11px] font-mono text-success-700 font-semibold">OUTCOME: PUBLIC PROOF</div>
                  <h3 className="font-bold text-base text-foreground">Verified Impact</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Audited milestone reports, active lab hours logged, zero-PII child privacy, and publicly traceable asset telemetry.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-success-700 pt-3 border-t border-border">
                  • Verifiable Public Proof
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. THREE TANGIBLE CONTRIBUTION PATHWAYS */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Tangible Contribution Channels
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              What would you like to contribute?
            </h2>
            <p className="text-sm text-muted">
              Choose your contribution type. Every channel connects directly to an active, itemized requirement in the registry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Channel 1: Device */}
            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border flex flex-col justify-between space-y-6 hover:shadow-panel transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-primary-600 font-mono">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-primary-600 uppercase">HARDWARE REUSE</span>
                  <h3 className="font-display font-bold text-xl text-foreground mt-0.5">
                    Contribute a Device
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Have an unused laptop, desktop, tablet, or monitor? We inspect it, securely wipe all data (NIST SP 800-88 guidance), install educational Linux & offline coding tools, and allocate it to an active lab.
                </p>
              </div>

              <Link
                href="/donate-device"
                className="w-full py-3 px-4 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs text-center transition-colors flex items-center justify-center gap-2 shadow-subtle"
              >
                <span>Donate a Device</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>

            {/* Channel 2: Money / Need Funding */}
            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border flex flex-col justify-between space-y-6 hover:shadow-panel transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-accent-600 font-mono">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-accent-600 uppercase">ITEMIZED FUNDING</span>
                  <h3 className="font-display font-bold text-xl text-foreground mt-0.5">
                    Fund a Project Need
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Support concrete requirements such as RAM upgrades, Wi-Fi routers, robotics sensor kits, or lab power backups. Contributions are linked to milestone deliverables, not general administrative pools.
                </p>
              </div>

              <Link
                href="/projects"
                className="w-full py-3 px-4 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs text-center transition-colors flex items-center justify-center gap-2 shadow-subtle"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>

            {/* Channel 3: Skills / Volunteer */}
            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border flex flex-col justify-between space-y-6 hover:shadow-panel transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-success-600 font-mono">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-success-600 uppercase">ENGINEERING MENTORSHIP</span>
                  <h3 className="font-display font-bold text-xl text-foreground mt-0.5">
                    Volunteer Your Skills
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Are you a developer, engineer, or tech educator? Dedicate 2 hours per week to mentor a student cohort through Scratch logic, Python fundamentals, or web design under child safeguarding supervision.
                </p>
              </div>

              <Link
                href="/volunteer"
                className="w-full py-3 px-4 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs text-center transition-colors flex items-center justify-center gap-2 shadow-subtle"
              >
                <span>Apply as a Mentor</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. REAL PROJECTS AT THE CENTER OF THE PRODUCT */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600">
                Active Resource Gaps
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                Verified Projects Requiring Resources
              </h2>
              <p className="text-xs text-muted">
                Each project displays its exact equipment requirements, secured counts, and remaining gap.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-foreground hover:text-primary-600 flex items-center gap-1 font-mono shrink-0"
            >
              <span>VIEW FULL CATALOG ({featuredProjects.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Primary Featured Project with explicit Need breakdown */}
          {primaryProject ? (
            <div className="space-y-6">
              <FeaturedProjectCard
                project={primaryProject}
                onSupportClick={() => setSelectedProjectForDonation(primaryProject)}
              />

              {/* Secondary Projects Grid */}
              {secondaryProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
            <div className="p-12 bg-surface rounded-xl border border-border text-center space-y-3">
              <h3 className="font-bold text-base text-foreground">No Published Initiatives Yet</h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                All grassroots initiatives undergo physical lab audits and statutory compliance verification before public listing.
              </p>
              <Link href="/organizations" className="inline-block text-xs font-medium text-primary-600 hover:underline">
                View onboarding partner organizations &rarr;
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* 5. THE DEVICE STORY: TANGIBLE JOURNEY */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600">
                Hardware Lifecycle
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground tracking-tight">
                Your old laptop can become someone&apos;s classroom.
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Millions of functional laptops sit idle in closets and corporate IT storage across India. Meanwhile, rural and grassroots community centers lack basic computers for digital literacy. DesiLearCode bridges this physical gap through a verified, trustworthy chain of custody.
              </p>
              <div className="pt-2">
                <Link
                  href="/donate-device"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs transition-colors shadow-subtle"
                >
                  <Laptop className="w-4 h-4 text-primary-400" />
                  <span>Start Device Donation</span>
                </Link>
              </div>
            </div>

            {/* Step-by-Step Device Journey */}
            <div className="lg:col-span-6 space-y-3 font-mono text-xs">
              
              <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-3">
                <span className="font-bold text-primary-600 shrink-0 mt-0.5">01</span>
                <div>
                  <strong className="text-foreground block font-sans text-xs">1. Donate & Log</strong>
                  <span className="text-muted text-[11px]">Tell us about the device specs and handover preference. An asset code (<code className="text-foreground">#DLC-XXXX-XXXX</code>) is generated.</span>
                </div>
              </div>

              <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-3">
                <span className="font-bold text-primary-600 shrink-0 mt-0.5">02</span>
                <div>
                  <strong className="text-foreground block font-sans text-xs">2. Prepare & Sanitize</strong>
                  <span className="text-muted text-[11px]">Technicians perform storage erasure aligned with NIST SP 800-88 guidance, thermal cleanup, and educational OS installation.</span>
                </div>
              </div>

              <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-3">
                <span className="font-bold text-primary-600 shrink-0 mt-0.5">03</span>
                <div>
                  <strong className="text-foreground block font-sans text-xs">3. Match to Need</strong>
                  <span className="text-muted text-[11px]">The refurbished unit is paired with an itemized requirement in a verified educational project.</span>
                </div>
              </div>

              <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-3">
                <span className="font-bold text-primary-600 shrink-0 mt-0.5">04</span>
                <div>
                  <strong className="text-foreground block font-sans text-xs">4. Deliver to Lab</strong>
                  <span className="text-muted text-[11px]">The partner organization physically receives the asset, records receipt, and sets it up in the classroom.</span>
                </div>
              </div>

              <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-3">
                <span className="font-bold text-success-700 shrink-0 mt-0.5">05</span>
                <div>
                  <strong className="text-foreground block font-sans text-xs">5. Track Progress</strong>
                  <span className="text-muted text-[11px]">You can track the asset&apos;s educational lifecycle publicly using your tracking code without exposing any personal data.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. TRUST THROUGH VISIBLE PRODUCT MECHANICS */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Verification Standards
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Trust is built into the product mechanics
            </h2>
            <p className="text-sm text-muted">
              We do not ask for blind faith. Every layer of the platform is governed by auditable operational constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Building2 className="w-4 h-4 text-primary-600" />
                <span>Verified Organizations</span>
              </div>
              <p className="text-muted leading-relaxed">
                NGOs must submit statutory legal filings, trust deeds, and electrical safety audits before publishing project needs.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Clock className="w-4 h-4 text-primary-600" />
                <span>Transparent Resource Requirements</span>
              </div>
              <p className="text-muted leading-relaxed">
                Every project displays tangible counts: required units, secured units, and the exact remaining gap.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Lock className="w-4 h-4 text-primary-600" />
                <span>Zero-PII Child Safeguarding</span>
              </div>
              <p className="text-muted leading-relaxed">
                We never publish individual minor names, addresses, or facial photos. Impact is reported strictly at the aggregated cohort level.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <FileCheck className="w-4 h-4 text-primary-600" />
                <span>Auditable State Transitions</span>
              </div>
              <p className="text-muted leading-relaxed">
                Every device state update and volunteer hour record creates an append-only audit trail in PostgreSQL.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Coins className="w-4 h-4 text-primary-600" />
                <span>Separated Financial Pledges</span>
              </div>
              <p className="text-muted leading-relaxed">
                Pledges are recorded as intent and do NOT increment confirmed funding until verified gateway settlement occurs.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>Public-Safe Device Telemetry</span>
              </div>
              <p className="text-muted leading-relaxed">
                Track assets publicly using high-entropy codes. Donor identities and technician private notes are stripped at the DTO layer.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. REAL IMPACT SECTION: WHERE RESOURCES GO */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                Audit Trail
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                Where resources go
              </h2>
              <p className="text-xs text-muted">
                These numbers reflect active, verified records in the database.
              </p>
            </div>
            <Link
              href="/impact"
              className="text-xs font-medium text-muted hover:text-foreground flex items-center gap-1 font-mono"
            >
              <span>INSPECT AUDIT REPORT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-3xl font-display font-extrabold text-foreground font-mono">
                {metrics.devicesReceivedCount}
              </div>
              <div className="text-xs font-bold text-foreground mt-1">Devices Received</div>
              <div className="text-[11px] text-muted mt-0.5">Refurbished & routed to labs</div>
            </div>

            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-3xl font-display font-extrabold text-foreground font-mono">
                {metrics.activeProjectsCount}
              </div>
              <div className="text-xs font-bold text-foreground mt-1">Active Projects</div>
              <div className="text-[11px] text-muted mt-0.5">Classrooms & coding centers</div>
            </div>

            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-3xl font-display font-extrabold text-foreground font-mono">
                {metrics.verifiedOrgsCount}
              </div>
              <div className="text-xs font-bold text-foreground mt-1">Verified Organizations</div>
              <div className="text-[11px] text-muted mt-0.5">Nonprofit partners audited</div>
            </div>

            <div className="p-6 bg-surfaceSubtle rounded-xl border border-border">
              <div className="text-3xl font-display font-extrabold text-foreground font-mono">
                {metrics.volunteersCount}
              </div>
              <div className="text-xs font-bold text-foreground mt-1">Registered Mentors</div>
              <div className="text-[11px] text-muted mt-0.5">Engineers & technical tutors</div>
            </div>

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
