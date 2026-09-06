'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { VerificationBadge, StatusBadge } from './VerificationBadge';
import { MapPin, Users, Laptop, ArrowRight, ShieldCheck, Clock, CheckCircle2, ChevronRight, Layers, Coins } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSupportClick?: (project: Project) => void;
}

/**
 * 1. Standard Project Card (Clean, disciplined border-based surface)
 * Answers: WHAT, WHERE, WHO, NEED, HOW MUCH (Remaining gap), PROGRESS, ACTIONS
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const primaryNeed = project.needs && project.needs.length > 0 
    ? project.needs.find(n => !n.fulfilled) || project.needs[0]
    : null;

  const neededCount = primaryNeed ? primaryNeed.quantityRequired : 0;
  const securedCount = primaryNeed ? primaryNeed.quantityFulfilled : 0;
  const remainingCount = primaryNeed ? Math.max(0, neededCount - securedCount) : 0;
  const needUnit = primaryNeed?.unit || 'Units';
  const needTitle = primaryNeed ? primaryNeed.title : 'Required Learning Hardware';
  const needPercentage = neededCount > 0 
    ? Math.min(100, Math.round((securedCount / neededCount) * 100))
    : project.progressPercentage;

  return (
    <div className="group bg-surface rounded-xl border border-border hover:border-borderMuted hover:shadow-panel transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header: Location, Category, Urgency */}
        <div className="p-4 pb-3 border-b border-border bg-surfaceSubtle flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
            <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="truncate">{project.region}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface text-muted border border-border">
              {project.category}
            </span>
            {project.urgency === 'critical' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-error-50 text-error-700 border border-error-200">
                URGENT
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          
          {/* Organization & Verification */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted truncate">
              {project.organizationName}
            </span>
            <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} showText={false} size="sm" />
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="font-display font-bold text-foreground text-base leading-snug group-hover:text-primary-600 transition-colors">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* REAL RESOURCE NEED BOX: "WHAT IS STILL NEEDED?" */}
          <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wide">
                {remainingCount > 0 
                  ? `${remainingCount} ${needUnit.toUpperCase()} STILL NEEDED` 
                  : `${neededCount} ${needUnit.toUpperCase()} TARGET`}
              </span>
              <span className="text-[11px] font-mono text-muted">
                {needTitle}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted">
                <strong className="text-foreground">{securedCount}</strong> secured
              </span>
              <span className="text-primary-600 font-bold">
                {needPercentage}% fulfilled
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${needPercentage}%` }}
              />
            </div>
          </div>

          {/* Cohort & Pledged intent */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-1">
            <span>Cohort: <strong className="text-foreground font-mono">{project.targetStudents} students</strong></span>
            <span>Pledged: <strong className="text-foreground font-mono">₹{project.currentValue.toLocaleString()}</strong></span>
          </div>

        </div>
      </div>

      {/* Action Strip: Clear Primary & Secondary Actions */}
      <div className="p-4 pt-0 bg-surface">
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
          <Link
            href={`/donate-device?projectId=${project.id}`}
            className="py-2 px-2 text-center text-xs font-semibold rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center justify-center gap-1"
          >
            <Laptop className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="truncate">Donate Device</span>
          </Link>
          <button
            onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
            className="py-2 px-2 text-center text-xs font-semibold rounded-md bg-foreground hover:bg-foreground/90 text-surface transition-colors flex items-center justify-center gap-1 shadow-subtle"
          >
            <span className="truncate">Support Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Featured Project Card (Editorial split layout for homepage & highlighted campaigns)
 */
export const FeaturedProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const primaryNeed = project.needs && project.needs.length > 0 
    ? project.needs.find(n => !n.fulfilled) || project.needs[0]
    : null;

  const neededCount = primaryNeed ? primaryNeed.quantityRequired : 0;
  const securedCount = primaryNeed ? primaryNeed.quantityFulfilled : 0;
  const remainingCount = primaryNeed ? Math.max(0, neededCount - securedCount) : 0;
  const needUnit = primaryNeed?.unit || 'Units';
  const needTitle = primaryNeed ? primaryNeed.title : 'Required Equipment';
  const needPercentage = neededCount > 0 
    ? Math.min(100, Math.round((securedCount / neededCount) * 100))
    : project.progressPercentage;

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-panel transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Column */}
        <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-[380px] bg-surfaceSubtle border-b lg:border-b-0 lg:border-r border-border">
          <Image
            src={project.heroImageUrl || '/images/default-project.jpg'}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-foreground text-surface">
              FEATURED INITIATIVE
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-surface/95 text-foreground backdrop-blur-sm border border-border">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs bg-surface/95 backdrop-blur-md p-2.5 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary-500" />
              <span className="font-medium text-foreground">{project.region}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-muted">
              <span>Target: <strong className="text-foreground">{project.targetStudents} Students</strong></span>
            </div>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted">Verified Organization:</span>
                <span className="text-xs font-bold text-foreground">{project.organizationName}</span>
              </div>
              <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} size="sm" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground leading-snug">
                <Link href={`/projects/${project.slug}`} className="hover:text-primary-600 transition-colors">
                  {project.title}
                </Link>
              </h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* NEED & GAP HIGHLIGHT */}
            <div className="p-4 rounded-xl bg-surfaceSubtle border border-border space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wide">
                  {remainingCount > 0 ? `${remainingCount} ${needUnit.toUpperCase()} STILL NEEDED` : 'TARGET RESOURCE NEED'}
                </span>
                <span className="text-xs font-mono text-muted">
                  {needTitle}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted">
                  <strong className="text-foreground">{securedCount}</strong> secured of {neededCount}
                </span>
                <span className="text-primary-600 font-bold">
                  {remainingCount} remaining gap
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${needPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-muted pt-0.5">
                <span>{needPercentage}% fulfilled</span>
                <span>Pledged: ₹{project.currentValue.toLocaleString()} / ₹{project.goalValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Problem & Goal summary */}
            <div className="text-xs text-muted leading-relaxed">
              {project.whyItMatters || project.description.slice(0, 160) + '...'}
            </div>
          </div>

          {/* Direct Help Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/donate-device?projectId=${project.id}`}
                className="py-3 px-4 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-medium text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <Laptop className="w-4 h-4 text-primary-600" />
                <span>Donate a Device</span>
              </Link>
              <button
                onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
                className="py-3 px-4 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs text-center transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Support Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <Link href={`/projects/${project.slug}`} className="text-xs text-muted hover:text-foreground font-medium underline">
                Open full project case file &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Project List Row (Dense table/list row for catalog searching & administrative views)
 */
