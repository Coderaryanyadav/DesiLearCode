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
  title: 'Where Contributions Go — DesiLearCode',
  description: 'Verified platform metrics, equipment distributions and learning lab audit records across partner centers in India.',
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
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surfaceSubtle border border-border text-xs text-muted">
          <span>Transparency Records</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight">
          Where contributions go
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Aggregated progress across partnered community learning centers, hardware distributions, and verified mentorship hours calculated directly from real database records.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Hardware</span>
            <Laptop className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">{metrics.devicesReceivedCount}</div>
          <p className="text-xs text-muted">Devices received & routed</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Learners</span>
            <Users className="w-4 h-4 text-success-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">{metrics.studentsReachedEstimate}</div>
          <p className="text-xs text-muted">Estimated learners reached</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Mentors</span>
            <Clock className="w-4 h-4 text-accent-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">{metrics.volunteersCount}</div>
          <p className="text-xs text-muted">Volunteer coding instructors</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Partner Hubs</span>
            <Building2 className="w-4 h-4 text-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">{metrics.verifiedOrgsCount}</div>
          <p className="text-xs text-muted">Verified nonprofit partners</p>
        </div>
      </div>

      {/* Verified Impact Reports */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">Verified Evidence</span>
          <h2 className="text-xl font-bold text-foreground">Published Lab Reports</h2>
        </div>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-surface rounded-xl p-5 border border-border space-y-3 shadow-subtle">
                <div className="flex justify-between items-center text-xs text-muted">
                  <span className="font-bold text-foreground">{report.organizationName}</span>
                  <span className="bg-surfaceSubtle px-2 py-0.5 rounded border border-border">{report.period}</span>
                </div>

                <h3 className="text-sm font-bold text-foreground">{report.headline}</h3>
                <p className="text-xs text-muted leading-relaxed">{report.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-surfaceSubtle p-2.5 rounded-md border border-border">
                  <div>Before: <span className="text-muted">{report.beforeState}</span></div>
                  <div>After: <span className="text-success-700 font-bold">{report.afterState}</span></div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-success-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                    <span>Verified Milestone</span>
                  </div>
                  <Link href={`/projects`} className="text-xs font-medium text-foreground hover:underline">
                    View Project &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface rounded-xl border border-border text-center space-y-1 text-xs text-muted">
            <p>No quarterly impact reports published yet.</p>
            <p>As partner organizations complete verified learning checkpoints, verified reports appear here.</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <SafeguardingBanner />
      </div>

    </div>
  );
}
