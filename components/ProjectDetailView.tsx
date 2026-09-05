'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, NeedItem } from '@/lib/types';
import { ProgressBar } from '@/components/ProgressBar';
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusBadge } from '@/components/StatusBadge';
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
  ChevronRight, 
  AlertCircle, 
  FileCheck2, 
  Sparkles, 
  ArrowLeft 
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project }) => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [selectedNeedForDonation, setSelectedNeedForDonation] = useState<NeedItem | null>(null);

  const handleNeedDonate = (need: NeedItem) => {
    setSelectedNeedForDonation(need);
    setIsDonationOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/projects" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{project.title}</span>
      </div>

      {/* Main Grid: Left 8 Cols (Details), Right 4 Cols (Sidebar / Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: HERO, ABOUT, NEEDS, MILESTONES */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                {project.category}
              </span>
              <StatusBadge status={project.status} size="sm" />
              {project.organizationVerified && (
                <VerificationBadge status="verified" size="sm" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {project.tagline}
              </p>
            </div>

            {/* Managed by NGO card snippet */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {project.organizationName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{project.organizationName}</span>
                    <VerificationBadge status="verified" size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{project.region}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] relative shadow-inner bg-slate-900">
              <img
                src={project.heroImageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cohort: {project.targetStudents} Students</span>
              </div>
            </div>

            {/* Key Metas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Beneficiaries</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{project.targetStudents} Students</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Category</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{project.category}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Region</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">{project.region}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Safeguarding</div>
                <div className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Vetted
                </div>
              </div>
            </div>
          </div>

          {/* Section: Why it matters & Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                About This Initiative
              </h2>
              <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Why This Matters For Children</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.whyItMatters}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">What Your Support Provides</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.whatSupportProvides}
              </p>
            </div>
          </div>

          {/* Section: Needs Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Transparent Allocation</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Specific Hardware & Resource Needs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted requirements for this learning center. You can sponsor a specific item or make a general project contribution.
              </p>
            </div>

            {project.needs && project.needs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.needs.map((need) => (
                  <NeedCard
                    key={need.id}
                    need={need}
                    onFulfill={() => handleNeedDonate(need)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 text-center">
                General project support fund active.
              </div>
            )}
          </div>

          {/* Section: Milestones & Lifecycle Roadmap */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                Project Milestones & Verification Timeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Independent verification checkpoints required before subsequent phase disbursement.
              </p>
            </div>

            {project.milestones && project.milestones.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id || idx} className="relative">
                    <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      milestone.completed ? 'bg-emerald-500 text-white' : 'bg-slate-300'
                    }`}>
                      {milestone.completed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{milestone.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {milestone.targetDate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 text-center">
                Initial installation and workshop roadmap underway.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: DONATION BOX, STATS & SAFEGUARDING */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Donation Action Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-semibold">
                <span>Funded Target</span>
                <span className="text-slate-900 font-bold">{project.progressPercentage}%</span>
              </div>
              <ProgressBar progress={project.progressPercentage} height="h-3" showLabel={false} />
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">
                  ₹{project.currentValue.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">Pledged of ₹{project.goalValue.toLocaleString()} goal</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {project.status === 'active' ? 'Active Target' : 'Under Review'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedNeedForDonation(null);
                setIsDonationOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Support This Project</span>
            </button>

            <Link
              href="/volunteer/apply"
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center justify-center gap-2 text-center"
            >
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              <span>Volunteer as Coding Mentor</span>
            </Link>

            <Link
              href="/donate-device"
              className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition flex items-center justify-center gap-2 text-center border border-emerald-200"
            >
              <Laptop className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pledge Laptop for This Lab</span>
            </Link>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transparency Assured</span>
              </div>
              <p>
                100% of contributions are allocated directly to verifiable technology equipment and digital curriculum.
              </p>
            </div>
          </div>

          {/* Child Safeguarding Box */}
          <div className="bg-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safeguarding Standard</span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Zero-PII Child Protection Policy
            </h3>
            <p className="text-xs text-indigo-200/90 leading-relaxed">
              In accordance with our strict safeguarding charter, no individual child names, identifiable photographs, or addresses are published. All statistics reflect aggregate cohorts.
            </p>
            <Link
              href="/safeguarding"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white"
            >
              Learn about our child protection protocols →
            </Link>
          </div>

        </div>

      </div>

      {/* Donation Modal */}
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
};
