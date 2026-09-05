'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const SafeguardingBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-indigo-950 text-indigo-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white font-semibold">Child Safety & Zero-PII Policy:</strong> All metrics are aggregated. Child identities, private addresses, and personal records are strictly protected.
          </span>
        </div>
        <Link 
          href="/safeguarding" 
          className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 underline underline-offset-2"
        >
          Safeguarding Standards <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-emerald-50/50 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">Strict Child Safeguarding & Privacy Commitment</h4>
              <span className="text-[11px] font-semibold tracking-wide bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Zero PII
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              TechForKids adheres to stringent digital protection frameworks. We never publish child names, sensitive case files, exact shelter addresses, or unconsented media. Contributions directly fund verified non-profit partners with physical and legal vetting.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/safeguarding"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition shadow-sm"
          >
            Read Safeguarding Charter
          </Link>
          <Link
            href="/contact?topic=safeguarding"
            className="text-xs font-semibold px-3 py-2 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition"
          >
            Report Concern
          </Link>
        </div>
      </div>
    </div>
  );
};
