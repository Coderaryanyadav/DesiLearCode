'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, NeedItem } from '@/lib/types';
import { ProgressBar } from '@/components/ProgressBar';
import { VerificationBadge, StatusBadge } from '@/components/VerificationBadge';
import { DonationModal } from '@/components/DonationModal';
import { NeedCard } from '@/components/NeedCard';
import { 
  MapPin, 
  Users, 
  Laptop, 
  Code, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  ArrowLeft,
  Calendar,
  Lock,
  ChevronRight,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project }) => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [selectedNeedForDonation, setSelectedNeedForDonation] = useState<NeedItem | null>(null);

  const handleNeedDonate = (need: NeedItem) => {
    setSelectedNeedForDonation(need);
    setIsDonationOpen(true);
  };

  const openNeeds = project.needs ? project.needs.filter(n => !n.fulfilled) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted">
        <Link href="/projects" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> INITIATIVES
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-md">{project.title}</span>
      </div>

      {/* Main Grid: 8 Cols (Story & Specs) / 4 Cols (Pledge & Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Deep Story Architecture */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Card */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold bg-surfaceSubtle text-foreground px-2.5 py-0.5 rounded border border-border">
                {project.category.toUpperCase()}
              </span>
              <StatusBadge status={project.status} size="sm" />
              <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} size="sm" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Managed Organization Banner */}
            <div className="flex items-center justify-between p-3.5 bg-surfaceSubtle rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-foreground text-surface flex items-center justify-center font-mono font-bold text-sm">
                  {project.organizationName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{project.organizationName}</span>
                    <VerificationBadge status="verified" showText={false} size="sm" />
                  </div>
                  <div className="text-[11px] text-muted flex items-center gap-1 mt-0.5 font-mono">
                    <MapPin className="w-3 h-3 text-primary-500" />
                    <span>{project.region}</span>
                  </div>
                </div>
              </div>
              <Link 
                href={`/organizations`}
                className="text-xs font-medium text-muted hover:text-foreground flex items-center gap-1 hidden sm:flex"
              >
                <span>Partner profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Hero Image */}
            <div className="rounded-lg overflow-hidden aspect-[16/9] relative bg-surfaceSubtle border border-border">
              <img
                src={project.heroImageUrl || '/images/default-project.jpg'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur-sm text-foreground text-xs font-mono font-medium px-2.5 py-1 rounded border border-border flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-500" />
                <span>Target Cohort: {project.targetStudents} Students</span>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border text-center">
              <div className="p-3 bg-surfaceSubtle rounded-md">
                <div className="text-[10px] font-mono text-muted uppercase">Students</div>
                <div className="text-sm font-bold text-foreground mt-0.5">{project.targetStudents}</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md">
                <div className="text-[10px] font-mono text-muted uppercase">Hardware Needed</div>
                <div className="text-sm font-bold text-foreground mt-0.5">{openNeeds.length} items</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md">
                <div className="text-[10px] font-mono text-muted uppercase">Region</div>
                <div className="text-sm font-bold text-foreground mt-0.5 truncate">{project.region}</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md">
                <div className="text-[10px] font-mono text-muted uppercase">Safeguarding</div>
                <div className="text-sm font-bold text-success-700 flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Vetted
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-500" />
                Problem Context & Initiative Scope
              </h2>
              <div className="mt-3 text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </div>

            <div className="pt-5 border-t border-border">
              <h3 className="text-sm font-bold text-foreground">Why This Opportunity Matters</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                {project.whyItMatters || 'This initiative equips students with fundamental digital literacy, computational logic, and hands-on coding skills necessary for modern education.'}
              </p>
            </div>

            <div className="pt-5 border-t border-border">
              <h3 className="text-sm font-bold text-foreground">Resource Deployment Strategy</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                {project.whatSupportProvides || 'Hardware received is wiped, installed with offline educational tooling, and allocated directly to the verified learning center under milestone oversight.'}
              </p>
            </div>
          </div>

          {/* Itemized Requirements Breakdown */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-600">Hardware Allocation</span>
                <h2 className="text-base font-bold text-foreground">Itemized Equipment & Resource Needs</h2>
              </div>
              <span className="text-xs font-mono text-muted">{openNeeds.length} pending</span>
            </div>

            {project.needs && project.needs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {project.needs.map((need) => (
                  <NeedCard
                    key={need.id}
                    need={need}
                    onFulfillClick={() => handleNeedDonate(need)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 bg-surfaceSubtle rounded-md border border-border text-xs text-muted text-center">
                General project fund active for hardware accessories.
              </div>
            )}
          </div>

          {/* Milestones & Verification Timeline */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-success-600">Independent Governance</span>
              <h2 className="text-base font-bold text-foreground">Milestone & Verification Roadmap</h2>
            </div>

            {project.milestones && project.milestones.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border pt-2">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id || idx} className="relative">
                    <div className={`absolute -left-[29px] top-0.5 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center ${
                      milestone.completed ? 'bg-success-600 text-white' : 'bg-muted'
                    }`}>
                      {milestone.completed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground">{milestone.title}</h4>
                        <span className="text-[10px] font-mono text-muted bg-surfaceSubtle px-2 py-0.5 rounded border border-border">
                          {milestone.targetDate}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-surfaceSubtle rounded-md border border-border text-xs text-muted text-center">
                Initial hardware deployment & workshop schedule active.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Pledge Sidebar */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Action Card */}
          <div className="bg-surface rounded-xl p-6 border border-border space-y-5 shadow-panel">
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-2xl font-display font-extrabold text-foreground">
                    ₹{project.currentValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-muted mt-0.5">Pledged of ₹{project.goalValue.toLocaleString()} target</div>
                </div>
                <span className="text-xs font-mono font-bold text-primary-600">
                  {project.progressPercentage}%
                </span>
              </div>

              <ProgressBar percentage={project.progressPercentage} size="md" showLabel={false} />
            </div>

            <button
              onClick={() => {
                setSelectedNeedForDonation(null);
                setIsDonationOpen(true);
              }}
              className="w-full py-3 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              <span>Support This Initiative</span>
            </button>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link
                href="/volunteer/apply"
                className="w-full py-2.5 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-border"
              >
                <Code className="w-3.5 h-3.5 text-primary-500" />
                <span>Volunteer as Tech Mentor</span>
              </Link>

              <Link
                href="/donate-device"
                className="w-full py-2.5 rounded-md bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-primary-200"
              >
                <Laptop className="w-3.5 h-3.5 text-primary-600" />
                <span>Pledge Laptop for This Lab</span>
              </Link>
            </div>

            <div className="p-3 bg-surfaceSubtle rounded-md border border-border text-[11px] text-muted space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                <span>Milestone-Disbursed Fund</span>
              </div>
              <p className="leading-relaxed">
                100% of contributions are locked to itemized educational resources and verified partner milestones.
              </p>
            </div>
          </div>

          {/* Child Protection Charter Card */}
          <div className="bg-[#090c10] text-[#8b949e] rounded-xl p-5 border border-[#21262d] space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-PII Safeguarding Charter</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              No individual child names, identifiable photographs, or exact school addresses are ever published. All reports are aggregated at the verified lab level.
            </p>
            <Link
              href="/safeguarding"
              className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
            >
              Read protection protocols &rarr;
            </Link>
          </div>

        </div>

      </div>

      {/* Donation Modal */}
      <DonationModal
        project={project}
        need={selectedNeedForDonation}
        isOpen={isDonationOpen}
        onClose={() => {
          setIsDonationOpen(false);
          setSelectedNeedForDonation(null);
        }}
      />
    </div>
  );
};
