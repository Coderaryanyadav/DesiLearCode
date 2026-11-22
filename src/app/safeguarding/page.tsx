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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
          <span>ZERO-PII CHILD SAFEGUARDING FRAMEWORK</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Child Protection & Privacy Governance
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Because this platform serves vulnerable and orphaned children, safeguarding, dignity, and digital privacy are our foremost non-negotiable architectural requirements.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-border space-y-2.5 shadow-panel">
          <div className="w-8 h-8 rounded-md bg-surfaceSubtle text-primary-600 flex items-center justify-center border border-border">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-foreground text-sm">1. Strict Zero-PII Data Policy</h3>
          <p className="text-xs text-muted leading-relaxed">
            DesiLearCode strictly prohibits individual public profiles of children. We never disclose full names, birth dates, phone numbers, private emails, medical records, government ID numbers, or exact shelter addresses. All outcomes are communicated via aggregated statistical cohorts.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2.5 shadow-panel">
          <div className="w-8 h-8 rounded-md bg-surfaceSubtle text-success-600 flex items-center justify-center border border-border">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-foreground text-sm">2. Institutional Consent & Media Protocol</h3>
          <p className="text-xs text-muted leading-relaxed">
            All media depicting classroom activities requires institutional guardian authorization. We emphasize group learning interactions, hands-on hardware, coding screens, and robotics kits rather than focus on individual faces.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2.5 shadow-panel">
          <div className="w-8 h-8 rounded-md bg-surfaceSubtle text-accent-600 flex items-center justify-center border border-border">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-foreground text-sm">3. Supervised Mentorship Guidelines</h3>
          <p className="text-xs text-muted leading-relaxed">
            Volunteer mentors never engage in 1-on-1 unmonitored communication with minors. All remote and in-person sessions occur in structured group settings with verified NGO staff facilitators present.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-border space-y-2.5 shadow-panel">
          <div className="w-8 h-8 rounded-md bg-surfaceSubtle text-error-600 flex items-center justify-center border border-border">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-foreground text-sm">4. Confidential Whistleblower Escalation</h3>
          <p className="text-xs text-muted leading-relaxed">
            Anyone observing a privacy violation, inappropriate content, or unauthorized direct communication can submit a confidential incident report below for immediate investigation by our safeguarding officer.
          </p>
        </div>
      </div>

      {/* Incident Intake Form */}
      <div className="bg-surface p-6 sm:p-8 rounded-xl border border-border shadow-panel space-y-5">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-error-600">Confidential Escalation</span>
          <h2 className="text-lg font-bold text-foreground mt-0.5">Report a Safeguarding or Privacy Concern</h2>
          <p className="text-xs text-muted">
            Reports submitted here are routed directly and confidentially to our platform safeguarding officer.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 bg-success-50 rounded-xl border border-success-200 text-success-900 space-y-2 text-center">
            <div className="w-10 h-10 bg-success-100 text-success-600 rounded-lg flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold">Report Received in Confidential Queue</h3>
            <p className="text-xs text-success-800 max-w-md mx-auto">
              Our child protection officers review all submissions promptly. For immediate emergencies, please contact local authorities.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Anonymous or your name"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Email for Follow-up (Optional)</label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Subject Area</label>
                <select
                  value={subjectType}
                  onChange={(e: any) => setSubjectType(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                >
                  <option value="project">Project Content / Update</option>
                  <option value="organization">Partner Organization</option>
                  <option value="volunteer">Volunteer Mentorship Interaction</option>
                  <option value="content">Photo / PII Exposure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Project / Entity ID (If known)</label>
                <input
                  type="text"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="e.g. Pune Coding Lab"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Incident or Concern Details</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide specific details regarding what was observed, URL, or time of interaction..."
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-error-600 hover:bg-error-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
