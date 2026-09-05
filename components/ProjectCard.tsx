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
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Project Image Header */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
              {project.category}
            </span>
            {project.urgency === 'critical' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm flex items-center gap-1">
                <Clock className="w-3 h-3" /> Urgent Need
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end">
            <div className="flex items-center gap-1 text-xs text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px]">{project.region}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
              <Users className="w-3 h-3 text-indigo-400" />
              <span>{project.targetStudents} Students</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3.5">
          {/* Organization & Verification */}
          <div className="flex items-center justify-between gap-2">
            <Link 
              href={`/organizations`} 
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 truncate flex items-center gap-1"
            >
              <span>{project.organizationName}</span>
            </Link>
            {project.organizationVerified && (
              <VerificationBadge status="verified" showText={false} size="sm" />
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Needs Chips */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Specific Needs ({project.needs.length})</span>
              <span className="text-indigo-600 font-bold">{openNeedsCount} unfulfilled</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.needs.slice(0, 3).map((need) => (
                <span 
                  key={need.id} 
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                    need.fulfilled 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 line-through opacity-70'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {need.title}
                </span>
              ))}
              {project.needs.length > 3 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-md text-slate-500 bg-slate-100 font-medium">
                  +{project.needs.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
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
      <div className="p-4 pt-0 bg-white border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/projects/${project.slug}`}
          className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => onSupportClick ? onSupportClick(project) : window.location.href = `/projects/${project.slug}`}
          className="py-2 px-4 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
        >
          Support
        </button>
      </div>
    </div>
  );
};
