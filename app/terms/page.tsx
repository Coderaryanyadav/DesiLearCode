'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-800">
      
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Platform Agreement
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service & Code of Ethics
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: September 2026
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Verification & Representation</h2>
          <p>
            All non-profit organizations must submit authentic statutory certificates (Registration Deeds, 80G/12A certificates). Providing false information or misrepresenting beneficiary counts results in immediate permanent suspension and legal reporting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Volunteer Conduct & Minor Safety</h2>
          <p>
            Volunteers agree to strictly adhere to the Child Safeguarding Code of Conduct. Any direct, unmonitored communication with minor beneficiaries outside official supervised classroom channels is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Project-Based Support</h2>
          <p>
            Contributions represent intent-based project support allocated to verified hardware refurbishment, software kits, and internet lines.
          </p>
        </section>
      </div>

    </div>
  );
}
