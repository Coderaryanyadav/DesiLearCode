import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjectsForOrg } from '@/lib/db/projects';
import { getDevicesForOrg } from '@/lib/db/devices';
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

export const metadata = {
  title: 'NGO Partner Hub — TechForKids',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              NGO Partner Command Center
            </span>
            {org && <VerificationBadge status={org.verification_status} />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {org ? org.name : 'Organization Portal'}
          </h1>
          <p className="text-xs text-slate-500">
            {org ? `Registration: ${org.registration_number} • ${org.location}` : 'Manage your education projects and hardware needs'}
          </p>
        </div>

        {org && (
          <div className="flex items-center gap-2.5">
            <Link
              href="/ngo/projects/new"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </Link>
          </div>
        )}
      </div>

      {org ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{orgProjects.length}</div>
              <div className="text-xs font-bold text-slate-700">Managed Projects</div>
              <p className="text-[11px] text-slate-500">Active & pending approval</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{orgDevices.length}</div>
              <div className="text-xs font-bold text-slate-700">Assigned Hardware</div>
              <p className="text-[11px] text-slate-500">In center computer lab</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {orgProjects.reduce((acc, curr) => acc + curr.targetStudents, 0)}
              </div>
              <div className="text-xs font-bold text-slate-700">Target Students</div>
              <p className="text-[11px] text-slate-500">Beneficiary cohort sum</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 capitalize">
                {org.verification_status}
              </div>
              <div className="text-xs font-bold text-slate-700">Verification Status</div>
              <p className="text-[11px] text-slate-500">Statutory audit standing</p>
            </div>
          </div>

          {/* Managed Projects */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Active Initiatives</h3>
                <p className="text-xs text-slate-500 mt-0.5">Projects undergo admin vetting before going public.</p>
              </div>
              <Link href="/ngo/projects" className="text-xs font-bold text-indigo-600 hover:underline">
                View all projects →
              </Link>
            </div>

            {orgProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orgProjects.map((p) => (
                  <div key={p.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-xs">{p.title}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{p.tagline}</p>
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                        <span>Pledged ₹{p.currentValue.toLocaleString()} of ₹{p.goalValue.toLocaleString()}</span>
                        <span>{p.progressPercentage}%</span>
                      </div>
                      <ProgressBar percentage={p.progressPercentage} size="sm" showLabel={false} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-xs text-slate-500 space-y-3">
                <p>No educational projects submitted yet.</p>
                <Link
                  href="/ngo/projects/new"
                  className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm"
                >
                  Create Your First Project
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Register Your Child-Care Organization</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            To create initiatives and request hardware or mentors, submit your non-profit registration details for administrative vetting.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition inline-block"
            >
              Submit NGO Onboarding Request
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
