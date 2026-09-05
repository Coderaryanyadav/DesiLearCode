'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { ProgressBar } from './ProgressBar';
import { VerificationBadge, StatusBadge } from './VerificationBadge';
import { MapPin, Users, Laptop, ArrowRight, ShieldCheck, Clock, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSupportClick?: (project: Project) => void;
}

/**
 * 1. Standard Project Card (Clean, disciplined border-based surface)
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const openNeedsCount = project.needs.filter(n => !n.fulfilled).length;

  return (
    <div className="group bg-surface rounded-xl border border-border hover:border-borderMuted hover:shadow-panel transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Project Image Banner */}
        <div className="relative h-44 w-full bg-surfaceSubtle overflow-hidden border-b border-border">
          <img
            src={project.heroImageUrl || '/images/default-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface/95 text-foreground backdrop-blur-sm border border-border">
              {project.category}
            </span>
            {project.urgency === 'critical' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-error-600 text-white flex items-center gap-1">
                <Clock className="w-3 h-3" /> URGENT
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface/95 text-muted backdrop-blur-sm border border-border font-medium text-[11px]">
              <MapPin className="w-3 h-3 text-primary-500 shrink-0" />
              <span className="truncate max-w-[140px]">{project.region}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface/95 text-foreground backdrop-blur-sm border border-border font-mono text-[11px]">
              <Users className="w-3 h-3 text-primary-500" />
              <span>{project.targetStudents} students</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3.5">
          {/* Organization & Verification */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted truncate">
              {project.organizationName}
            </span>
            {project.organizationVerified && (
              <VerificationBadge status="verified" showText={false} size="sm" />
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="font-display font-bold text-foreground text-base leading-snug group-hover:text-primary-600 transition-colors">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p className="text-xs text-muted line-clamp-2 mt-1.5 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Itemized Requirements */}
          {project.needs && project.needs.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-medium text-muted mb-1.5 flex items-center justify-between">
                <span>Required Items</span>
                <span className="text-primary-600 font-mono">{openNeedsCount} unfulfilled</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.needs.slice(0, 2).map((need) => (
                  <span 
                    key={need.id} 
                    className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                      need.fulfilled 
                        ? 'bg-success-50 text-success-700 border-success-200 line-through opacity-60'
                        : 'bg-surfaceSubtle text-foreground border-border'
                    }`}
                  >
                    {need.title}
                  </span>
                ))}
                {project.needs.length > 2 && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded text-muted bg-surfaceSubtle border border-border">
                    +{project.needs.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Funding Progress Bar */}
          <div className="pt-2 border-t border-border">
            <ProgressBar
              percentage={project.progressPercentage}
              labelLeft={`₹${project.currentValue.toLocaleString()} pledged`}
              labelRight={`Goal: ₹${project.goalValue.toLocaleString()}`}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 bg-surface flex items-center gap-2">
        <Link
          href={`/projects/${project.slug}`}
          className="flex-1 py-2 px-3 text-center text-xs font-medium rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center justify-center gap-1.5"
        >
          <span>View Spec</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted" />
        </Link>
        <button
          onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
          className="py-2 px-4 text-xs font-medium rounded-md bg-foreground hover:bg-foreground/90 text-surface transition-colors"
        >
          Pledge
        </button>
      </div>
    </div>
  );
};

/**
 * 2. Featured Project Card (Editorial split layout for homepage & highlighted campaigns)
 */
export const FeaturedProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick }) => {
  const openNeeds = project.needs.filter(n => !n.fulfilled);

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-panel transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Column */}
        <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-[380px] bg-surfaceSubtle border-b lg:border-b-0 lg:border-r border-border">
          <img
            src={project.heroImageUrl || '/images/default-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover"
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
                <span className="text-xs font-medium text-muted">Managed by</span>
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

            {/* Problem & Goal summary */}
            <div className="p-3.5 rounded-lg bg-surfaceSubtle border border-border space-y-1 text-xs">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary-500" />
                <span>Impact Objective</span>
              </div>
              <p className="text-muted leading-relaxed">
                {project.whyItMatters || project.description.slice(0, 140) + '...'}
              </p>
            </div>

            {/* Itemized Requirements */}
            {openNeeds.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted flex justify-between">
                  <span>Targeted Equipment Needed:</span>
                  <span className="font-mono text-primary-600">{openNeeds.length} items unfulfilled</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {openNeeds.slice(0, 3).map(need => (
                    <span key={need.id} className="text-xs px-2.5 py-1 rounded bg-surface border border-border text-foreground font-medium">
                      {need.title} ({need.quantityRequired} {need.unit || 'units'})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress & Actions */}
          <div className="space-y-4 pt-4 border-t border-border">
            <ProgressBar
              percentage={project.progressPercentage}
              labelLeft={`₹${project.currentValue.toLocaleString()} pledged`}
              labelRight={`Goal: ₹${project.goalValue.toLocaleString()}`}
              size="md"
            />

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="w-full sm:flex-1 py-3 px-4 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Read Full Project Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
                className="w-full sm:w-auto py-3 px-6 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs transition-colors"
              >
                Direct Support
              </button>
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
  return (
    <div className="p-4 bg-surface rounded-lg border border-border hover:border-borderMuted hover:shadow-subtle transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded bg-surfaceSubtle border border-border shrink-0 overflow-hidden hidden sm:block">
          <img src={project.heroImageUrl || '/images/default-project.jpg'} alt="" className="w-full h-full object-cover" />
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
        <div className="w-36 text-right hidden lg:block">
          <div className="text-xs font-mono font-bold text-foreground">₹{project.currentValue.toLocaleString()}</div>
          <div className="text-[11px] text-muted">{project.progressPercentage}% of ₹{project.goalValue.toLocaleString()}</div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="py-1.5 px-3 rounded text-xs font-medium bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
            className="py-1.5 px-3 rounded text-xs font-medium bg-foreground text-surface hover:bg-foreground/90 transition-colors"
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
        <div className="w-12 h-12 rounded bg-surfaceSubtle border border-border shrink-0 overflow-hidden">
          <img src={project.heroImageUrl || '/images/default-project.jpg'} alt="" className="w-full h-full object-cover" />
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
