'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-800">
      
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Data Governance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy & Data Minimization Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: September 2026 • Designed around strict child safeguarding and GDPR/DPDP principles.
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Strict Child Protection & Zero-PII Policy</h2>
          <p>
            DesiLearCode does not collect, store, or display Personally Identifiable Information (PII) of minor children. No child profiles, facial biometric captures, school locations, or foster shelter maps are published. All metrics regarding learning progress are strictly reported in aggregated cohort counts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Device Donor Data Sanitization</h2>
          <p>
            When you donate a computer, all internal storage media undergo data sanitization aligned with NIST SP 800-88 guidance to prevent data extraction. We do not inspect donor personal files. Donor contact details are used solely to issue support acknowledgement documentation and dispatch #DLC lifecycle tracking updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Information We Collect from Adults</h2>
          <p>
            We collect basic contact details from adult donors, volunteers, and NGO administrators (name, email, phone, location) solely to facilitate volunteer placement, verify organization registration deeds, and process project support pledges.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Third-Party Sharing</h2>
          <p>
            We never sell, rent, or trade personal data to third-party advertisers. Data is shared exclusively with verified NGO coordinators when a volunteer applies to their specific workshop.
          </p>
        </section>
      </div>

    </div>
  );
}
