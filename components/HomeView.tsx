'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { SafeguardingBanner } from '@/components/SafeguardingBanner';
import { DonationModal } from '@/components/DonationModal';
import { Project } from '@/lib/types';
import { 
  Laptop, 
  Code, 
  BookOpen, 
  Rocket, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Lock, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface HomeViewProps {
  featuredProjects: Project[];
  metrics: {
    verifiedOrgsCount: number;
    activeProjectsCount: number;
    devicesReceivedCount: number;
    volunteersCount: number;
    studentsReachedEstimate: number;
  };
}

export const HomeView: React.FC<HomeViewProps> = ({ featuredProjects, metrics }) => {
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<Project | null>(null);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden gradient-hero border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800">Verified Nonprofit Tech & Mentorship Bridge</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Give children access to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600">technology</span>. Give them opportunity.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                TechForKids connects people, volunteers, and verified child-care organizations to provide technology, digital education, refurbished devices, and practical support to children who need it most.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 flex items-center gap-2 group"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/volunteer"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition border border-slate-200 shadow-sm flex items-center gap-2"
                >
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Become a Volunteer</span>
                </Link>

                <Link
                  href="/donate-device"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Donate a Device</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified NGO Partners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Strict Child Zero-PII Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Transparent Need Tracking</span>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white p-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80"
                    alt="Students learning coding and technology in a safe mentored computer classroom"
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold mb-1.5 backdrop-blur-md">
                      <Sparkles className="w-3 h-3" /> Hands-On Tech Education
                    </div>
                    <h3 className="text-sm font-bold">Empowering Young Minds Through Practical Skills</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Coding, robotics, and cyber safety workshops.</p>
                  </div>
                </div>

                {/* Floating interactive badge */}
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {metrics.devicesReceivedCount}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Devices Tracked in Platform</div>
                      <div className="text-[10px] text-slate-500">Live PostgreSQL ledger</div>
                    </div>
                  </div>
                  <Link href="/impact" className="text-xs font-bold text-indigo-600 hover:underline">
                    View Impact →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: 4 PATHWAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Multiple Pathways To Support
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Make an Impact in More Than One Way
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Whether you have an idle laptop, software engineering skills, or a desire to sponsor classroom connectivity, there is a verified project ready for your support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Donate Technology</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Give laptops, desktops, tablets, and monitors. Every device is professionally cleaned, refurbished, and tracked with a unique ID.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/donate-device" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                Donate a device <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Volunteer Your Skills</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teach coding, Scratch, Python, web basics, and digital problem-solving in structured weekend workshops.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/volunteer" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                Become a mentor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Support Education</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Help fund educational workbooks, STEM guides, internet lines, classroom power backups, and essential learning tools.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/needs" className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                Browse open needs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Build the Future</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Support dedicated community computer labs, robotics labs, and comprehensive multi-month youth digital literacy tracks.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/projects" className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                View all labs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CURRENT PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Live Database
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Current Active Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Every project details what is needed, why it matters, and exact progress milestones.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 w-fit"
          >
            <span>Explore All Projects</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDonate={() => setSelectedProjectForDonation(project)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No active public projects currently listed. Newly approved initiatives will appear here.
          </div>
        )}
      </section>

      {/* SECTION 4: LIVE METRICS AUDIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Live Database Ledger
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Platform Metrics
            </h2>
            <p className="text-xs text-slate-500">
              Computed directly from active PostgreSQL records with zero hardcoded statistics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{metrics.devicesReceivedCount}</div>
              <div className="text-xs font-bold text-slate-800">Devices Tracked</div>
              <p className="text-[11px] text-slate-500">Hardware in lifecycle</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{metrics.activeProjectsCount}</div>
              <div className="text-xs font-bold text-slate-800">Active Initiatives</div>
              <p className="text-[11px] text-slate-500">Labs & learning hubs</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">{metrics.volunteersCount}</div>
              <div className="text-xs font-bold text-slate-800">Volunteers & Mentors</div>
              <p className="text-[11px] text-slate-500">Registered mentors</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">{metrics.verifiedOrgsCount}</div>
              <div className="text-xs font-bold text-slate-800">Verified Organizations</div>
              <p className="text-[11px] text-slate-500">Vetted non-profit partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ETHICAL ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-50/60 rounded-3xl p-8 sm:p-12 border border-indigo-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200">
                Ethical Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Built Around Transparency & Child Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traditional fundraising often relies on emotional exploitation. TechForKids is engineered differently:
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Non-Profit Partners:</strong> Trust deeds and center audits prior to project approval.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Project-Based Transparency:</strong> Every device and resource tied to tangible itemized needs.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Child Safeguarding Charter:</strong> Zero individual PII exposure, strictly aggregated cohort statistics.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <SafeguardingBanner />
            </div>
          </div>
        </div>
      </section>

      {/* Active Donation Modal */}
      <DonationModal
        project={selectedProjectForDonation}
        isOpen={Boolean(selectedProjectForDonation)}
        onClose={() => setSelectedProjectForDonation(null)}
      />

    </div>
  );
};
