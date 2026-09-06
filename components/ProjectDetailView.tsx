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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 pb-28 lg:pb-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/projects" className="hover:text-foreground flex items-center gap-1 transition-colors touch-target py-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Projects
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{project.title}</span>
      </div>

      {/* 1. PROJECT HEADER DOSSIER (Vertical Narrative for mobile) */}
      <div className="space-y-5 sm:space-y-6">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-surfaceSubtle border border-border text-foreground">
              {project.category}
            </span>
            <StatusBadge status={project.status} size="sm" />
            <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} size="sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted">
            <div className="flex items-center gap-1 text-foreground font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
              <span>{project.region}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Managed by <strong className="text-foreground">{project.organizationName}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-muted shrink-0" />
              <span>{project.targetStudents} learners</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl pt-1">
            {project.tagline}
          </p>
        </div>

        {/* DOMINANT "THE NEED" HIGHLIGHT */}
        <div className="p-5 sm:p-6 bg-surfaceSubtle rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 font-mono">
              Current Requirement Status
            </span>
            <span className="text-xs text-muted">
              {openNeeds.length} active requirement items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-2 space-y-1">
              <div className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground">
                {totalUnitsRemaining > 0 ? `${totalUnitsRemaining} Units Needed` : 'Lab Fully Equipped'}
              </div>
              <div className="text-xs sm:text-sm text-muted">
                {totalUnitsSecured} secured of {totalUnitsRequired} target units ({totalUnitsRequired > 0 ? Math.round((totalUnitsSecured / totalUnitsRequired) * 100) : project.progressPercentage}% fulfilled)
              </div>
            </div>

            <div className="flex flex-col justify-center sm:border-l sm:border-border sm:pl-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              <div className="text-xs text-muted font-medium">Funding intent</div>
              <div className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                ₹{project.currentValue.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted">Target: ₹{project.goalValue.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalUnitsRequired > 0 ? Math.round((totalUnitsSecured / totalUnitsRequired) * 100) : project.progressPercentage}%` }}
              />
            </div>
          </div>
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
        </div>

      </div>

      {/* 2. THE PROBLEM (Open Editorial Layout) */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
          The Problem & Educational Context
        </h2>
        
        <div className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line space-y-3">
          {project.description}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-border">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase text-muted font-mono">Why It Matters</h3>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {project.whyItMatters || 'This learning center provides foundational computing literacy, problem-solving, and practical programming skills for students without home computers.'}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase text-muted font-mono">Beneficiary Group</h3>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {project.beneficiaryGroup || `${project.targetStudents} students in ${project.region}`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. WHAT IS NEEDED (Itemized List) */}
      <div className="space-y-4 pt-4 sm:pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
            What Is Needed
          </h2>
          <span className="text-xs text-primary-600 font-semibold font-mono">
            {openNeeds.length} items unfulfilled
          </span>
        </div>

        {project.needs && project.needs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {project.needs.map((need) => (
              <NeedCard
                key={need.id}
                need={need}
                onFulfillClick={() => handleNeedDonate(need)}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 bg-surfaceSubtle rounded-xl border border-border text-xs text-muted text-center">
            General project fund active for peripheral and lab support.
          </div>
        )}
      </div>

      {/* 4. PROJECT ROADMAP */}
      <div className="space-y-4 pt-4 sm:pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
            Project Roadmap
          </h2>
          <span className="text-xs text-muted font-mono">Milestone tracker</span>
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
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-foreground">{milestone.title}</h4>
                    <span className={`text-[11px] px-2 py-0.5 rounded border ${
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
          <div className="p-4 bg-surfaceSubtle rounded-xl border border-border text-xs text-muted text-center">
            Initial hardware deployment & workshop schedule active.
          </div>
        )}
      </div>

      {/* 5. FIELD UPDATES */}
      <div className="space-y-4 pt-4 sm:pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
            Field Updates
          </h2>
          <span className="text-xs text-muted font-mono">Verified reports</span>
        </div>

        {project.updates && project.updates.length > 0 ? (
          <div className="space-y-3">
            {project.updates.map((update, idx) => (
              <div key={idx} className="p-4 bg-surfaceSubtle rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-foreground">{update.title}</strong>
                  <span className="text-muted font-mono text-[11px]">{new Date(update.postedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{update.content}</p>
                <div className="text-[11px] text-muted pt-1 flex items-center gap-1">
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
          <div className="p-4 bg-surfaceSubtle rounded-xl border border-border text-xs text-muted text-center">
            No public field updates posted yet. Subsequent updates will appear here following verification.
          </div>
        )}
      </div>

      {/* 6. VERIFIED CLASSROOM IMPACT */}
      <div className="space-y-4 pt-4 sm:pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
            Verified Classroom Impact
          </h2>
          <span className="text-xs text-muted font-mono">Classroom records</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-surfaceSubtle rounded-xl border border-border">
            <div className="text-xl font-bold text-foreground">{project.impactSummary?.studentsReached ?? 0}</div>
            <div className="text-[11px] text-muted uppercase mt-0.5">Students Trained</div>
          </div>
          <div className="p-3.5 bg-surfaceSubtle rounded-xl border border-border">
            <div className="text-xl font-bold text-foreground">{project.impactSummary?.computersInstalled || 0}</div>
            <div className="text-[11px] text-muted uppercase mt-0.5">Laptops Active</div>
          </div>
          <div className="p-3.5 bg-surfaceSubtle rounded-xl border border-border">
            <div className="text-xl font-bold text-foreground">{project.impactSummary?.volunteerHoursLogged || 0}</div>
            <div className="text-[11px] text-muted uppercase mt-0.5">Mentor Hours</div>
          </div>
          <div className="p-3.5 bg-surfaceSubtle rounded-xl border border-border">
            <div className="text-xl font-bold text-foreground">{project.impactSummary?.workshopsConducted || 0}</div>
            <div className="text-[11px] text-muted uppercase mt-0.5">Workshops Held</div>
          </div>
        </div>
      </div>

      {/* 7. HELP COMPLETE THIS PROJECT (Desktop & Mobile view) */}
      <div className="pt-6 sm:pt-8 border-t border-border space-y-5">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-lg sm:text-2xl text-foreground">
            Help complete this project
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Choose your contribution method to help this learning center reach its full capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href={`/donate-device?projectId=${project.id}`}
            className="p-4 sm:p-5 rounded-xl bg-surface border border-border hover:border-borderMuted hover:shadow-panel transition-all space-y-2.5 flex flex-col justify-between touch-target"
          >
            <div className="space-y-1.5">
              <Laptop className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-sm text-foreground">Donate a Device</h3>
              <p className="text-xs text-muted leading-relaxed">
                Provide a working laptop, desktop or tablet directly to this classroom.
              </p>
            </div>
            <div className="text-xs font-semibold text-primary-600 flex items-center gap-1 pt-1">
              <span>Donate hardware &rarr;</span>
            </div>
          </Link>

          <button
            onClick={() => {
              setSelectedNeedForDonation(null);
              setIsDonationOpen(true);
            }}
            className="p-4 sm:p-5 rounded-xl bg-surface border border-border hover:border-borderMuted hover:shadow-panel transition-all space-y-2.5 flex flex-col justify-between text-left touch-target"
          >
            <div className="space-y-1.5">
              <Coins className="w-5 h-5 text-accent-600" />
              <h3 className="font-bold text-sm text-foreground">Fund a Requirement</h3>
              <p className="text-xs text-muted leading-relaxed">
                Help fund itemized equipment, lab power upgrades or accessories.
              </p>
            </div>
            <div className="text-xs font-semibold text-accent-600 flex items-center gap-1 pt-1">
              <span>Pledge funding &rarr;</span>
            </div>
          </button>

          <Link
            href={`/volunteer/apply?projectId=${project.id}`}
            className="p-4 sm:p-5 rounded-xl bg-surface border border-border hover:border-borderMuted hover:shadow-panel transition-all space-y-2.5 flex flex-col justify-between touch-target"
          >
            <div className="space-y-1.5">
              <Code className="w-5 h-5 text-success-600" />
              <h3 className="font-bold text-sm text-foreground">Volunteer as Mentor</h3>
              <p className="text-xs text-muted leading-relaxed">
                Dedicate 2 hours per week to guide students through coding logic.
              </p>
            </div>
            <div className="text-xs font-semibold text-success-600 flex items-center gap-1 pt-1">
              <span>Apply to mentor &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* MOBILE STICKY FLOATING ACTION BAR (With safe-area padding & large touch targets) */}
      {!isDonationOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-3 safe-bottom-fixed bg-surface/95 backdrop-blur-md border-t border-border z-40 lg:hidden shadow-overlay animate-in slide-in-from-bottom-2">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
            <Link
              href={`/donate-device?projectId=${project.id}`}
              className="min-h-[44px] py-2.5 px-3 rounded-lg bg-surface border border-border text-foreground font-semibold text-xs text-center flex items-center justify-center gap-1.5 touch-target"
            >
              <Laptop className="w-4 h-4 text-primary-600" />
              <span>Donate Device</span>
            </Link>
            <button
              onClick={() => {
                setSelectedNeedForDonation(null);
                setIsDonationOpen(true);
              }}
              className="min-h-[44px] py-2.5 px-3 rounded-lg bg-foreground text-surface font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-subtle touch-target"
            >
              <Coins className="w-4 h-4 text-primary-400" />
              <span>Help Project</span>
            </button>
          </div>
        </div>
      )}

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
