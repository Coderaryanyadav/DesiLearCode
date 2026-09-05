import React from 'react';
import Link from 'next/link';
import { getVerifiedImpactReports, getPlatformImpactMetrics } from '@/lib/db/impact';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { 
  Laptop, 
  Users, 
  Clock, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const metadata = {
  title: 'Transparency & Impact Dashboard — TechForKids',
  description: 'Real-time verified platform statistics and impact reports across child learning centers.',
};

export default async function ImpactDashboardPage() {
  const [reports, metrics] = await Promise.all([
    getVerifiedImpactReports(),
    getPlatformImpactMetrics(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Public Accountability & Verification
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Transparency & Impact Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Aggregated progress across all partnered community learning hubs, hardware deployments, and verified mentorship hours calculated directly from PostgreSQL records.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{metrics.devicesReceivedCount}</div>
          <div className="text-xs font-bold text-slate-700">Computers Provided</div>
          <p className="text-[11px] text-slate-500">Tracked in lifecycle ledger</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{metrics.studentsReachedEstimate}</div>
          <div className="text-xs font-bold text-slate-700">Students Reached</div>
          <p className="text-[11px] text-slate-500">Aggregated cohort tally</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{metrics.volunteersCount}</div>
          <div className="text-xs font-bold text-slate-700">Registered Mentors</div>
          <p className="text-[11px] text-slate-500">STEM & coding instructors</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{metrics.verifiedOrgsCount}</div>
          <div className="text-xs font-bold text-slate-700">Verified Organizations</div>
          <p className="text-[11px] text-slate-500">Statutory verified non-profits</p>
        </div>
      </div>

      {/* Verified Impact Reports */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Audited Milestones</span>
          <h2 className="text-2xl font-bold text-slate-900">Published Impact Reports</h2>
        </div>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-bold text-indigo-600">{report.organizationName}</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">{report.period}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{report.headline}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{report.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>Before: <span className="text-slate-600">{report.beforeState}</span></div>
                  <div>After: <span className="text-emerald-700 font-semibold">{report.afterState}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Verified</span>
                  </div>
                  <Link href={`/projects`} className="font-semibold text-indigo-600 hover:underline">
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-2 text-xs text-slate-500">
            <p>No verified periodic impact reports published yet.</p>
            <p>Once partner organizations complete quarterly learning checkpoints, reports will appear here.</p>
          </div>
        )}
      </div>

      <div className="pt-4">
        <SafeguardingBanner />
      </div>

    </div>
  );
}
