'use client';

import React from 'react';
import Link from 'next/link';
import { Organization } from '@/lib/types';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, Users, Laptop, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OrganizationCard: React.FC<{ org: Organization }> = ({ org }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Banner */}
        <div className="relative h-32 w-full bg-slate-100">
          <img
            src={org.heroImageUrl}
            alt={org.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <div className="absolute top-3 right-3">
            <VerificationBadge status={org.verificationStatus} size="sm" />
          </div>
        </div>

        {/* Logo & Info */}
        <div className="p-5 pt-0 relative">
          <div className="-mt-8 mb-3 flex items-end justify-between">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-slate-200 overflow-hidden">
              <img
                src={org.logoUrl}
                alt={org.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {org.registrationNumber}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug">
            {org.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{org.location}</span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {org.tagline}
          </p>

          {/* Programs */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {org.programs.map((prog, idx) => (
              <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-100 font-medium">
                {prog}
              </span>
            ))}
          </div>

          {/* Verified Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="text-xs font-bold text-slate-900">{org.studentsReached}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-tight">Students</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="text-xs font-bold text-indigo-600">{org.devicesReceived}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-tight">Devices</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="text-xs font-bold text-emerald-600">{org.activeProjectsCount}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-tight">Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 bg-white border-t border-slate-100">
        <Link
          href={`/projects?org=${encodeURIComponent(org.name)}`}
          className="w-full py-2 text-center text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center justify-center gap-1.5"
        >
          <span>View Active Initiatives</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
