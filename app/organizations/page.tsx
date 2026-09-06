import React from 'react';
import { getVerifiedOrganizations } from '@/lib/db/organizations';
import { OrganizationsList } from '@/components/OrganizationsList';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Verified Non-Profit Partners — DesiLearCode',
  description: 'Explore verified NGOs and child-care institutions providing technology access and digital education.',
};

export default async function OrganizationsPage() {
  const organizations = await getVerifiedOrganizations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>GOVERNANCE DIRECTORY • 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Verified Institutional Partners
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          Every organization on DesiLearCode undergoes legal compliance validation (Trust Deeds, Section 8/12A certificates, physical lab audits, and safeguarding agreements) before publishing initiatives.
        </p>
      </div>

      {/* Verification Protocol Banner */}
      <div className="p-6 rounded-xl bg-[#090c10] text-[#8b949e] border border-[#21262d] grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="flex items-start gap-2.5">
          <FileCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-white block font-sans font-bold">1. Legal & Non-Profit Audit</strong>
            <span className="text-[11px] text-[#8b949e] font-sans">Trust deeds and statutory compliance check.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-white block font-sans font-bold">2. Zero-PII Safeguarding</strong>
            <span className="text-[11px] text-[#8b949e] font-sans">Strict minor data anonymity and verified lab protection officers.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-white block font-sans font-bold">3. Physical Lab Inspection</strong>
            <span className="text-[11px] text-[#8b949e] font-sans">Electricity, lab security, and mentor attendance tracking.</span>
          </div>
        </div>
      </div>

      {/* Organizations interactive listing */}
      <OrganizationsList initialOrganizations={organizations} />

      {/* Safeguarding guarantee */}
      <div className="pt-2">
        <SafeguardingBanner />
      </div>

    </div>
  );
}
