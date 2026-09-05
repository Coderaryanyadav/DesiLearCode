import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getVolunteerProfileForUser } from '@/lib/db/volunteers';
import { UserCheck, Clock, Award, Users, Plus, CheckCircle2, ArrowLeft, Code } from 'lucide-react';

export const metadata = {
  title: 'Volunteer Mentorship Tracker — DesiLearCode',
};

export default async function DashboardVolunteeringPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getVolunteerProfileForUser(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Volunteer Mentorship Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Volunteer Service & Mentorship Tracker
          </h1>
          <p className="text-xs text-slate-500">
            Track your verified teaching hours, workshop milestones, and application statuses.
          </p>
        </div>

        <Link
          href="/volunteer"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
        >
          Browse Open Roles
        </Link>
      </div>

      {profile ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{profile.hoursVolunteered} hrs</div>
              <div className="text-xs font-bold text-slate-700">Verified Service Hours</div>
              <p className="text-[11px] text-slate-500">Formally audited by NGO coordinator</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{profile.workshopsCompleted}</div>
              <div className="text-xs font-bold text-slate-700">Workshops Completed</div>
              <p className="text-[11px] text-slate-500">Coding & STEM tracks</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{profile.studentsReached}</div>
              <div className="text-xs font-bold text-slate-700">Students Guided</div>
              <p className="text-[11px] text-slate-500">Aggregate classroom cohorts</p>
            </div>
          </div>

          {/* Applications list */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Your Mentorship Applications</h3>
            {profile.applications.length > 0 ? (
              <div className="space-y-3">
                {profile.applications.map((app) => (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{app.projectTitle}</div>
                      <div className="text-[11px] text-slate-500">{app.organizationName}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold uppercase text-[10px]">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                You haven&apos;t applied for any specific project opportunities yet. <Link href="/volunteer" className="text-indigo-600 font-bold hover:underline">Explore open roles</Link>.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <Code className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">You haven&apos;t registered as a mentor yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Submit your volunteer profile with your subject skills and preferred languages to start mentoring children.
          </p>
          <Link
            href="/volunteer/apply"
            className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md"
          >
            Submit Volunteer Application
          </Link>
        </div>
      )}

    </div>
  );
}
