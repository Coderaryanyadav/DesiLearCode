import React from 'react';
import Link from 'next/link';
import { getActiveVolunteerOpportunities } from '@/lib/db/volunteers';
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

export const metadata = {
  title: 'Volunteer & Mentor — TechForKids',
  description: 'Volunteer your technical skills to teach programming, digital literacy, and STEM to enthusiastic young learners.',
};

export default async function VolunteerLandingPage() {
  const volunteerOpportunities = await getActiveVolunteerOpportunities();

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
            <Laptop className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Practical Hands-on Curriculum</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We provide structured lesson guides (Scratch block coding, foundational Python, robotics) so you can focus on inspiring rather than prepping materials from scratch.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Flexible Scheduling</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Join online weekend workshops or visit nearby verified physical computer labs in your city. Commitment is 2–4 hours per week.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Child Safeguarding Vetted</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All volunteer interactions take place in supervised environments with strict zero-individual-PII policies to protect children and mentors alike.
          </p>
        </div>
      </div>

      {/* Open Roles Section */}
      <div id="opportunities" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Active Openings
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Open Volunteer Mentorship Opportunities
          </h2>
          <p className="text-xs text-slate-500">
            Apply directly to a specific learning center project or submit a general volunteer application.
          </p>
        </div>

        {volunteerOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteerOpportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-indigo-600">{opp.organizationName}</span>
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">{opp.mode}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{opp.roleTitle}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{opp.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.skillsRequired.map((skill, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{opp.hoursPerWeek} hrs/week • {opp.durationWeeks} weeks</span>
                  </div>
                  <Link
                    href={`/volunteer/apply?opp=${opp.id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                  >
                    Apply for Role
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <h3 className="text-sm font-bold text-slate-900">General Volunteer Applications Open</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit your general mentorship profile and our education coordinators will match you with upcoming classes.
            </p>
            <Link
              href="/volunteer/apply"
              className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Start General Application
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
