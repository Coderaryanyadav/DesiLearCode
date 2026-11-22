import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllVolunteersForAdmin } from '@/lib/db/volunteers';
import { ArrowLeft, UserCheck, Clock, CheckCircle2, Mail, Phone } from 'lucide-react';

export const metadata = {
  title: 'Assigned Mentors — DesiLearCode NGO',
};

export default async function NgoVolunteersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const volunteers = await getAllVolunteersForAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NGO Dashboard
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          Mentorship Roster
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Assigned Volunteer Mentors ({volunteers.length})
        </h1>
        <p className="text-xs text-slate-500">
          Review verified mentors, scheduled workshop modules, and logged teaching hours.
        </p>
      </div>

      {volunteers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteers.map((vol) => (
            <div key={vol.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{vol.name}</h3>
                  <span className="text-xs text-slate-500">{vol.location} • {vol.availabilityHoursPerWeek} hrs/week</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Mentor
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {vol.skills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {vol.bio}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-xs font-bold text-slate-900">{vol.hoursVolunteered}h</div>
                  <div className="text-[10px] text-slate-500">Logged</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-xs font-bold text-slate-900">{vol.workshopsCompleted}</div>
                  <div className="text-[10px] text-slate-500">Workshops</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-xs font-bold text-slate-900">{vol.studentsReached}</div>
                  <div className="text-[10px] text-slate-500">Students</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 text-xs text-slate-500 shadow-sm">
          <p>No volunteer mentors assigned to your organization yet.</p>
        </div>
      )}

    </div>
  );
}
