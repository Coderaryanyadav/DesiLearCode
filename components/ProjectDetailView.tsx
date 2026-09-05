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
  Coins,
  Clock,
  FileText,
  AlertCircle,
  Sparkles
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
  const fulfilledNeeds = project.needs ? project.needs.filter(n => n.fulfilled) : [];

  // Aggregated item stats
  const totalUnitsRequired = project.needs ? project.needs.reduce((acc, n) => acc + n.quantityRequired, 0) : 0;
  const totalUnitsSecured = project.needs ? project.needs.reduce((acc, n) => acc + n.quantityFulfilled, 0) : 0;
  const totalUnitsRemaining = Math.max(0, totalUnitsRequired - totalUnitsSecured);

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
        
        {/* LEFT COLUMN: Deep Project Case File */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. PROJECT HEADER DOSSIER */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-6 shadow-subtle">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-semibold bg-surfaceSubtle text-foreground px-2.5 py-0.5 rounded border border-border">
                  {project.category.toUpperCase()}
                </span>
                <StatusBadge status={project.status} size="sm" />
                <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} size="sm" />
              </div>
              <div className="text-[11px] font-mono text-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-muted" />
                <span>CASE FILE ID: #{project.slug.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Managed Organization Trust Banner */}
            <div className="flex items-center justify-between p-4 bg-surfaceSubtle rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-foreground text-surface flex items-center justify-center font-mono font-bold text-sm">
                  {project.organizationName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{project.organizationName}</span>
                    <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} showText={false} size="sm" />
                  </div>
                  <div className="text-[11px] text-muted flex items-center gap-1 mt-0.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    <span>{project.region}</span>
                  </div>
                </div>
              </div>
              <Link 
                href="/organizations"
                className="text-xs font-medium text-muted hover:text-foreground flex items-center gap-1 hidden sm:flex"
              >
                <span>Partner Directory</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border text-center">
              <div className="p-3 bg-surfaceSubtle rounded-md">
                <div className="text-[10px] font-mono text-muted uppercase">Target Students</div>
                <div className="text-sm font-bold text-foreground mt-0.5">{project.targetStudents}</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md">
                <div className="text-[10px] font-mono text-muted uppercase">Resource Gap</div>
                <div className="text-sm font-bold text-primary-600 mt-0.5">{totalUnitsRemaining} units</div>
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

          {/* 2. THE PROBLEM */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-5 shadow-subtle">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Layers className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                The Problem & Context
              </h2>
            </div>
            
            <div className="text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line space-y-3">
              {project.description}
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-1.5">
                Why This Initiative Matters
              </h3>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {project.whyItMatters || 'This learning center provides foundational computing literacy, problem-solving, and practical vocational programming skills for students without home computers.'}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-1.5">
                Target Beneficiary Cohort
              </h3>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {project.beneficiaryGroup || `${project.targetStudents} students in ${project.region}`}
              </p>
            </div>
          </div>

          {/* 3. THE NEED & REMAINING GAP */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                  The Need & Remaining Gap
                </h2>
              </div>
              <span className="text-xs font-mono text-primary-600 font-bold">
                {openNeeds.length} items unfulfilled
              </span>
            </div>

            {/* Gap Summary Bar */}
            <div className="p-4 bg-surfaceSubtle rounded-lg border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Total Units Needed: <strong>{totalUnitsRequired}</strong></span>
                <span>Secured: <strong className="text-success-700">{totalUnitsSecured}</strong></span>
                <span>Remaining Gap: <strong className="text-primary-600">{totalUnitsRemaining}</strong></span>
              </div>
              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${totalUnitsRequired > 0 ? Math.round((totalUnitsSecured / totalUnitsRequired) * 100) : project.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Itemized Requirements Grid */}
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
                General project fund active for peripheral and lab support.
              </div>
            )}
          </div>

          {/* 4. PROJECT ROADMAP & MILESTONES */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-success-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                  Project Roadmap & Verification Milestones
                </h2>
              </div>
              <span className="text-xs font-mono text-muted">Independent Review</span>
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
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          milestone.completed ? 'bg-success-50 text-success-700 border-success-200' : 'bg-surfaceSubtle text-muted border-border'
                        }`}>
                          {milestone.completed ? 'Completed' : `Target: ${milestone.targetDate}`}
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

          {/* 5. VERIFIED FIELD UPDATES */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                  Verified Field Updates
                </h2>
              </div>
              <span className="text-xs font-mono text-muted">Audited Feed</span>
            </div>

            {project.updates && project.updates.length > 0 ? (
              <div className="space-y-4">
                {project.updates.map((update, idx) => (
                  <div key={idx} className="p-4 bg-surfaceSubtle rounded-lg border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <strong className="text-foreground">{update.title}</strong>
                      <span className="text-muted">{new Date(update.postedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{update.content}</p>
                    <div className="text-[10px] font-mono text-muted pt-1 flex items-center gap-1">
                      <span>Posted by {update.authorName}</span>
                      {update.isSafeguardedChecked && (
                        <span className="text-success-700 flex items-center gap-0.5">
                          • <ShieldCheck className="w-3 h-3 inline" /> Safeguard Audited
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-surfaceSubtle rounded-md border border-border text-xs text-muted text-center">
                No public field updates posted yet. Subsequent updates will appear here following technician verification.
              </div>
            )}
          </div>

          {/* 6. VERIFIED IMPACT METRICS */}
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border space-y-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-success-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                  Verified Classroom Impact
                </h2>
              </div>
              <span className="text-xs font-mono text-muted">Database Derived</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border">
                <div className="text-xl font-bold text-foreground">{project.impactSummary?.studentsReached || project.targetStudents}</div>
                <div className="text-[10px] text-muted uppercase mt-0.5">Students Trained</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border">
                <div className="text-xl font-bold text-foreground">{project.impactSummary?.computersInstalled || 0}</div>
                <div className="text-[10px] text-muted uppercase mt-0.5">Laptops Active</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border">
                <div className="text-xl font-bold text-foreground">{project.impactSummary?.volunteerHoursLogged || 0}</div>
                <div className="text-[10px] text-muted uppercase mt-0.5">Mentor Hours</div>
              </div>
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border">
                <div className="text-xl font-bold text-foreground">{project.impactSummary?.workshopsConducted || 0}</div>
                <div className="text-[10px] text-muted uppercase mt-0.5">Workshops Held</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Action Console & Contribution Paths */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Action Card */}
          <div className="bg-surface rounded-xl p-6 border border-border space-y-5 shadow-panel">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600">
                Support This Project
              </div>
              
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-2xl font-display font-extrabold text-foreground">
                    ₹{project.currentValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-muted mt-0.5">
                    Pledged intent of ₹{project.goalValue.toLocaleString()} target
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-primary-600">
                  {project.progressPercentage}%
                </span>
              </div>

              <ProgressBar percentage={project.progressPercentage} size="md" showLabel={false} />
            </div>

            {/* Direct Support Button */}
            <button
              onClick={() => {
                setSelectedNeedForDonation(null);
                setIsDonationOpen(true);
              }}
              className="w-full py-3 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              <Coins className="w-3.5 h-3.5 text-primary-400" />
              <span>Fund This Project Requirement</span>
            </button>

            {/* Other Direct Help Ways */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link
                href={`/donate-device?projectId=${project.id}`}
                className="w-full py-2.5 rounded-md bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-primary-200"
              >
                <Laptop className="w-3.5 h-3.5 text-primary-600" />
                <span>Donate Device to This Project</span>
              </Link>

              <Link
                href={`/volunteer/apply?projectId=${project.id}`}
                className="w-full py-2.5 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-border"
              >
                <Code className="w-3.5 h-3.5 text-primary-500" />
                <span>Volunteer Skills as Mentor</span>
              </Link>
            </div>

            <div className="p-3 bg-surfaceSubtle rounded-md border border-border text-[11px] text-muted space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                <span>Itemized Milestone Guarantee</span>
              </div>
              <p className="leading-relaxed">
                Pledged funds and donated hardware are locked to verified classroom milestones under legal organizational oversight.
              </p>
            </div>
          </div>

          {/* Child Protection & Safeguarding Card */}
          <div className="bg-[#090c10] text-[#8b949e] rounded-xl p-5 border border-[#21262d] space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-PII Child Safeguarding</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              No individual child names, identifiable facial photos, or private school coordinates are ever published. All reports are aggregated at the verified lab level.
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

      {/* Donation Intent Modal */}
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