export const ProjectListRow: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const primaryNeed = project.needs && project.needs.length > 0 
    ? project.needs.find(n => !n.fulfilled) || project.needs[0]
    : null;

  const neededCount = primaryNeed ? primaryNeed.quantityRequired : 0;
  const securedCount = primaryNeed ? primaryNeed.quantityFulfilled : 0;
  const remainingCount = primaryNeed ? Math.max(0, neededCount - securedCount) : 0;

  return (
    <div className="p-4 bg-surface rounded-lg border border-border hover:border-borderMuted hover:shadow-subtle transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className="relative w-12 h-12 rounded bg-surfaceSubtle border border-border shrink-0 overflow-hidden hidden sm:block">
          <Image src={project.heroImageUrl || '/images/default-project.jpg'} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={project.status} size="sm" />
            <span className="text-xs font-semibold text-foreground">{project.category}</span>
            <span className="text-muted text-xs">• {project.region}</span>
          </div>
          <h4 className="font-bold text-sm text-foreground hover:text-primary-600">
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h4>
          <div className="text-xs text-muted truncate max-w-md">
            {project.organizationName}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 self-end md:self-center shrink-0">
        <div className="w-48 text-right hidden lg:block">
          {primaryNeed ? (
            <div className="text-xs font-mono font-bold text-foreground">
              {remainingCount} {primaryNeed.unit || 'units'} needed
            </div>
          ) : (
            <div className="text-xs font-mono font-bold text-foreground">₹{project.currentValue.toLocaleString()}</div>
          )}
          <div className="text-[11px] font-mono text-muted">
            {securedCount} secured • {project.progressPercentage}%
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/donate-device?projectId=${project.id}`}
            className="py-1.5 px-2.5 rounded text-xs font-medium bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center gap-1"
          >
            <Laptop className="w-3 h-3 text-primary-600" />
            <span>Donate</span>
          </Link>
          <Link
            href={`/projects/${project.slug}`}
            className="py-1.5 px-2.5 rounded text-xs font-medium bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors"
          >
            Dossier
          </Link>
          <button
            onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
            className="py-1.5 px-3 rounded text-xs font-medium bg-foreground text-surface hover:bg-foreground/90 transition-colors shadow-subtle"
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Project Compact Card (For sidebars, related projects, dashboard widgets)
 */
export const CompactProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link 
      href={`/projects/${project.slug}`}
      className="block p-3 bg-surface rounded-lg border border-border hover:border-borderMuted hover:shadow-subtle transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded bg-surfaceSubtle border border-border shrink-0 overflow-hidden">
          <Image src={project.heroImageUrl || '/images/default-project.jpg'} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-xs font-bold text-foreground truncate">{project.title}</h5>
          <div className="text-[11px] text-muted truncate mt-0.5">{project.organizationName}</div>
          <div className="flex items-center justify-between text-[10px] font-mono text-muted mt-1">
            <span>{project.targetStudents} students</span>
            <span className="text-primary-600 font-bold">{project.progressPercentage}% funded</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * 5. Project Impact Card (Outcome & Verification summary)
 */
export const ProjectImpactCard: React.FC<{
  title: string;
  organization: string;
  location: string;
  studentsReached: number;
  devicesDeployed: number;
  verifiedDate: string;
}> = ({ title, organization, location, studentsReached, devicesDeployed, verifiedDate }) => {
  return (
    <div className="p-5 bg-surface rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-success-700 bg-success-50 px-2 py-0.5 rounded border border-success-200">
          <CheckCircle2 className="w-3 h-3" /> VERIFIED OUTCOME
        </span>
        <span className="text-[11px] font-mono text-muted">{verifiedDate}</span>
      </div>

      <div>
        <h4 className="font-bold text-sm text-foreground">{title}</h4>
        <div className="text-xs text-muted mt-0.5">{organization} • {location}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
        <div className="p-2.5 rounded bg-surfaceSubtle text-center">
          <div className="text-base font-mono font-bold text-foreground">{studentsReached}</div>
          <div className="text-[11px] text-muted">Students Trained</div>
        </div>
        <div className="p-2.5 rounded bg-surfaceSubtle text-center">
          <div className="text-base font-mono font-bold text-foreground">{devicesDeployed}</div>
          <div className="text-[11px] text-muted">Devices Active</div>
        </div>
      </div>
    </div>
  );
};
