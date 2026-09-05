import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjectsForOrg } from '@/lib/db/projects';
import { getDevicesForOrg } from '@/lib/db/devices';
import { VerificationBadge, StatusBadge } from '@/components/VerificationBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { 
  Building2, 
  Layers, 
  Laptop, 
  UserCheck, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HardDrive,
  FileCheck2,
  Calendar
} from 'lucide-react';

export const metadata = {
  title: 'NGO Operator Console — DesiLearCode',
};

export default async function NgoDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('user_id', user.id)
    .single();

  if (!profile) redirect('/login');

  const org = profile.organizations;
  const orgProjects = org ? await getProjectsForOrg(org.id) : [];
  const orgDevices = org ? await getDevicesForOrg(org.id) : [];

  const pendingApprovalProjects = orgProjects.filter(p => p.status === 'pending_approval');
  const activeProjects = orgProjects.filter(p => p.status === 'active');
  const devicesInRepair = orgDevices.filter(d => d.status === 'Repair' || d.status === 'Inspection');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Operator Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-primary-50 text-primary-700 px-2 py-0.5 rounded border border-primary-200">
              OPERATOR HUB
            </span>
            {org && <VerificationBadge status={org.verification_status} size="sm" />}
          </div>
          <h1 className="text-xl font-display font-bold text-foreground">
            {org ? org.name : 'Organization Workspace'}
          </h1>
          <p className="text-xs font-mono text-muted">
            {org ? `REG: ${org.registration_number || 'PENDING'} • REGION: ${org.location}` : 'Initiative and hardware allocation console'}
          </p>
        </div>

        {org && (
          <div className="flex items-center gap-2">
            <Link
              href="/ngo/projects/new"
              className="px-3.5 py-2 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Initiative</span>
            </Link>
          </div>
        )}
      </div>

      {org ? (
        <>
          {/* OPERATOR ACTION QUEUE */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-foreground">
                Daily Operator Queue
              </span>
              <span className="text-[11px] font-mono text-muted">LIVE STATUS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-2.5 text-xs">
                <Layers className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{activeProjects.length} Active Initiatives</strong>
                  <span className="text-muted text-[11px]">
                    {pendingApprovalProjects.length > 0 
                      ? `${pendingApprovalProjects.length} proposals awaiting admin audit` 
                      : 'All proposals reviewed'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-2.5 text-xs">
                <Laptop className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{orgDevices.length} Hardware Assets</strong>
                  <span className="text-muted text-[11px]">
                    {devicesInRepair.length > 0 
                      ? `${devicesInRepair.length} in hub preparation` 
                      : 'All assigned devices operational'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surfaceSubtle rounded-lg border border-border flex items-start gap-2.5 text-xs">
                <FileCheck2 className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Milestone Ledger</strong>
                  <span className="text-muted text-[11px]">Next disbursement report check in 14 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Managed Initiatives Stream */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-surfaceSubtle border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wide font-mono">
                  Managed Learning Initiatives
                </h3>
              </div>
              <Link href="/ngo/projects" className="text-xs font-mono text-muted hover:text-foreground">
                ALL INITIATIVES &rarr;
              </Link>
            </div>

            {orgProjects.length > 0 ? (
              <div className="divide-y divide-border">
                {orgProjects.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surfaceSubtle/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{p.title}</span>
                        <StatusBadge status={p.status} size="sm" />
                      </div>
                      <p className="text-xs text-muted line-clamp-1 max-w-lg">{p.tagline}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="w-32 text-right hidden sm:block">
                        <div className="text-xs font-mono font-bold text-foreground">₹{p.currentValue.toLocaleString()}</div>
                        <div className="text-[10px] font-mono text-muted">{p.progressPercentage}% funded</div>
                      </div>

                      <Link
                        href={`/projects/${p.slug}`}
                        className="py-1 px-3 rounded bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-mono text-xs transition-colors"
                      >
                        Public View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-muted space-y-2">
                <p>No educational initiatives submitted yet.</p>
                <Link
                  href="/ngo/projects/new"
                  className="inline-block px-3 py-1.5 rounded bg-foreground text-surface text-xs font-medium"
                >
                  Create First Initiative
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-surface p-8 rounded-xl border border-border text-center space-y-3 max-w-lg mx-auto">
          <Building2 className="w-8 h-8 text-muted mx-auto" />
          <h2 className="text-base font-bold text-foreground">Institutional Onboarding Required</h2>
          <p className="text-xs text-muted leading-relaxed">
            To create initiatives and request hardware allocations, please register your verified child-care organization.
          </p>
          <div className="pt-1">
            <Link
              href="/contact"
              className="px-4 py-2 rounded-md bg-foreground text-surface text-xs font-medium inline-block"
            >
              Submit Onboarding Verification
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
