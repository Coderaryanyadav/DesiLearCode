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
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  GitBranch, 
  Database,
  Lock,
  ChevronRight,
  Sparkles,
  Server,
  Workflow
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
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 border-b border-border bg-surface tech-grid-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Editorial Mission */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                <span>OPEN LOGISTICS & EDUCATION INFRASTRUCTURE</span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.08]">
                Refurbished hardware.<br />
                Verified classrooms.<br />
                <span className="text-primary-600">Zero corporate waste.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                DesiLearCode connects corporate donors and engineers directly with vetted grassroots child-care organizations across India. We wipe, configure, and route hardware to verifiable learning labs.
              </p>

              {/* Action Array */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/projects"
                  className="px-5 py-3 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-subtle"
                >
                  <span>Explore Verified Initiatives</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/donate-device"
                  className="px-5 py-3 rounded-md bg-surface border border-border hover:bg-surfaceSubtle text-foreground font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Laptop className="w-4 h-4 text-primary-500" />
                  <span>Pledge Computing Hardware</span>
                </Link>
              </div>

              {/* Assurance Flags */}
              <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success-600 shrink-0" />
                  <span className="text-muted font-medium">Physical Lab Audited</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-muted font-medium">NIST 800-88 Data Sanitized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-500 shrink-0" />
                  <span className="text-muted font-medium">Zero-PII Child Safeguard</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Hardware Routing Composition (Technical terminal/diagram) */}
            <div className="lg:col-span-5">
              <div className="bg-[#090c10] rounded-xl border border-[#30363d] shadow-elevation overflow-hidden text-[#8b949e] font-mono text-xs">
                
                {/* Window Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[11px] text-[#8b949e]">desilearcode-node-pipeline.log</div>
                  <div className="text-[10px] text-emerald-400">STATUS: ACTIVE</div>
                </div>

                {/* Pipeline Inspection Content */}
                <div className="p-4 space-y-3.5">
                  <div className="text-slate-400">
                    <span className="text-indigo-400">$</span> dl-routing-daemon --track-stream
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-2 pt-1 border-t border-[#21262d]">
                    <div className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-white font-bold">#DL-4820</span>
                        <span className="text-[#8b949e]">ThinkPad T480 (16GB)</span>
                      </div>
                      <span className="text-emerald-400 text-[10px]">WIPED / READY</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-white font-bold">#DL-4821</span>
                        <span className="text-[#8b949e]">Dell Latitude (8GB)</span>
                      </div>
                      <span className="text-amber-400 text-[10px]">INSPECTION</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-white font-bold">#DEST-NGO</span>
                        <span className="text-white">Navodaya Vidya Kendra</span>
                      </div>
                      <span className="text-cyan-400 text-[10px]">VERIFIED LAB</span>
                    </div>
                  </div>

                  {/* Tech Specs Summary */}
                  <div className="p-2.5 rounded bg-[#161b22] border border-[#30363d] space-y-1 text-[11px]">
                    <div className="text-white font-semibold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Curriculum Bundle Pre-installed:</span>
                    </div>
                    <div className="text-[#8b949e] pl-5">
                      • Scratch 3.0 Offline • Python 3.12 • VS Code OSS • FreeCodeCamp Offline
                    </div>
                  </div>

                  <div className="text-[10px] text-[#576071] pt-1 flex justify-between">
                    <span>Target Cohort: 40 Students</span>
                    <span>Disbursement: Milestone-Gated</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT WE ACTUALLY DO — 3 ARCHITECTURAL PATHWAYS */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-14 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600">Core Infrastructure</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Three pillars of sustainable tech education
            </h2>
            <p className="text-sm text-muted">
              We eliminate intermediaries and replace vague charitable donations with verifiable operational workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Hardware Logistics */}
            <div className="p-6 bg-surface rounded-xl border border-border flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-surfaceSubtle border border-border flex items-center justify-center text-primary-600 font-mono">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-primary-600 uppercase">01 / LOGISTICS</span>
                <h3 className="font-bold text-base text-foreground">
                  Hardware Intake & Sanitization
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Every donated device undergoes NIST 800-88 cryptographic sanitization, thermal testing, Linux OS deployment, and offline coding tool installation before field allocation.
                </p>
              </div>
              <Link href="/donate-device" className="text-xs font-semibold text-foreground hover:text-primary-600 flex items-center gap-1">
                Pledge device workflow <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2: Technical Mentorship */}
            <div className="p-6 bg-surface rounded-xl border border-border flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-surfaceSubtle border border-border flex items-center justify-center text-success-600 font-mono">
                  <Code className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-success-600 uppercase">02 / EDUCATION</span>
                <h3 className="font-bold text-base text-foreground">
                  Structured Coding Syllabus
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Engineers and tech professionals volunteer 2 hours per week to guide cohorts through visual block programming, introductory Python, and web fundamentals.
                </p>
              </div>
              <Link href="/volunteer" className="text-xs font-semibold text-foreground hover:text-success-600 flex items-center gap-1">
                View mentorship standards <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3: Institutional Vetting */}
            <div className="p-6 bg-surface rounded-xl border border-border flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-surfaceSubtle border border-border flex items-center justify-center text-accent-600 font-mono">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-accent-600 uppercase">03 / GOVERNANCE</span>
                <h3 className="font-bold text-base text-foreground">
                  Milestone-Gated Disbursements
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  NGOs must verify physical electricity, lab security, and mentor attendance. Subsequent funding and hardware allocations release only upon validated milestone completion.
                </p>
              </div>
              <Link href="/organizations" className="text-xs font-semibold text-foreground hover:text-accent-600 flex items-center gap-1">
                Review verified directory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS — VISUAL PRODUCT PIPELINE */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">End-to-End Traceability</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              How hardware travels from donor to classroom
            </h2>
          </div>

          {/* Pipeline Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            <div className="p-4 rounded-lg bg-surfaceSubtle border border-border space-y-2 relative">
              <div className="font-mono text-xs font-bold text-muted">STEP 01</div>
              <h4 className="font-bold text-sm text-foreground">Hardware Intake</h4>
              <p className="text-xs text-muted">Donor submits laptop specs & chooses drop-off or courier pickup.</p>
              <div className="text-[10px] font-mono text-primary-600 pt-1">Code: #DL-XXXX</div>
            </div>

            <div className="p-4 rounded-lg bg-surfaceSubtle border border-border space-y-2 relative">
              <div className="font-mono text-xs font-bold text-muted">STEP 02</div>
              <h4 className="font-bold text-sm text-foreground">NIST Sanitization</h4>
              <p className="text-xs text-muted">Storage drive wiped with cryptographic overwrite; battery health logged.</p>
              <div className="text-[10px] font-mono text-success-600 pt-1">Status: Certified Wipe</div>
            </div>

            <div className="p-4 rounded-lg bg-surfaceSubtle border border-border space-y-2 relative">
              <div className="font-mono text-xs font-bold text-muted">STEP 03</div>
              <h4 className="font-bold text-sm text-foreground">Lab Allocation</h4>
              <p className="text-xs text-muted">Hardware routed to verified NGO classroom with active student cohort.</p>
              <div className="text-[10px] font-mono text-foreground pt-1">Destination: Vetted Lab</div>
            </div>

            <div className="p-4 rounded-lg bg-surfaceSubtle border border-border space-y-2 relative">
              <div className="font-mono text-xs font-bold text-muted">STEP 04</div>
              <h4 className="font-bold text-sm text-foreground">Curriculum Live</h4>
              <p className="text-xs text-muted">Weekly workshops in Scratch, Python, and web logic begin with mentors.</p>
              <div className="text-[10px] font-mono text-accent-600 pt-1">Attendance Tracked</div>
            </div>

            <div className="p-4 rounded-lg bg-surfaceSubtle border border-border space-y-2 relative">
              <div className="font-mono text-xs font-bold text-muted">STEP 05</div>
              <h4 className="font-bold text-sm text-foreground">Verified Audit</h4>
              <p className="text-xs text-muted">Aggregated cohort completion report published with Zero-PII privacy.</p>
              <div className="text-[10px] font-mono text-success-600 pt-1">Audit Ledger Signed</div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FEATURED PROJECTS SHOWCASE */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600">Active Allocations</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                Verified Learning Initiatives
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-medium text-muted hover:text-foreground flex items-center gap-1 font-mono"
            >
              <span>VIEW FULL CATALOG ({featuredProjects.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Primary Featured Project */}
          {primaryProject ? (
            <div className="space-y-6">
              <FeaturedProjectCard
                project={primaryProject}
                onSupportClick={() => setSelectedProjectForDonation(primaryProject)}
              />

              {/* Supporting Secondary Projects Grid */}
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
                All initiatives undergo physical lab and curriculum verification prior to public listing.
              </p>
              <Link href="/organizations" className="inline-block text-xs font-medium text-primary-600 hover:underline">
                View onboarding partner organizations &rarr;
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* Donation Modal */}
      <DonationModal
        project={selectedProjectForDonation}
        isOpen={Boolean(selectedProjectForDonation)}
        onClose={() => setSelectedProjectForDonation(null)}
      />

    </div>
  );
};
