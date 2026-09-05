'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, CheckCircle2, ShieldCheck, BarChart3, Send } from 'lucide-react';

export default function NgoSubmitImpactPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { projects, publishImpactReport, organizations } = useStore();

  const org = organizations.find(o => o.id === currentUser.organizationId) || organizations[0];
  const orgProjects = projects.filter(p => p.organizationId === org.id);

  const [selectedProjectId, setSelectedProjectId] = useState(orgProjects[0]?.id || projects[0]?.id);
  const [period, setPeriod] = useState('Q3 2026');
  const [headline, setHeadline] = useState('First 15 Students Complete Python Game Modules');
  const [summary, setSummary] = useState('Equipped 4 refurbished stations and conducted 8 weekend mentor workshops.');
  const [beforeState, setBeforeState] = useState('0 working computers; theoretical rote learning.');
  const [afterState, setAfterState] = useState('4 operational Linux terminals; all students built text-based interactive games.');
  const [computersProvided, setComputersProvided] = useState(4);
  const [studentsTrained, setStudentsTrained] = useState(22);
  const [volunteerHours, setVolunteerHours] = useState(16);
  const [workshopsConducted, setWorkshopsConducted] = useState(6);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === selectedProjectId) || projects[0];

    publishImpactReport({
      projectId: proj.id,
      projectTitle: proj.title,
      organizationName: org.name,
      period,
      headline,
      summary,
      beforeState,
      afterState,
      computersProvided,
      studentsTrained,
      volunteerHours,
      workshopsConducted,
    });

    setSubmitted(true);
    setTimeout(() => router.push('/impact'), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NGO Dashboard
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Outcome Reporting
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Submit Verifiable Impact Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Document before-and-after transformations and aggregate learner attendance tallies.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Impact Report Published Successfully!</h3>
          <p className="text-xs text-slate-600">Redirecting to the Public Impact Dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Initiative</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white font-semibold"
              >
                {orgProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Audit Period</label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. Q3 2026"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headline Summary *</label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. 15 Students Build First Interactive Python Barrier Alarms"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Executive Summary *</label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide context on curriculum taught, attendance, and skills gained..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-red-700 mb-1">Before Assistance Baseline *</label>
              <textarea
                rows={2}
                required
                value={beforeState}
                onChange={(e) => setBeforeState(e.target.value)}
                placeholder="e.g. 0 computers; students shared 1 smartphone intermittently..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 bg-red-50/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">After Assistance Outcome *</label>
              <textarea
                rows={2}
                required
                value={afterState}
                onChange={(e) => setAfterState(e.target.value)}
                placeholder="e.g. 5 laptops active in supervised classroom station..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Computers Installed</label>
              <input
                type="number"
                min="0"
                value={computersProvided}
                onChange={(e) => setComputersProvided(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Students Trained</label>
              <input
                type="number"
                min="1"
                value={studentsTrained}
                onChange={(e) => setStudentsTrained(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Volunteer Hours</label>
              <input
                type="number"
                min="0"
                value={volunteerHours}
                onChange={(e) => setVolunteerHours(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Workshops Held</label>
              <input
                type="number"
                min="0"
                value={workshopsConducted}
                onChange={(e) => setWorkshopsConducted(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-md shadow-emerald-600/20"
          >
            Publish Verified Impact Report
          </button>
        </form>
      )}

    </div>
  );
}
