'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitSafeguardingReport } from '@/app/actions/safeguarding';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, FileCheck, Send, AlertCircle } from 'lucide-react';

export default function SafeguardingPage() {
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [subjectType, setSubjectType] = useState<'project' | 'organization' | 'content' | 'volunteer'>('project');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('reporterName', reporterName || 'Anonymous Reporter');
    formData.append('reporterEmail', reporterEmail || 'reporter@example.org');
    formData.append('subjectType', subjectType);
    formData.append('subjectId', subjectId || 'general_concern');
    formData.append('description', description);

    try {
      const res = await submitSafeguardingReport(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero-PII Child Protection Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Child Safeguarding & Privacy Standards
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Because this platform serves vulnerable and orphaned children, safeguarding, dignity, and digital privacy are our foremost non-negotiable architectural requirements.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">1. Strict Zero-PII Data Policy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            TechForKids strictly prohibits individual public profiles of children. We never disclose full names, birth dates, phone numbers, private emails, medical records, government ID numbers, or exact shelter addresses. All outcomes are communicated via aggregated statistical cohorts (e.g. &ldquo;30 Middle School Students&rdquo;).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">2. Verified Consent & Media Standards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All imagery depicting hands-on classroom activities requires written institutional guardian consent. We emphasize group learning interactions, hands-on hardware, coding screens, and robotics kits rather than focus on individual faces.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">3. Supervised Mentorship Protocols</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Volunteer mentors never engage in 1-on-1 unmonitored communication with minors. All remote and in-person sessions occur in structured group settings with verified NGO staff facilitators present.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">4. Direct Whistleblower & Incident Escalation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anyone who observes a privacy violation, suspicious content, or unauthorized direct communication can submit a confidential incident report below for immediate review by our safeguarding team.
          </p>
        </div>
      </div>

      {/* Incident Intake Form */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Confidential Escalation</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Report a Safeguarding or Privacy Concern</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Reports submitted here are routed directly and confidentially to our platform safeguarding officer.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-3 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Report Received in Confidential Queue</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Our child protection officers review all submissions promptly. For immediate emergencies, please contact local emergency authorities.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Anonymous or your name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email for Follow-up (Optional)</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Area</label>
                <select
                  value={subjectType}
                  onChange={(e: any) => setSubjectType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="project">Project Content / Update</option>
                  <option value="organization">Partner Organization</option>
                  <option value="volunteer">Volunteer Mentorship Interaction</option>
                  <option value="content">Photo / PII Exposure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project / Entity ID (If known)</label>
                <input
                  type="text"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="e.g. Pune Coding Lab"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Incident or Concern Details</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide specific details regarding what was observed, URL, or time of interaction..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-600/20 flex items-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Confidential Report'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
