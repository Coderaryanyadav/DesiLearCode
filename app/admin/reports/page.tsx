import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSafeguardingReportsForAdmin } from '@/lib/db/safeguarding';
import { ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Safeguarding Incident Queue — DesiLearCode Admin',
};

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const safeguardingReports = await getSafeguardingReportsForAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
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
            <div key={report.id} className="bg-white rounded-3xl border border-rose-200 p-6 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                  {report.status.toUpperCase()} • Subject: {report.subjectType} ({report.subjectId})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(report.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-rose-50/40 p-3.5 rounded-2xl border border-rose-100">
                {report.description}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Reporter: <strong>{report.reporterName}</strong> ({report.reporterEmail})</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Report ID: #{report.id.slice(0, 8)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 text-xs text-slate-500 shadow-sm">
          <ShieldAlert className="w-8 h-8 text-emerald-600 mx-auto" />
          <p>No active safeguarding or privacy incidents reported in queue.</p>
        </div>
      )}

    </div>
  );
}
