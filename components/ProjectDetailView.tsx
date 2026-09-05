'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, NeedItem } from '@/lib/types';
import { ProgressBar } from '@/components/ProgressBar';
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { DonationModal } from '@/components/DonationModal';
import { NeedCard } from '@/components/NeedCard';
import { 
  MapPin, 
  Users, 
  Laptop, 
  HeartHandshake, 
  Code, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck2, 
  Sparkles, 
  ArrowLeft 
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <Link href="/projects" className="hover:text-foreground flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{project.title}</span>
      </div>

      {/* Main Grid: Left 8 Cols (Details), Right 4 Cols (Sidebar / Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: HERO, ABOUT, NEEDS, MILESTONES */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-3 py-1 rounded-full border border-primary-100">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              {project.organizationVerified && (
                <VerificationBadge status="verified" size="sm" />
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg text-muted leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Managed by NGO card snippet */}
            <div className="flex items-center justify-between p-4 bg-surfaceHover rounded-2xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-foreground text-surface flex items-center justify-center font-bold text-lg shadow-card">
                  {project.organizationName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>{project.organizationName}</span>
                    <VerificationBadge status="verified" size="sm" />
                  </div>
                  <div className="text-xs text-muted flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.region}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] relative shadow-inner bg-surfaceHover border border-border">
              <img
                src={project.heroImageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-card border border-border">
                <Users className="w-3.5 h-3.5 text-primary-500" />
                <span>Cohort: {project.targetStudents} Students</span>
              </div>
            </div>

            {/* Key Metas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center border-t border-border">
              <div className="p-4 bg-surfaceHover rounded-2xl border border-transparent">
                <div className="text-xs text-muted font-medium mb-1">Beneficiaries</div>
                <div className="text-base font-bold text-foreground">{project.targetStudents} Students</div>
              </div>
              <div className="p-4 bg-surfaceHover rounded-2xl border border-transparent">
                <div className="text-xs text-muted font-medium mb-1">Category</div>
                <div className="text-base font-bold text-foreground">{project.category}</div>
              </div>
              <div className="p-4 bg-surfaceHover rounded-2xl border border-transparent">
                <div className="text-xs text-muted font-medium mb-1">Region</div>
                <div className="text-base font-bold text-foreground truncate">{project.region}</div>
              </div>
              <div className="p-4 bg-surfaceHover rounded-2xl border border-transparent">
                <div className="text-xs text-muted font-medium mb-1">Safeguarding</div>
                <div className="text-base font-bold text-success-600 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Vetted
                </div>
              </div>
            </div>
          </div>

          {/* Section: Why it matters & Description */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-8">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-primary-500" />
                About This Initiative
              </h2>
              <div className="mt-4 text-sm sm:text-base text-muted leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-base font-bold text-foreground">Why This Matters For Children</h3>
              <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
                {project.whyItMatters}
              </p>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-base font-bold text-foreground">What Your Support Provides</h3>
              <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
                {project.whatSupportProvides}
              </p>
            </div>
          </div>

          {/* Section: Needs Breakdown */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Transparent Allocation</span>
              <h2 className="text-xl font-display font-bold text-foreground mt-2">Specific Hardware & Resource Needs</h2>
              <p className="text-sm text-muted mt-1.5">
                Targeted requirements for this learning center. You can sponsor a specific item or make a general project contribution.
              </p>
            </div>

            {project.needs && project.needs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {project.needs.map((need) => (
                  <NeedCard
                    key={need.id}
                    need={need}
                    onFulfillClick={() => handleNeedDonate(need)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-surfaceHover rounded-2xl border border-border text-sm font-medium text-muted text-center mt-6">
                General project support fund active.
              </div>
            )}
          </div>

          {/* Section: Milestones & Lifecycle Roadmap */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-primary-500" />
                Project Milestones & Verification Timeline
              </h2>
              <p className="text-sm text-muted mt-1.5">
                Independent verification checkpoints required before subsequent phase disbursement.
              </p>
            </div>

            {project.milestones && project.milestones.length > 0 ? (
              <div className="relative pl-7 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-border mt-6">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id || idx} className="relative">
                    <div className={`absolute -left-[34px] top-1 w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center transition-colors ${
                      milestone.completed ? 'bg-success-500 text-white' : 'bg-muted'
                    }`}>
                      {milestone.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground">{milestone.title}</h4>
                        <span className="text-xs text-muted font-medium bg-surfaceHover px-2 py-0.5 rounded border border-border">
                          {milestone.targetDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-surfaceHover rounded-2xl border border-border text-sm font-medium text-muted text-center mt-6">
                Initial installation and workshop roadmap underway.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: DONATION BOX, STATS & SAFEGUARDING */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
          {/* Donation Action Card */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-float space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm text-muted mb-2 font-semibold">
                <span>Funded Target</span>
                <span className="text-foreground font-bold">{project.progressPercentage}%</span>
              </div>
              <ProgressBar percentage={project.progressPercentage} size="lg" showLabel={false} />
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <div>
                <div className="text-3xl font-display font-extrabold text-foreground tracking-tight">
                  ₹{project.currentValue.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-muted mt-1">Pledged of ₹{project.goalValue.toLocaleString()} goal</div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  project.status === 'active' 
                    ? 'text-success-700 bg-success-50 border-success-200' 
                    : 'text-warning-700 bg-warning-50 border-warning-200'
                }`}>
                  {project.status === 'active' ? 'Active Target' : 'Under Review'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedNeedForDonation(null);
                setIsDonationOpen(true);
              }}
              className="w-full py-4 rounded-2xl bg-foreground hover:bg-foreground/90 text-surface font-bold text-sm transition-all shadow-card flex items-center justify-center gap-2.5 mt-6"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Support This Project</span>
            </button>

            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="/volunteer/apply"
                className="w-full py-3.5 rounded-2xl bg-surfaceHover hover:bg-border text-foreground font-semibold text-sm transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Code className="w-4 h-4 text-primary-600" />
                <span>Volunteer as Coding Mentor</span>
              </Link>

              <Link
                href="/donate-device"
                className="w-full py-3.5 rounded-2xl bg-success-50 hover:bg-success-100 text-success-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 text-center border border-success-200"
              >
                <Laptop className="w-4 h-4 text-success-600" />
                <span>Pledge Laptop for This Lab</span>
              </Link>
            </div>

            <div className="p-4 bg-surfaceHover rounded-2xl border border-border text-xs text-muted space-y-2 mt-4">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="w-4 h-4 text-success-600" />
                <span>Transparency Assured</span>
              </div>
              <p className="leading-relaxed">
                100% of contributions are allocated directly to verifiable technology equipment and digital curriculum.
              </p>
            </div>
          </div>

          {/* Child Safeguarding Box */}
          <div className="bg-foreground text-surface rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-success-500" />
              <span>Safeguarding Standard</span>
            </div>
            <h3 className="text-base font-bold text-surface">
              Zero-PII Child Protection Policy
            </h3>
            <p className="text-sm text-surface/80 leading-relaxed font-medium">
              In accordance with our strict safeguarding charter, no individual child names, identifiable photographs, or addresses are published. All statistics reflect aggregate cohorts.
            </p>
            <Link
              href="/safeguarding"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors pt-2"
            >
              Learn about our child protection protocols →
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
