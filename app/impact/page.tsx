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
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

export const metadata = {
  title: 'Public Ledger & Impact Audit — DesiLearCode',
  description: 'Real-time verified platform metrics and learning lab audit reports across partnered childcare centers.',
};

export default async function ImpactDashboardPage() {
  const [reports, metrics] = await Promise.all([
    getVerifiedImpactReports(),
    getPlatformImpactMetrics(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>PUBLIC ACCOUNTABILITY LEDGER • 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Transparency & Impact Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Aggregated progress across all partnered community learning hubs, hardware deployments, and verified mentorship hours calculated directly from production PostgreSQL records.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-muted uppercase">Hardware</span>
            <Laptop className="w-4 h-4 text-primary-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">{metrics.devicesReceivedCount}</div>
          <p className="text-[11px] text-muted font-mono">Tracked in lifecycle ledger</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-muted uppercase">Students</span>
            <Users className="w-4 h-4 text-success-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">{metrics.studentsReachedEstimate}</div>
          <p className="text-[11px] text-muted font-mono">Aggregated cohort tally</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-muted uppercase">Mentors</span>
            <Clock className="w-4 h-4 text-accent-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">{metrics.volunteersCount}</div>
          <p className="text-[11px] text-muted font-mono">STEM & coding instructors</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-muted uppercase">NGO Labs</span>
            <Building2 className="w-4 h-4 text-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">{metrics.verifiedOrgsCount}</div>
          <p className="text-[11px] text-muted font-mono">Statutory verified non-profits</p>
        </div>
      </div>

      {/* Verified Impact Reports */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-primary-600">Audited Milestones</span>
          <h2 className="text-lg font-bold text-foreground">Published Lab Impact Reports</h2>
        </div>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-surface rounded-xl p-5 border border-border space-y-3 shadow-panel">
                <div className="flex justify-between items-center text-xs font-mono text-muted">
                  <span className="font-bold text-foreground">{report.organizationName}</span>
                  <span className="bg-surfaceSubtle px-2 py-0.5 rounded border border-border">{report.period}</span>
                </div>

                <h3 className="text-sm font-bold text-foreground">{report.headline}</h3>
                <p className="text-xs text-muted leading-relaxed">{report.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-surfaceSubtle p-2.5 rounded-md border border-border font-mono">
                  <div>BEFORE: <span className="text-muted">{report.beforeState}</span></div>
                  <div>AFTER: <span className="text-success-700 font-bold">{report.afterState}</span></div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-success-700 font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                    <span>VERIFIED OUTCOME</span>
                  </div>
                  <Link href={`/projects`} className="text-xs font-medium text-foreground hover:underline">
                    View Initiative &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface rounded-xl border border-border text-center space-y-1 text-xs font-mono text-muted">
            <p>No quarterly impact reports published yet.</p>
            <p>Once partner organizations complete quarterly learning checkpoints, audit ledgers appear here.</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <SafeguardingBanner />
      </div>

    </div>
  );
}
