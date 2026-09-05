import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllOrganizationsForAdmin } from '@/lib/db/organizations';
import { getAllProjectsForAdmin } from '@/lib/db/projects';
import { getAllDevicesForAdmin } from '@/lib/db/devices';
import { getAllDonationsForAdmin } from '@/lib/db/donations';
import { getAllVolunteersForAdmin } from '@/lib/db/volunteers';
import { getSafeguardingReportsForAdmin } from '@/lib/db/safeguarding';
import { getAuditLogsForAdmin } from '@/lib/db/audit';
import { VerificationBadge, StatusBadge } from '@/components/VerificationBadge';
import { DeviceIntakeChart } from '@/components/charts/DeviceIntakeChart';
import { 
  Shield, 
  Building2, 
  Layers, 
  Laptop, 
  HeartHandshake, 
  UserCheck, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Terminal,
  Activity,
  Filter,
  Eye,
  Sliders
} from 'lucide-react';

export const metadata = {
  title: 'Operations Command Center — DesiLearCode Admin',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 bg-error-50 text-error-600 rounded-md flex items-center justify-center mx-auto border border-error-200">
          <Shield className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Restricted Operational Console</h2>
        <p className="text-xs text-muted">
          This interface requires validated internal platform administrator credentials.
        </p>
        <Link href="/dashboard" className="inline-block px-4 py-2 rounded-md bg-foreground text-surface text-xs font-medium">
          Return to Portal
        </Link>
      </div>
    );
  }

  const [
    organizations,
    projects,
    devices,
    donations,
    volunteers,
    safeguardingReports,
    auditLogs
  ] = await Promise.all([
    getAllOrganizationsForAdmin(),
    getAllProjectsForAdmin(),
    getAllDevicesForAdmin(),
    getAllDonationsForAdmin(),
    getAllVolunteersForAdmin(),
    getSafeguardingReportsForAdmin(),
    getAuditLogsForAdmin(),
  ]);

  const pendingOrgs = organizations.filter(o => o.verificationStatus === 'under_review' || o.verificationStatus === 'pending');
  const pendingProjects = projects.filter(p => p.status === 'pending_approval');
  const pendingDevices = devices.filter(d => d.status === 'Submitted' || d.status === 'Inspection');
  const newReports = safeguardingReports.filter(r => r.status === 'new');

  const totalActionsNeeded = pendingOrgs.length + pendingProjects.length + pendingDevices.length + newReports.length;
  const totalDonationValue = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Command Center Title & Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-foreground text-surface px-2 py-0.5 rounded">
              ADMIN OPS v2.6
            </span>
            <span className="text-[10px] font-mono text-muted">
              SESSION: {profile.email} • TLS VERIFIED
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-foreground">
            Platform Operations & Verification Console
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/audit"
            className="px-3 py-1.5 rounded-md bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-mono text-xs transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-primary-500" />
            <span>Audit Trail ({auditLogs.length})</span>
          </Link>
        </div>
      </div>

      {/* TOP DOMINATING ACTION ALERT QUEUE */}
      <div className={`p-4 rounded-xl border transition-colors ${
        totalActionsNeeded > 0 
          ? 'bg-warning-50/60 border-warning-200 text-warning-950' 
          : 'bg-success-50/60 border-success-200 text-success-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center font-mono font-bold text-sm ${
              totalActionsNeeded > 0 ? 'bg-warning-500 text-white' : 'bg-success-600 text-white'
            }`}>
              {totalActionsNeeded}
            </div>
            <div>
              <h2 className="font-bold text-sm">
                {totalActionsNeeded > 0 
                  ? `${totalActionsNeeded} Priority Operations Require Attention Today`
                  : 'All Operations & Verification Queues Clear'}
              </h2>
              <div className="text-xs text-muted flex items-center gap-3 mt-0.5 font-mono">
                <span>{pendingOrgs.length} NGO audits</span>
                <span>•</span>
                <span>{pendingProjects.length} project reviews</span>
                <span>•</span>
                <span>{pendingDevices.length} device inspections</span>
                <span>•</span>
                <span>{newReports.length} safety alerts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingOrgs.length > 0 && (
              <Link href="/admin/organizations" className="px-3 py-1.5 rounded bg-warning-600 text-white font-medium text-xs hover:bg-warning-700">
                Review Orgs
              </Link>
            )}
            {pendingProjects.length > 0 && (
              <Link href="/admin/projects" className="px-3 py-1.5 rounded bg-foreground text-surface font-medium text-xs hover:bg-foreground/90">
                Review Projects
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dense System State Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link href="/admin/organizations" className="p-3.5 bg-surface rounded-lg border border-border hover:border-borderMuted transition-all space-y-1">
          <div className="text-[10px] font-mono text-muted uppercase flex justify-between">
            <span>NGOs</span>
            {pendingOrgs.length > 0 && <span className="text-warning-600 font-bold">● {pendingOrgs.length}</span>}
          </div>
          <div className="text-lg font-mono font-bold text-foreground">{organizations.length}</div>
        </Link>

        <Link href="/admin/projects" className="p-3.5 bg-surface rounded-lg border border-border hover:border-borderMuted transition-all space-y-1">
          <div className="text-[10px] font-mono text-muted uppercase flex justify-between">
            <span>Projects</span>
            {pendingProjects.length > 0 && <span className="text-warning-600 font-bold">● {pendingProjects.length}</span>}
          </div>
          <div className="text-lg font-mono font-bold text-foreground">{projects.length}</div>
        </Link>

        <Link href="/admin/devices" className="p-3.5 bg-surface rounded-lg border border-border hover:border-borderMuted transition-all space-y-1">
          <div className="text-[10px] font-mono text-muted uppercase flex justify-between">
            <span>Hardware</span>
            {pendingDevices.length > 0 && <span className="text-primary-600 font-bold">● {pendingDevices.length}</span>}
          </div>
          <div className="text-lg font-mono font-bold text-foreground">{devices.length}</div>
        </Link>

        <Link href="/admin/donations" className="p-3.5 bg-surface rounded-lg border border-border hover:border-borderMuted transition-all space-y-1">
          <div className="text-[10px] font-mono text-muted uppercase">Ledger Value</div>
          <div className="text-lg font-mono font-bold text-foreground">₹{(totalDonationValue / 1000).toFixed(1)}k</div>
        </Link>

        <Link href="/admin/volunteers" className="p-3.5 bg-surface rounded-lg border border-border hover:border-borderMuted transition-all space-y-1">
          <div className="text-[10px] font-mono text-muted uppercase">Mentors</div>
          <div className="text-lg font-mono font-bold text-foreground">{volunteers.length}</div>
        </Link>

        <Link href="/admin/reports" className="p-3.5 bg-surface rounded-lg border border-border hover:border-borderMuted transition-all space-y-1">
          <div className="text-[10px] font-mono text-muted uppercase flex justify-between">
            <span>Safeguarding</span>
            {newReports.length > 0 && <span className="text-error-600 font-bold">● {newReports.length}</span>}
          </div>
          <div className="text-lg font-mono font-bold text-foreground">{safeguardingReports.length}</div>
        </Link>
      </div>

      {/* Analytics Chart */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden p-4">
        <h3 className="font-bold text-xs text-foreground uppercase tracking-wide font-mono mb-4">Device Intake Velocity (Last 6 Months)</h3>
        <DeviceIntakeChart data={[
          { name: 'Jan', count: 4 },
          { name: 'Feb', count: 12 },
          { name: 'Mar', count: 8 },
          { name: 'Apr', count: 25 },
          { name: 'May', count: 18 },
          { name: 'Jun', count: 40 }
        ]} />
      </div>

      {/* Main Review Matrices (Two Dense Operational Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: NGO & Project Inspection Queue (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* NGO Queue */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-surfaceSubtle border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary-500" />
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wide font-mono">NGO Verification Stream</h3>
              </div>
              <Link href="/admin/organizations" className="text-[11px] font-mono text-muted hover:text-foreground">
                VIEW DIRECTORY ({organizations.length}) &rarr;
              </Link>
            </div>

            {pendingOrgs.length > 0 ? (
              <div className="divide-y divide-border">
                {pendingOrgs.slice(0, 4).map((org) => (
                  <div key={org.id} className="p-3.5 flex items-center justify-between hover:bg-surfaceSubtle/50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{org.name}</span>
                        <VerificationBadge status={org.verificationStatus} size="sm" />
                      </div>
                      <div className="text-[11px] font-mono text-muted">
                        REG: {org.registrationNumber || 'N/A'} • {org.location}
                      </div>
                    </div>
                    <Link
                      href="/admin/organizations"
                      className="px-2.5 py-1 rounded bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-mono text-[11px]"
                    >
                      Audit
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-mono text-muted">
                No NGO verification requests currently pending.
              </div>
            )}
          </div>

          {/* Project Approval Queue */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-surfaceSubtle border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-success-600" />
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wide font-mono">Project Moderation Stream</h3>
              </div>
              <Link href="/admin/projects" className="text-[11px] font-mono text-muted hover:text-foreground">
                ALL PROJECTS ({projects.length}) &rarr;
              </Link>
            </div>

            {pendingProjects.length > 0 ? (
              <div className="divide-y divide-border">
                {pendingProjects.slice(0, 4).map((proj) => (
                  <div key={proj.id} className="p-3.5 flex items-center justify-between hover:bg-surfaceSubtle/50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{proj.title}</span>
                        <StatusBadge status={proj.status} size="sm" />
                      </div>
                      <div className="text-[11px] font-mono text-muted">
                        ORG: {proj.organizationName} • GOAL: ₹{proj.goalValue.toLocaleString()}
                      </div>
                    </div>
                    <Link
                      href="/admin/projects"
                      className="px-2.5 py-1 rounded bg-surfaceSubtle hover:bg-surfaceHover text-foreground border border-border font-mono text-[11px]"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-mono text-muted">
                No initiative proposals waiting in approval queue.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Hardware Logistics & Recent Audit Trail (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Hardware Intake Feed */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-surfaceSubtle border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-primary-500" />
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wide font-mono">Hardware Intake Queue</h3>
              </div>
              <Link href="/admin/devices" className="text-[11px] font-mono text-muted hover:text-foreground">
                MANAGE ({devices.length}) &rarr;
              </Link>
            </div>

            <div className="divide-y divide-border">
              {devices.slice(0, 4).map((dev) => (
                <div key={dev.id} className="p-3 flex items-center justify-between hover:bg-surfaceSubtle/50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-foreground">#{dev.trackingCode}</span>
                      <StatusBadge status={dev.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-muted truncate max-w-[200px]">
                      {dev.manufacturer} {dev.model} ({dev.deviceType})
                    </div>
                  </div>
                  <Link
                    href="/admin/devices"
                    className="text-[11px] font-mono text-primary-600 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail Snippet */}
          <div className="bg-[#090c10] text-[#8b949e] rounded-xl border border-[#21262d] p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#21262d]">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Security Audit Ledger</span>
              </span>
              <span className="text-[10px] text-emerald-400">ENFORCED</span>
            </div>

            <div className="space-y-2">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2 bg-[#0d1117] rounded border border-[#21262d] space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-indigo-300 font-bold">{log.action}</span>
                    <span className="text-[#576071]">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-[11px] text-[#8b949e] truncate">{log.details}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
