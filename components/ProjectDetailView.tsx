'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Sparkles,
  ArrowRight
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
      
      {/* Breadcrumb Navigation & Top Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Link href="/projects" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> INITIATIVES DIRECTORY
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs sm:max-w-md">{project.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-surfaceSubtle px-2 py-0.5 rounded border border-border">
            DOSSIER ID: #{project.slug.toUpperCase()}
          </span>
          <StatusBadge status={project.status} size="sm" />
        </div>
      </div>

      {/* Main Grid: 8 Cols (Deep Dossier) / 4 Cols (Action Console) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Deep Project Dossier */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. PROJECT HEADER & CORE NEED HIGHLIGHT */}
          <div className="space-y-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold bg-surfaceSubtle text-foreground px-2.5 py-0.5 rounded border border-border">
                  {project.category.toUpperCase()}
                </span>
                <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} size="sm" />
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight leading-tight">
                {project.title}
              </h1>
              
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* DOMINANT "THE NEED" CALLOUT BOX */}
            <div className="p-6 bg-surfaceSubtle rounded-xl border-2 border-primary-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                  <span>PRIMARY RESOURCE GAP</span>
                </span>
                <span className="text-xs font-mono text-muted">
                  {openNeeds.length} active requirement items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <div className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
                    {totalUnitsRemaining > 0 ? `${totalUnitsRemaining} Units Needed` : 'Lab Fully Equipped'}
                  </div>
                  <div className="text-xs text-muted">
                    {totalUnitsSecured} units secured of {totalUnitsRequired} target requirement
                  </div>
                </div>

                <div className="flex flex-col justify-center sm:border-l sm:border-border sm:pl-4">
                  <div className="text-xs font-mono text-muted">FUNDING INTENT</div>
                  <div className="text-xl font-mono font-bold text-foreground mt-0.5">
                    ₹{project.currentValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-muted">Goal: ₹{project.goalValue.toLocaleString()}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-primary-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${totalUnitsRequired > 0 ? Math.round((totalUnitsSecured / totalUnitsRequired) * 100) : project.progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-muted">
                  <span>{totalUnitsRequired > 0 ? Math.round((totalUnitsSecured / totalUnitsRequired) * 100) : project.progressPercentage}% requirement fulfilled</span>
                  <span>Target Cohort: {project.targetStudents} Students</span>
                </div>
              </div>
            </div>

            {/* Managed Organization Trust Line */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
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
            <div className="rounded-xl overflow-hidden aspect-[16/9] relative bg-surfaceSubtle border border-border">
              <Image
                src={project.heroImageUrl || '/images/default-project.jpg'}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur-sm text-foreground text-xs font-mono font-medium px-2.5 py-1 rounded border border-border flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-500" />
                <span>Target Cohort: {project.targetStudents} Students</span>
              </div>
            </div>

          </div>

          {/* 2. THE PROBLEM & CONTEXT (Open Editorial Section) */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-600" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                Problem & Educational Context
              </h2>
            </div>
            
            <div className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line space-y-3">
              {project.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold uppercase text-muted">Why It Matters</h3>
                <p className="text-xs text-foreground leading-relaxed">
                  {project.whyItMatters || 'This learning center provides foundational computing literacy, problem-solving, and practical programming skills for students without home computers.'}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold uppercase text-muted">Target Beneficiary Cohort</h3>
                <p className="text-xs text-foreground leading-relaxed">
                  {project.beneficiaryGroup || `${project.targetStudents} students in ${project.region}`}
                </p>
              </div>
            </div>
          </div>

          {/* 3. ITEMIZED REQUIREMENTS LIST */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-primary-600" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                  Itemized Hardware & Lab Requirements
                </h2>
              </div>
              <span className="text-xs font-mono text-primary-600 font-semibold">
                {openNeeds.length} items unfulfilled
              </span>
            </div>

            {project.needs && project.needs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* 4. TIMELINE & MILESTONES */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-success-600" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                  Milestones & Verification Roadmap
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
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                  Audited Field Updates
                </h2>
              </div>
              <span className="text-xs font-mono text-muted">PostgreSQL Audit Feed</span>
            </div>

            {project.updates && project.updates.length > 0 ? (
              <div className="space-y-3">
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

          {/* 6. CLASSROOM IMPACT TALLY */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-success-600" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                  Classroom Impact Tally
                </h2>
              </div>
              <span className="text-xs font-mono text-muted">Derived Metrics</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border">
                <div className="text-xl font-bold text-foreground">{project.impactSummary?.studentsReached ?? 0}</div>
                <div className="text-[10px] text-muted uppercase mt-0.5">Students Trained {project.targetStudents ? `(Goal: ${project.targetStudents})` : ''}</div>
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
