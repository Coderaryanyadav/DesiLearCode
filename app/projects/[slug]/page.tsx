'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ProgressBar } from '@/components/ProgressBar';
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { DonationModal } from '@/components/DonationModal';
import { NeedCard } from '@/components/NeedCard';
import { 
  MapPin, 
  Users, 
  Laptop, 
  HeartHandshake, 
  Code, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { projects, organizations } = useStore();

  const project = projects.find(p => p.slug === slug || p.id === slug);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [selectedNeedForDonation, setSelectedNeedForDonation] = useState<any>(null);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-600">The requested initiative slug could not be located in our active directory.</p>
        <Link href="/projects" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
          ← Return to Projects
        </Link>
      </div>
    );
  }

  const organization = organizations.find(o => o.id === project.organizationId) || organizations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/projects" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-md">{project.title}</span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              {project.urgency === 'critical' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                  Critical Priority
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight max-w-3xl leading-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <span>By {project.organizationName}</span>
                {project.organizationVerified && (
                  <VerificationBadge status="verified" showText={false} size="sm" />
                )}
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{project.region}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{project.beneficiaryGroup}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Sticky CTA Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Deep Narrative & Needs Breakdown */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Tagline Box */}
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <p className="text-sm md:text-base font-semibold text-indigo-950 leading-relaxed">
              &ldquo;{project.tagline}&rdquo;
            </p>
          </div>

          {/* Section: Specific Need Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Itemized Project Needs ({project.needs.length})
                </h2>
                <p className="text-xs text-slate-500">Exact tangible requirements verified for this initiative.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.needs.map((need) => (
                <NeedCard
                  key={need.id}
                  need={need}
                  onFulfillClick={(n) => {
                    setSelectedNeedForDonation(n);
                    setIsDonationOpen(true);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Section: Why This Matters & What Support Provides */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Comprehensive Project Scope</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-600" />
                Why This Initiative Matters
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.whyItMatters}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                What Your Support Accomplishes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.whatSupportProvides}
              </p>
            </div>
          </div>

          {/* Section: Project Milestones & Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Project Milestones & Execution Timeline</h2>
            
            <div className="space-y-4">
              {project.milestones.map((ms, idx) => (
                <div key={ms.id} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className={`p-2 rounded-xl mt-0.5 ${ms.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {ms.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-semibold text-sm">{ms.title}</strong>
                      <span className="text-[11px] font-mono text-slate-500">
                        {ms.completed ? `Completed ${ms.completedAt}` : `Target: ${ms.targetDate}`}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{ms.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Verified Updates */}
          {project.updates.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Field Progress Updates</h2>
              <div className="space-y-4">
                {project.updates.map((upd) => (
                  <div key={upd.id} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-slate-900 font-bold">{upd.title}</strong>
                      <span className="text-slate-400">{new Date(upd.postedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{upd.content}</p>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Posted by {upd.authorName}</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Safeguarding Passed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safeguarding Commitment Banner */}
          <SafeguardingBanner />

        </div>

        {/* Right Column: Sticky Action & Donation Box */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Funding Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">₹{project.currentValue.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-medium">Goal: ₹{project.goalValue.toLocaleString()}</span>
              </div>
              <div className="mt-2">
                <ProgressBar
                  percentage={project.progressPercentage}
                  size="md"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                <strong>{project.progressPercentage}% funded</strong> across hardware and mentor goals.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setSelectedNeedForDonation(null);
                  setIsDonationOpen(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Support This Project</span>
              </button>

              <Link
                href="/donate-device"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Laptop className="w-4 h-4" />
                <span>Donate a Computer / Device</span>
              </Link>

              <Link
                href="/volunteer/apply"
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4 text-indigo-600" />
                <span>Volunteer as Coding Mentor</span>
              </Link>
            </div>

            {/* Compliance Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Monetary contributions are recorded as project intent and processed through verified partner accounts with 80G tax receipts.
              </span>
            </div>
          </div>

          {/* Organization Verification Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 border border-slate-200 overflow-hidden shrink-0">
                <img src={organization.logoUrl} alt={organization.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">{organization.name}</h4>
                  <VerificationBadge status={organization.verificationStatus} showText={false} size="sm" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{organization.registrationNumber}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {organization.tagline}
            </p>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div>Location: <strong className="text-slate-800">{organization.location}</strong></div>
              <div>Contact: <strong className="text-slate-800">{organization.contactPerson}</strong></div>
            </div>
          </div>

        </div>

      </div>

      {/* Donation Intent Modal */}
      <DonationModal
        project={project}
        need={selectedNeedForDonation}
        isOpen={isDonationOpen}
        onClose={() => {
          setIsDonationOpen(false);
          setSelectedNeedForDonation(null);
        }}
      />

    </div>
  );
}
