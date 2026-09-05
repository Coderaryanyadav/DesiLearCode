'use client';

import React from 'react';
import Link from 'next/link';
import { Organization } from '@/lib/types';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, Users, Laptop, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OrganizationCard: React.FC<{ org: Organization }> = ({ org }) => {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden hover:border-borderMuted hover:shadow-panel transition-all flex flex-col justify-between">
      <div>
        {/* Banner */}
        <div className="relative h-28 w-full bg-surfaceSubtle border-b border-border">
          <img
            src={org.heroImageUrl || '/images/default-org.jpg'}
            alt={org.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2.5 right-2.5">
            <VerificationBadge status={org.verificationStatus} size="sm" />
          </div>
        </div>

        {/* Logo & Entity Meta */}
        <div className="p-5 pt-0 relative">
          <div className="-mt-6 mb-3 flex items-end justify-between">
            <div className="w-12 h-12 rounded-lg bg-surface p-0.5 border border-border shadow-subtle overflow-hidden">
              <img
                src={org.logoUrl || '/logo.jpg'}
                alt={org.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="text-[10px] font-mono text-muted bg-surfaceSubtle px-2 py-0.5 rounded border border-border">
              REG: {org.registrationNumber || 'VERIFIED-ENTITY'}
            </span>
          </div>

          <h3 className="font-bold text-foreground text-base leading-snug">
            {org.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted mt-1 mb-2 font-mono">
            <MapPin className="w-3 h-3 text-primary-500 shrink-0" />
            <span className="truncate">{org.location}</span>
          </div>

          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {org.tagline}
          </p>

          {/* Programs */}
          {org.programs && org.programs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {org.programs.slice(0, 3).map((prog, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-surfaceSubtle text-foreground border border-border font-medium">
                  {prog}
                </span>
              ))}
            </div>
          )}

          {/* Institutional Metrics */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-border text-center">
            <div className="p-1.5 rounded bg-surfaceSubtle">
              <div className="text-xs font-mono font-bold text-foreground">{org.studentsReached}</div>
              <div className="text-[10px] text-muted">Learners</div>
            </div>
            <div className="p-1.5 rounded bg-surfaceSubtle">
              <div className="text-xs font-mono font-bold text-primary-600">{org.devicesReceived}</div>
              <div className="text-[10px] text-muted">Devices</div>
            </div>
            <div className="p-1.5 rounded bg-surfaceSubtle">
              <div className="text-xs font-mono font-bold text-success-600">{org.activeProjectsCount}</div>
              <div className="text-[10px] text-muted">Labs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 bg-surface">
        <Link
          href={`/projects?org=${encodeURIComponent(org.name)}`}
          className="w-full py-2 text-center text-xs font-medium rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border transition-colors flex items-center justify-center gap-1.5"
        >
          <span>View Verified Labs</span>
          <ExternalLink className="w-3 h-3 text-muted" />
        </Link>
      </div>
    </div>
  );
};
