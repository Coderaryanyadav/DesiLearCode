'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { ProgressBar } from './ProgressBar';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, Users, Laptop, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const ProjectCard: React.FC<{ project: Project; onSupportClick?: (project: Project) => void }> = ({ 
  project, 
  onSupportClick 
}) => {
  const openNeedsCount = project.needs.filter(n => !n.fulfilled).length;

  return (
    <div className="group bg-surface rounded-3xl border border-border overflow-hidden hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Project Image Header */}
        <div className="relative h-48 w-full bg-surfaceHover overflow-hidden border-b border-border">
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface/90 text-foreground backdrop-blur-md shadow-card border border-border">
              {project.category}
            </span>
            {project.urgency === 'critical' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error-500 text-white shadow-card flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Urgent
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-foreground flex justify-between items-end">
            <div className="flex items-center gap-1.5 text-xs text-muted font-medium bg-surface/90 px-2.5 py-1 rounded-lg backdrop-blur-md border border-border">
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span className="truncate max-w-[150px]">{project.region}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-surface/90 px-2.5 py-1 rounded-lg backdrop-blur-md border border-border">
              <Users className="w-3.5 h-3.5 text-info-500" />
              <span>{project.targetStudents} Students</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          {/* Organization & Verification */}
          <div className="flex items-center justify-between gap-2">
            <Link 
              href={`/organizations`} 
              className="text-xs font-semibold text-muted hover:text-primary-600 truncate flex items-center gap-1.5 transition-colors"
            >
              <span>{project.organizationName}</span>
            </Link>
            {project.organizationVerified && (
              <VerificationBadge status="verified" showText={false} size="sm" />
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="font-display font-bold text-foreground text-lg leading-tight group-hover:text-primary-600 transition-colors">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p className="text-sm text-muted line-clamp-2 mt-2 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Needs Chips */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Specific Needs</span>
              <span className="text-primary-600 font-bold">{openNeedsCount} unfulfilled</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.needs.slice(0, 3).map((need) => (
                <span 
                  key={need.id} 
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                    need.fulfilled 
                      ? 'bg-success-50 text-success-700 border-success-200 line-through opacity-60'
                      : 'bg-surfaceHover text-foreground border-border hover:border-primary-200'
                  }`}
                >
                  {need.title}
                </span>
              ))}
              {project.needs.length > 3 && (
                <span className="text-xs px-2.5 py-1 rounded-lg text-muted bg-surfaceHover font-medium border border-transparent">
                  +{project.needs.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4 border-t border-border mt-4">
            <ProgressBar
              percentage={project.progressPercentage}
              labelLeft={`₹${project.currentValue.toLocaleString()} raised`}
              labelRight={`Goal: ₹${project.goalValue.toLocaleString()}`}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0 bg-surface flex items-center gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="flex-1 py-2.5 px-4 text-center text-sm font-semibold rounded-xl bg-surfaceHover hover:bg-border text-foreground transition-all flex items-center justify-center gap-2"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
          className="py-2.5 px-5 text-sm font-semibold rounded-xl bg-foreground hover:bg-foreground/90 text-surface transition-all shadow-card"
        >
          Support
        </button>
      </div>
    </div>
  );
};
