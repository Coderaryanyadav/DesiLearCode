'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  Laptop, 
  UserCheck, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function NgoDashboardPage() {
  const { currentUser } = useAuth();
  const { projects, needs, devices, volunteerProfiles, organizations } = useStore();

  const org = organizations.find(o => o.id === currentUser.organizationId) || organizations[0];
  const orgProjects = projects.filter(p => p.organizationId === org.id);
  const orgNeeds = needs.filter(n => n.organizationId === org.id);
  const orgDevices = devices.filter(d => d.assignedOrgName === org.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              NGO Partner Command Center
            </span>
            <VerificationBadge status={org.verificationStatus} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {org.name}
          </h1>
          <p className="text-xs text-slate-500">
            Registration: {org.registrationNumber} • {org.location}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/ngo/projects/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
          <Link
            href="/ngo/impact"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
          >
            Submit Impact Report
          </Link>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
        <Link href="/ngo/dashboard" className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
          Overview
        </Link>
        <Link href="/ngo/projects" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Manage Projects ({orgProjects.length})
        </Link>
        <Link href="/ngo/needs" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Open Needs ({orgNeeds.length})
        </Link>
        <Link href="/ngo/volunteers" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Volunteer Roster
        </Link>
        <Link href="/ngo/impact" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 shrink-0">
          Impact Reports
        </Link>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{orgProjects.length}</div>
          <div className="text-xs font-bold text-slate-700">Active Initiatives</div>
          <p className="text-[11px] text-slate-500">Supervised learning labs</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{org.devicesReceived}</div>
          <div className="text-xs font-bold text-slate-700">Devices Allocated</div>
          <p className="text-[11px] text-slate-500">Wiped & active in lab</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{orgNeeds.length}</div>
          <div className="text-xs font-bold text-slate-700">Open Needs</div>
          <p className="text-[11px] text-slate-500">Hardware & mentor slots</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">{org.studentsReached}</div>
          <div className="text-xs font-bold text-slate-700">Students Reached</div>
          <p className="text-[11px] text-slate-500">Aggregated active cohort</p>
        </div>
      </div>

      {/* Projects Overview List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Managed Initiatives</h2>
            <p className="text-xs text-slate-500">Update milestones, post safeguarding-compliant progress, or add specific needs.</p>
          </div>
          <Link href="/ngo/projects/new" className="text-xs font-bold text-indigo-600 hover:underline">
            + New Initiative
          </Link>
        </div>

        <div className="space-y-4">
          {orgProjects.map((proj) => (
            <div key={proj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {proj.category}
                  </span>
                  <StatusBadge status={proj.status} />
                  <span className="text-xs text-slate-500">{proj.targetStudents} Students</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                <div className="max-w-md">
                  <ProgressBar
                    percentage={proj.progressPercentage}
                    labelLeft={`₹${proj.currentValue.toLocaleString()} raised`}
                    labelRight={`Goal: ₹${proj.goalValue.toLocaleString()}`}
                    size="sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/ngo/projects/${proj.id}`}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Manage Project
                </Link>
                <Link
                  href={`/projects/${proj.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Public View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
