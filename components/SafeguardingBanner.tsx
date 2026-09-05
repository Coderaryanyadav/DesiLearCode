'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const SafeguardingBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-[#090c10] text-[#8b949e] px-4 py-1.5 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">ZERO-PII CHILD SAFEGUARDING:</strong> All learner data aggregated at verified lab level.
          </span>
        </div>
        <Link 
          href="/safeguarding" 
          className="text-white hover:underline flex items-center gap-1"
        >
          <span>Safeguarding Charter</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-panel">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-surfaceSubtle text-foreground rounded-md border border-border shrink-0">
            <Lock className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">Strict Child Safeguarding & Data Privacy Protocol</h4>
              <span className="text-[10px] font-mono font-bold bg-success-50 text-success-700 px-2 py-0.5 rounded border border-success-200">
                ZERO PII
              </span>
            </div>
            <p className="text-xs text-muted mt-1 max-w-3xl leading-relaxed">
              DesiLearCode strictly prohibits publishing minor faces, individual full names, or shelter GPS coordinates. Contributions directly fund verified NGO partners under milestone validation.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Link
            href="/safeguarding"
            className="text-xs font-mono font-medium px-3 py-1.5 rounded bg-surfaceSubtle border border-border text-foreground hover:bg-surfaceHover transition-colors"
          >
            Read Protocol
          </Link>
          <Link
            href="/contact?topic=safeguarding"
            className="text-xs font-mono font-medium px-3 py-1.5 rounded text-error-600 hover:bg-error-50 transition-colors"
          >
            Report Concern
          </Link>
        </div>
      </div>
    </div>
  );
};
