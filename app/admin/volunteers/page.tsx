'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowLeft, UserCheck, ShieldCheck, Clock, Award } from 'lucide-react';

export default function AdminVolunteersPage() {
  const { volunteerProfiles } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          Mentorship Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Global Volunteer Registry ({volunteerProfiles.length})
        </h1>
        <p className="text-xs text-slate-500">
          Verify mentor background screening status, hours delivered, and safeguarding pledges.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Mentor Name</th>
                <th className="p-3.5">Key Skills</th>
                <th className="p-3.5">Availability</th>
                <th className="p-3.5">Hours Logged</th>
                <th className="p-3.5">Safeguarding Consent</th>
                <th className="p-3.5 rounded-r-xl">Active Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {volunteerProfiles.map((vol) => (
                <tr key={vol.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{vol.name}</div>
                    <span className="text-[11px] text-slate-500">{vol.email} • {vol.location}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {vol.availabilityHoursPerWeek} hrs/week ({vol.preferredMode})
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {vol.hoursVolunteered} hrs ({vol.workshopsCompleted} workshops)
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Consent
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {vol.applications.length} project placements
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
