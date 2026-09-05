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
          Every organization on DesiLearCode undergoes statutory validation (Registration Deeds, statutory compliance, physical infrastructure audit, and Child Safeguarding commitment) before publishing initiatives.
        </p>
      </div>

      {/* Verification Standard Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md">
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-white block font-semibold text-sm">1. Legal & Non-Profit Audit</strong>
            <span className="text-slate-400">Trust registration deeds, compliance certificates, and audited activity reports.</span>
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
            <span className="text-slate-400">Supervised classrooms with electrical surge protection and mentor attendance tracking.</span>
          </div>
        </div>
      </div>

      {/* Organizations interactive listing */}
      <OrganizationsList initialOrganizations={organizations} />

      {/* Safeguarding guarantee */}
      <div className="pt-4">
        <SafeguardingBanner />
      </div>

    </div>
  );
}
