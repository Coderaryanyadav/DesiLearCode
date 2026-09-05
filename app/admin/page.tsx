'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
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

export default function AdminDashboardPage() {
  const { 
    organizations, 
    projects, 
    devices, 
    donations, 
    volunteerProfiles, 
    auditLogs, 
    safeguardingReports,
    updateOrganizationStatus,
    updateProjectStatus 
  } = useStore();
  const { currentUser } = useAuth();

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
              Super Admin Mode
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
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>View Audit Logs</span>
          </Link>
          <Link
            href="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safeguarding Queue ({safeguardingReports.length})</span>
          </Link>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
        <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
          Overview
        </Link>
        <Link href="/admin/organizations" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Organizations ({organizations.length})
        </Link>
        <Link href="/admin/projects" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Projects ({projects.length})
        </Link>
        <Link href="/admin/devices" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Hardware Donations ({devices.length})
        </Link>
        <Link href="/admin/donations" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Donation Intents
        </Link>
        <Link href="/admin/volunteers" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Volunteers ({volunteerProfiles.length})
        </Link>
        <Link href="/admin/audit" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Audit Logs
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{organizations.length}</div>
          <div className="text-xs font-bold text-slate-700">Verified Organizations</div>
          <p className="text-[11px] text-amber-600 font-semibold">{pendingOrgs.length} awaiting review</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{projects.length}</div>
          <div className="text-xs font-bold text-slate-700">Total Initiatives</div>
          <p className="text-[11px] text-indigo-600 font-semibold">{pendingProjects.length} pending approval</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{devices.length}</div>
          <div className="text-xs font-bold text-slate-700">Tracked Devices</div>
          <p className="text-[11px] text-slate-500">Live #TFK hardware</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">₹{totalDonationValue.toLocaleString()}</div>
          <div className="text-xs font-bold text-slate-700">Project Support Pledges</div>
          <p className="text-[11px] text-slate-500">Issued partner receipts</p>
        </div>
      </div>

      {/* Main Moderation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Verification & Moderation Queues */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Org Verification Queue */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Organizations Pending Verification ({pendingOrgs.length})</span>
              </h2>
              <Link href="/admin/organizations" className="text-xs font-bold text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            {pendingOrgs.length > 0 ? (
              <div className="space-y-3">
                {pendingOrgs.map((org) => (
                  <div key={org.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{org.name}</h4>
                      <p className="text-[11px] text-slate-600 font-mono">{org.registrationNumber} • {org.location}</p>
                      <span className="text-[11px] text-slate-500 mt-1 block">Contact: {org.contactPerson} ({org.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateOrganizationStatus(org.id, 'verified', currentUser.name)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                      >
                        Approve & Verify
                      </button>
                      <button
                        onClick={() => updateOrganizationStatus(org.id, 'rejected', currentUser.name)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                All non-profit organization registration deeds verified!
              </div>
            )}
          </div>

          {/* Project Moderation Queue */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Projects Pending Moderation ({pendingProjects.length})</span>
              </h2>
              <Link href="/admin/projects" className="text-xs font-bold text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            {pendingProjects.length > 0 ? (
              <div className="space-y-3">
                {pendingProjects.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{p.title}</h4>
                      <p className="text-[11px] text-slate-600">{p.organizationName} • Target: ₹{p.goalValue.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateProjectStatus(p.id, 'active', currentUser.name)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                      >
                        Approve Project
                      </button>
                      <button
                        onClick={() => updateProjectStatus(p.id, 'draft', currentUser.name)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        Hold
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                No initiatives currently in moderation queue.
              </div>
            )}
          </div>

        </div>

        {/* Right: Live Audit Log Stream */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Immutable Audit Trail</span>
            </h2>
            <Link href="/admin/audit" className="text-xs font-bold text-indigo-600 hover:underline">
              Full Log →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-indigo-700 text-[11px]">{log.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700">{log.details}</p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>Actor: {log.actorName} ({log.actorRole})</span>
                  <span>Target: #{log.targetId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
