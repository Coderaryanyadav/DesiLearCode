'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, HeartHandshake, FileCheck, Send } from 'lucide-react';

export default function SafeguardingPage() {
  const { submitSafeguardingReport } = useStore();

  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [subjectType, setSubjectType] = useState<'project' | 'organization' | 'content' | 'volunteer'>('project');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSafeguardingReport({
      reporterName,
      reporterEmail,
      subjectType,
      subjectId: subjectId || 'general_inquiry',
      description,
    });
    setSubmitted(true);
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
            TechForKids strictly prohibits public profiles of children. We never disclose full names, birth dates, phone numbers, private emails, medical records, government ID numbers, or exact foster shelter addresses. All outcomes are communicated via aggregated statistical cohorts (e.g. &ldquo;30 Middle School Students&rdquo;).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">2. Consent-Driven Responsible Storytelling</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Photographs or field stories must have explicit verified institutional guardian consent. We reject exploitative, pity-driven, or stereotyping portrayals of children, focusing exclusively on their agency, technical curiosity, and educational growth.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">3. Volunteer & Mentor Code of Conduct</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All mentors undergo identity screening, agree to supervised group-session guidelines, and are prohibited from soliciting personal contact channels or private 1-on-1 unmonitored digital conversations with minor learners.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">4. Immediate Incident Response</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Any concern or violation flagged via our reporting mechanisms triggers immediate freeze of associated initiatives and investigation by our platform administrator council.
          </p>
        </div>
      </div>

      {/* Interactive Report Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-md">
            Confidential Reporting Channel
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Report a Safeguarding or Privacy Concern</h2>
          <p className="text-xs text-slate-500 mt-1">
            If you notice any sensitive information, unauthorized photographs, or conduct concerns, please submit a report below.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Safeguarding Report Filed</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Thank you for keeping children safe. Your report has been logged in our secure administrative audit queue and assigned for immediate review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Concerned Visitor"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="e.g. reporter@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Type</label>
                <select
                  value={subjectType}
                  onChange={(e) => setSubjectType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="project">Project Initiative</option>
                  <option value="organization">Partner Organization</option>
                  <option value="content">Published Photo or Text Content</option>
                  <option value="volunteer">Volunteer Conduct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Identifier / URL</label>
                <input
                  type="text"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="e.g. Community Computer Lab Delhi"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description of Concern *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please explain the safety, privacy, or ethical concern with as much detail as possible..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md shadow-red-600/20 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Confidential Report</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
