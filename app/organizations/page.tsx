'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { OrganizationCard } from '@/components/OrganizationCard';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { Building2, ShieldCheck, Search, CheckCircle2, FileCheck } from 'lucide-react';

export default function OrganizationsPage() {
  const { organizations } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'verified' | 'under_review'>('All');

  const filtered = organizations.filter((org) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || org.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Institutional Vetting
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Verified Partner Organizations & NGOs
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Every organization on TechForKids undergoes statutory validation (Registration Deeds, 12A/80G status, physical infrastructure audit, and Child Safeguarding commitment) before publishing initiatives.
        </p>
      </div>

      {/* Verification Standard Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md">
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-white block font-semibold text-sm">1. Legal & Tax Audit</strong>
            <span className="text-slate-400">Trust registration deed, 80G tax-exemption verification, and audited financials.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-white block font-semibold text-sm">2. Child Safeguarding Charter</strong>
            <span className="text-slate-400">Zero-PII compliance, mentor background vetting, and designated child protection officers.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-white block font-semibold text-sm">3. Physical Center Verification</strong>
            <span className="text-slate-400">Supervised classrooms with surge protection and mentor attendance tracking.</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations by name or region..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              filterStatus === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({organizations.length})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              filterStatus === 'verified' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Verified Only
          </button>
          <button
            onClick={() => setFilterStatus('under_review')}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              filterStatus === 'under_review' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Under Review
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>

      {/* Safeguarding notice */}
      <SafeguardingBanner />

    </div>
  );
}
