'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowLeft, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AdminReportsPage() {
  const { safeguardingReports } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Child Protection & Flagging Queue
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Safeguarding Reports Queue ({safeguardingReports.length})
        </h1>
        <p className="text-xs text-slate-500">
          Priority confidential reports filed by community visitors, donors, or partner coordinators.
        </p>
      </div>

      {safeguardingReports.length > 0 ? (
        <div className="space-y-4">
          {safeguardingReports.map((report) => (
            <div key={report.id} className="bg-white rounded-3xl border border-red-200 p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">
                  {report.status.toUpperCase()} • Subject: {report.subjectType} ({report.subjectId})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(report.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-red-50/40 p-3.5 rounded-2xl border border-red-100">
                {report.description}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Reporter: <strong>{report.reporterName}</strong> ({report.reporterEmail})</span>
                <button
                  onClick={() => alert(`Investigation opened for report #${report.id}`)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition"
                >
                  Mark Under Investigation
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Safeguarding Queue is Clear</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active safety flags or privacy concerns reported. The confidential intake form on <code>/safeguarding</code> is active.
          </p>
        </div>
      )}

    </div>
  );
}
