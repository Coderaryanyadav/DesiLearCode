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
 * 1. Standard Project Card (Mobile-first stacked structure)
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const primaryNeed = project.needs && project.needs.length > 0 
    ? project.needs.find(n => !n.fulfilled) || project.needs[0]
    : null;

  const neededCount = primaryNeed ? primaryNeed.quantityRequired : 0;
  const securedCount = primaryNeed ? primaryNeed.quantityFulfilled : 0;
  const remainingCount = primaryNeed ? Math.max(0, neededCount - securedCount) : 0;
  const needUnit = primaryNeed?.unit || 'units';
  const needTitle = primaryNeed ? primaryNeed.title : 'Required Learning Equipment';
  const needPercentage = neededCount > 0 
    ? Math.min(100, Math.round((securedCount / neededCount) * 100))
    : project.progressPercentage;

  return (
    <div className="group bg-surface rounded-xl border border-border hover:border-borderMuted hover:shadow-panel transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header: Location, Category, Urgency */}
        <div className="p-3.5 pb-2.5 sm:p-4 sm:pb-3 border-b border-border bg-surfaceSubtle flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
            <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="truncate">{project.region}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface text-muted border border-border">
              {project.category}
            </span>
            {project.urgency === 'critical' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-error-50 text-error-700 border border-error-200">
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
          
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

          {/* REAL RESOURCE NEED BOX (Stacked naturally on mobile) */}
          <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-bold text-foreground">
                {neededCount > 0 
                  ? `${neededCount} ${needUnit} needed` 
                  : 'Target requirement'}
              </span>
              <span className="text-[11px] text-muted truncate max-w-[120px]">
                {needTitle}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                <strong className="text-foreground">{securedCount}</strong> secured · <strong className="text-primary-600">{remainingCount}</strong> remaining
              </span>
              <span className="font-semibold text-foreground">
                {needPercentage}%
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
          <div className="flex items-center justify-between text-xs text-muted pt-0.5">
            <span>Cohort: <strong className="text-foreground font-medium">{project.targetStudents} learners</strong></span>
            <span>Pledged: <strong className="text-foreground font-medium">₹{project.currentValue.toLocaleString()}</strong></span>
          </div>

        </div>
      </div>

      {/* Action Strip (Touch-friendly 44px on mobile) */}
      <div className="p-4 pt-0 bg-surface">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-border">
          <Link
            href={`/donate-device?projectId=${project.id}`}
            className="min-h-[44px] py-2.5 px-3 text-center text-xs font-semibold rounded-lg bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center justify-center gap-1.5 touch-target"
          >
            <Laptop className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span>Donate Device</span>
          </Link>
          <button
            onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
            className="min-h-[44px] py-2.5 px-3 text-center text-xs font-semibold rounded-lg bg-foreground hover:bg-foreground/90 text-surface transition-colors flex items-center justify-center gap-1.5 shadow-subtle touch-target"
          >
            <span>Help this project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Featured Project Card (Editorial split layout adapted for mobile)
 */
export const FeaturedProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const primaryNeed = project.needs && project.needs.length > 0 
    ? project.needs.find(n => !n.fulfilled) || project.needs[0]
    : null;

  const neededCount = primaryNeed ? primaryNeed.quantityRequired : 0;
  const securedCount = primaryNeed ? primaryNeed.quantityFulfilled : 0;
  const remainingCount = primaryNeed ? Math.max(0, neededCount - securedCount) : 0;
  const needUnit = primaryNeed?.unit || 'units';
  const needTitle = primaryNeed ? primaryNeed.title : 'Required Equipment';
  const needPercentage = neededCount > 0 
    ? Math.min(100, Math.round((securedCount / neededCount) * 100))
    : project.progressPercentage;

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-panel transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Visual Column */}
        <div className="lg:col-span-6 relative min-h-[220px] sm:min-h-[280px] lg:min-h-[380px] bg-surfaceSubtle border-b lg:border-b-0 lg:border-r border-border">
          <Image
            src={project.heroImageUrl || '/images/default-project.jpg'}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-semibold bg-foreground text-surface">
              Featured Project
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-semibold bg-surface/95 text-foreground backdrop-blur-sm border border-border">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs bg-surface/95 backdrop-blur-md p-2 sm:p-2.5 rounded-lg border border-border">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span className="font-medium text-foreground truncate">{project.region}</span>
            </div>
            <div className="text-muted shrink-0 text-[11px] sm:text-xs">
              Target: <strong className="text-foreground">{project.targetStudents} Learners</strong>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-6 p-5 sm:p-7 lg:p-8 flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs text-muted">Organization:</span>
                <span className="text-xs font-bold text-foreground truncate">{project.organizationName}</span>
              </div>
              <VerificationBadge status={project.organizationVerified ? 'verified' : 'under_review'} size="sm" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-lg sm:text-2xl text-foreground leading-snug">
                <Link href={`/projects/${project.slug}`} className="hover:text-primary-600 transition-colors">
                  {project.title}
                </Link>
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* NEED & GAP HIGHLIGHT */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-surfaceSubtle border border-border space-y-2">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-foreground">
                  {neededCount > 0 ? `${neededCount} ${needUnit} needed` : 'Target requirement'}
                </span>
                <span className="text-muted text-[11px] sm:text-xs">
                  {needTitle}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  <strong className="text-foreground">{securedCount}</strong> secured · <strong className="text-primary-600">{remainingCount}</strong> remaining
                </span>
                <span className="font-semibold text-foreground">
                  {needPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${needPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-muted pt-0.5">
                <span>Pledged: ₹{project.currentValue.toLocaleString()}</span>
                <span>{project.targetStudents} students in cohort</span>
              </div>
            </div>

            {/* Problem & Goal summary */}
            <div className="text-xs text-muted leading-relaxed line-clamp-3">
              {project.whyItMatters || project.description.slice(0, 160) + '...'}
            </div>
          </div>

          {/* Direct Help Action Buttons */}
          <div className="space-y-2.5 pt-3 sm:pt-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href={`/donate-device?projectId=${project.id}`}
                className="min-h-[44px] py-2.5 px-4 rounded-lg bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-semibold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 touch-target"
              >
                <Laptop className="w-4 h-4 text-primary-600" />
                <span>Donate a device</span>
              </Link>
              <button
                onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
                className="min-h-[44px] py-2.5 px-4 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-xs sm:text-sm text-center transition-colors shadow-subtle flex items-center justify-center gap-2 touch-target"
              >
                <span>Help this project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center pt-1">
              <Link href={`/projects/${project.slug}`} className="text-xs text-muted hover:text-foreground font-medium underline inline-block touch-target py-1">
                View project details &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Project List Row (Dense table/list row adaptable to mobile card view)
 */
export const ProjectListRow: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const primaryNeed = project.needs && project.needs.length > 0 
    ? project.needs.find(n => !n.fulfilled) || project.needs[0]
    : null;

  const neededCount = primaryNeed ? primaryNeed.quantityRequired : 0;
  const securedCount = primaryNeed ? primaryNeed.quantityFulfilled : 0;
  const remainingCount = primaryNeed ? Math.max(0, neededCount - securedCount) : 0;

  return (
    <div className="p-4 bg-surface rounded-xl border border-border hover:border-borderMuted hover:shadow-subtle transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="relative w-12 h-12 rounded-lg bg-surfaceSubtle border border-border shrink-0 overflow-hidden hidden sm:block">
          <Image src={project.heroImageUrl || '/images/default-project.jpg'} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={project.status} size="sm" />
            <span className="text-xs font-semibold text-foreground">{project.category}</span>
            <span className="text-muted text-xs">• {project.region}</span>
          </div>
          <h4 className="font-bold text-sm text-foreground hover:text-primary-600 truncate">
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h4>
          <div className="text-xs text-muted truncate max-w-md">
            {project.organizationName}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 self-stretch md:self-center shrink-0">
        <div className="w-full sm:w-48 text-left sm:text-right">
          {primaryNeed ? (
            <div className="text-xs font-bold text-foreground">
              {remainingCount} {primaryNeed.unit || 'units'} needed
            </div>
          ) : (
            <div className="text-xs font-bold text-foreground">₹{project.currentValue.toLocaleString()}</div>
          )}
          <div className="text-[11px] text-muted">
            {securedCount} secured • {project.progressPercentage}%
          </div>
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-2">
          <Link
            href={`/donate-device?projectId=${project.id}`}
            className="min-h-[40px] py-2 px-2.5 rounded-lg text-xs font-medium bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center justify-center gap-1 touch-target"
          >
            <Laptop className="w-3.5 h-3.5 text-primary-600" />
            <span>Donate</span>
          </Link>
          <Link
            href={`/projects/${project.slug}`}
            className="min-h-[40px] py-2 px-2.5 rounded-lg text-xs font-medium bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center justify-center touch-target"
          >
            Details
          </Link>
          <button
            onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
            className="min-h-[40px] py-2 px-3 rounded-lg text-xs font-medium bg-foreground text-surface hover:bg-foreground/90 transition-colors shadow-subtle flex items-center justify-center touch-target"
          >
            Help Project
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Project Compact Card
 */
export const CompactProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link 
      href={`/projects/${project.slug}`}
      className="block p-3.5 bg-surface rounded-xl border border-border hover:border-borderMuted hover:shadow-subtle transition-all touch-target"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-lg bg-surfaceSubtle border border-border shrink-0 overflow-hidden">
          <Image src={project.heroImageUrl || '/images/default-project.jpg'} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-xs font-bold text-foreground truncate">{project.title}</h5>
          <div className="text-[11px] text-muted truncate mt-0.5">{project.organizationName}</div>
          <div className="flex items-center justify-between text-[10px] text-muted mt-1">
            <span>{project.targetStudents} students</span>
            <span className="text-primary-600 font-bold">{project.progressPercentage}% funded</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * 5. Project Impact Card
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
    <div className="p-4 sm:p-5 bg-surface rounded-xl border border-border space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success-700 bg-success-50 px-2 py-0.5 rounded border border-success-200">
          <CheckCircle2 className="w-3 h-3" /> Verified Outcome
        </span>
        <span className="text-[11px] text-muted">{verifiedDate}</span>
      </div>

      <div>
        <h4 className="font-bold text-sm text-foreground">{title}</h4>
        <div className="text-xs text-muted mt-0.5">{organization} • {location}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
        <div className="p-2.5 rounded-lg bg-surfaceSubtle text-center">
          <div className="text-base font-bold text-foreground">{studentsReached}</div>
          <div className="text-[11px] text-muted">Students Trained</div>
        </div>
        <div className="p-2.5 rounded-lg bg-surfaceSubtle text-center">
          <div className="text-base font-bold text-foreground">{devicesDeployed}</div>
          <div className="text-[11px] text-muted">Devices Active</div>
        </div>
      </div>
    </div>
  );
};
