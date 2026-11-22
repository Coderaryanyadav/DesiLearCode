'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publishImpactReport } from '@/app/actions/impact';
import { ArrowLeft, CheckCircle2, ShieldCheck, BarChart3, AlertCircle } from 'lucide-react';

export default function NgoSubmitImpactPage() {
  const router = useRouter();

  const [projectId, setProjectId] = useState('');
  const [period, setPeriod] = useState('Q3 2026');
  const [headline, setHeadline] = useState('First 15 Students Complete Python Game Modules');
  const [summary, setSummary] = useState('Equipped 4 refurbished stations and conducted 8 weekend mentor workshops.');
  const [beforeState, setBeforeState] = useState('0 working computers; theoretical learning only.');
  const [afterState, setAfterState] = useState('4 operational Linux terminals; all students built text-based interactive games.');
  const [computersProvided, setComputersProvided] = useState(4);
  const [studentsTrained, setStudentsTrained] = useState(22);
  const [volunteerHours, setVolunteerHours] = useState(16);
  const [workshopsConducted, setWorkshopsConducted] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('projectId', projectId || 'b0000000-0000-0000-0000-000000000001');
    formData.append('period', period);
    formData.append('headline', headline);
    formData.append('summary', summary);
    formData.append('beforeState', beforeState);
    formData.append('afterState', afterState);
    formData.append('computersProvided', computersProvided.toString());
    formData.append('studentsTrained', studentsTrained.toString());
    formData.append('volunteerHours', volunteerHours.toString());
    formData.append('workshopsConducted', workshopsConducted.toString());

    try {
      const res = await publishImpactReport(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSubmitted(true);
        setTimeout(() => router.push('/impact'), 2000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit impact report.');
    } finally {
      setIsSubmitting(false);
    }
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
          Periodic Accountability
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Publish Verifiable Impact Report
        </h1>
        <p className="text-xs text-slate-500">
          Document measurable learning outcomes, student progress milestones, and equipment utilization.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submitted ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Impact Report Submitted for Verification</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once reviewed by platform admins, this report will appear on the public Transparency Dashboard.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              1. Report Period & Headline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quarter / Period
                </label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="e.g. Q3 2026"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Summary
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. 20 Students Completed Web Basics Track"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Narrative Summary
              </label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe workshop activities and student engagement..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              2. Before vs. After Transformation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Before Baseline
                </label>
                <textarea
                  rows={2}
                  required
                  value={beforeState}
                  onChange={(e) => setBeforeState(e.target.value)}
                  placeholder="Baseline state before lab equipment was deployed..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current / After Outcomes
                </label>
                <textarea
                  rows={2}
                  required
                  value={afterState}
                  onChange={(e) => setAfterState(e.target.value)}
                  placeholder="Measurable skills and projects built by students..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              3. Measurable Metrics (Aggregated)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Computers Active</label>
                <input
                  type="number"
                  min="0"
                  value={computersProvided}
                  onChange={(e) => setComputersProvided(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Students Reached</label>
                <input
                  type="number"
                  min="0"
                  value={studentsTrained}
                  onChange={(e) => setStudentsTrained(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Volunteer Hours</label>
                <input
                  type="number"
                  min="0"
                  value={volunteerHours}
                  onChange={(e) => setVolunteerHours(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Workshops Held</label>
                <input
                  type="number"
                  min="0"
                  value={workshopsConducted}
                  onChange={(e) => setWorkshopsConducted(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Safeguarding Guard:</strong> Never enter names or identifiable photos of children. Impact reports are reviewed by platform admins before publication.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting Report...' : 'Publish Impact Report'}
          </button>
        </form>
      )}

    </div>
  );
}
