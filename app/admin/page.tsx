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
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusBadge } from '@/components/StatusBadge';
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
  TrendingUp
} from 'lucide-react';

export const metadata = {
  title: 'Platform Administration — TechForKids',
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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600">
          This portal requires verified administrative privileges. Your current role is &ldquo;{profile?.role || 'visitor'}&rdquo;.
        </p>
        <Link href="/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
          Return to User Dashboard
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
  const totalDonationValue = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Administrative Command Center
            </span>
            <span className="text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
              Server Authenticated Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Platform Oversight & Verification Queue
          </h1>
          <p className="text-xs text-slate-500">
            Enforce statutory compliance, verify non-profit documents, moderate projects, and review immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/audit"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            Audit Trail Logs ({auditLogs.length})
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <Link href="/admin/organizations" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2">
          <div className="flex items-center justify-between">
            <Building2 className="w-5 h-5 text-indigo-600" />
            {pendingOrgs.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {pendingOrgs.length} Pending
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{organizations.length}</div>
          <div className="text-xs font-bold text-slate-700">Organizations</div>
        </Link>

        <Link href="/admin/projects" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2">
          <div className="flex items-center justify-between">
            <Layers className="w-5 h-5 text-emerald-600" />
            {pendingProjects.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {pendingProjects.length} Pending
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{projects.length}</div>
          <div className="text-xs font-bold text-slate-700">Projects</div>
        </Link>

        <Link href="/admin/devices" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2">
          <Laptop className="w-5 h-5 text-purple-600" />
          <div className="text-2xl font-extrabold text-slate-900">{devices.length}</div>
          <div className="text-xs font-bold text-slate-700">Devices Tracked</div>
        </Link>

        <Link href="/admin/donations" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2">
          <HeartHandshake className="w-5 h-5 text-amber-600" />
          <div className="text-2xl font-extrabold text-slate-900">₹{(totalDonationValue / 1000).toFixed(1)}k</div>
          <div className="text-xs font-bold text-slate-700">Donations Logged</div>
        </Link>

        <Link href="/admin/volunteers" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <div className="text-2xl font-extrabold text-slate-900">{volunteers.length}</div>
          <div className="text-xs font-bold text-slate-700">Volunteers</div>
        </Link>

        <Link href="/admin/reports" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2">
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            {safeguardingReports.filter(r => r.status === 'new').length > 0 && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                {safeguardingReports.filter(r => r.status === 'new').length} New
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{safeguardingReports.length}</div>
          <div className="text-xs font-bold text-slate-700">Safeguarding</div>
        </Link>
      </div>

      {/* Pending Reviews Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NGO Verification Queue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">NGO Verification Queue</h3>
            <Link href="/admin/organizations" className="text-xs font-bold text-indigo-600 hover:underline">
              View all ({organizations.length}) →
            </Link>
          </div>

          {pendingOrgs.length > 0 ? (
            <div className="space-y-3">
              {pendingOrgs.map((org) => (
                <div key={org.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{org.name}</div>
                    <div className="text-[11px] text-slate-500">Reg: {org.registrationNumber} • {org.location}</div>
                  </div>
                  <Link
                    href={`/admin/organizations`}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No pending organizations in verification queue.
            </div>
          )}
        </div>

        {/* Project Moderation Queue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Project Approval Queue</h3>
            <Link href="/admin/projects" className="text-xs font-bold text-indigo-600 hover:underline">
              View all ({projects.length}) →
            </Link>
          </div>

          {pendingProjects.length > 0 ? (
            <div className="space-y-3">
              {pendingProjects.map((proj) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{proj.title}</div>
                    <div className="text-[11px] text-slate-500">{proj.organizationName} • Goal: ₹{proj.goalValue.toLocaleString()}</div>
                  </div>
                  <Link
                    href={`/admin/projects`}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No projects waiting for administrative approval.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
