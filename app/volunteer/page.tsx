'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Code, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Users, 
  Laptop, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function VolunteerLandingPage() {
  const { volunteerOpportunities } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-14 text-white text-center space-y-5 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-800/80 text-indigo-200 text-xs font-bold border border-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tech & Skills Mentorship</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Your Knowledge Can Shape a Young Innovator&apos;s Journey
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Volunteer 2 to 4 hours a week to teach coding, computational thinking, robotics, cyber safety, or basic digital literacy to enthusiastic children in verified care centers.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/volunteer/apply"
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            <span>Apply to Volunteer</span>
          </Link>
          <a
            href="#opportunities"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition border border-white/20"
          >
            Browse Open Roles
          </a>
        </div>
      </div>

      {/* 3 Pillars of Volunteering */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Flexible Weekend Commitments</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Workshops are structured in concise 90-minute weekend modules with ready-to-use open curricula, minimizing preparation overhead for busy working professionals.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Safeguarded Environments</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every session is supervised by center coordinators. Strict privacy guidelines protect both volunteers and young participants.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified Service Recognition</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Log verified teaching hours and receive digitally signed mentorship certificates recognized by corporate CSR and educational councils.
          </p>
        </div>
      </div>

      {/* Open Opportunities Section */}
      <div id="opportunities" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Open Mentorship Roles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Current Teaching & Advisory Openings
            </h2>
          </div>
          <Link
            href="/volunteer/apply"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            General Application Form →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {volunteerOpportunities.map((opp) => (
            <div key={opp.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-card-hover transition space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {opp.mode.replace('_', ' ').toUpperCase()} • {opp.region}
                  </span>
                  <span className="text-xs font-bold text-indigo-600">{opp.openings} Openings</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{opp.roleTitle}</h3>
                
                <p className="text-xs text-slate-500">
                  Project: <strong className="text-slate-800">{opp.projectTitle}</strong>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{opp.hoursPerWeek} hrs/week • {opp.durationWeeks} weeks</span>
                <Link
                  href={`/volunteer/apply?opp=${opp.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
