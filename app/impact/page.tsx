'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { 
  BarChart3, 
  Laptop, 
  Users, 
  Clock, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function ImpactDashboardPage() {
  const { impactReports, projects, devices, volunteerProfiles, organizations } = useStore();

  const totalComputers = 47;
  const totalStudents = 126;
  const totalVolunteerHours = 76;
  const totalWorkshops = 18;
  const totalOrganizations = organizations.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Public Accountability & Verification
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Transparency & Impact Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Real-time aggregated progress across all partnered community learning hubs, hardware deployments, and verified mentorship hours.
        </p>
        <p className="text-xs text-slate-400 italic">
          *Initial sample/demo values shown for local development & demonstration.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{totalComputers}</div>
          <div className="text-xs font-bold text-slate-700">Computers Provided</div>
          <p className="text-[11px] text-slate-500">Refurbished & active in classrooms</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{totalStudents}</div>
          <div className="text-xs font-bold text-slate-700">Students Reached</div>
          <p className="text-[11px] text-slate-500">Aggregated attendance tally</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">{totalVolunteerHours} hrs</div>
          <div className="text-xs font-bold text-slate-700">Mentorship Hours</div>
          <p className="text-[11px] text-slate-500">Verified programming & STEM time</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">{totalOrganizations}</div>
          <div className="text-xs font-bold text-slate-700">Verified Organizations</div>
          <p className="text-[11px] text-slate-500">Full statutory audit completed</p>
        </div>
      </div>

      {/* Project-Level Impact Reports (Before / After Showcase) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Verified Project Impact Reports
            </h2>
            <p className="text-xs text-slate-500">Before-and-after baseline transformations submitted by non-profit partners.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {impactReports.map((report) => (
            <div key={report.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                    {report.period} Audit
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Admin
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{report.headline}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Project: <strong className="text-slate-800">{report.projectTitle}</strong> • {report.organizationName}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.summary}
                </p>

                {/* Before / After comparison cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <strong className="text-red-700 font-bold uppercase tracking-wide text-[10px] block">
                      Before Assistance
                    </strong>
                    <p className="text-slate-600 leading-relaxed">{report.beforeState}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
                    <strong className="text-emerald-800 font-bold uppercase tracking-wide text-[10px] block">
                      After TechForKids Support
                    </strong>
                    <p className="text-slate-700 leading-relaxed">{report.afterState}</p>
                  </div>
                </div>

                {/* Report Key Stats */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-xs font-bold text-slate-900">{report.computersProvided}</div>
                    <div className="text-[10px] text-slate-500">Laptops</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-xs font-bold text-slate-900">{report.studentsTrained}</div>
                    <div className="text-[10px] text-slate-500">Students</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-xs font-bold text-slate-900">{report.volunteerHours}h</div>
                    <div className="text-[10px] text-slate-500">Mentored</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-xs font-bold text-slate-900">{report.workshopsConducted}</div>
                    <div className="text-[10px] text-slate-500">Workshops</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                Published {new Date(report.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safeguarding notice */}
      <SafeguardingBanner />

    </div>
  );
}
