'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
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
  Cpu, 
  HeartHandshake, 
  Lock, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { projects, devices, volunteerProfiles, organizations } = useStore();
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<Project | null>(null);

  const featuredProjects = projects.filter(p => p.status === 'active').slice(0, 3);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION                                                   */}
      {/* ========================================================================= */}
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
                  <span>100% Verified NGOs</span>
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
                      47+
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Refurbished Devices In Use</div>
                      <div className="text-[10px] text-slate-500">Tracked with #TFK codes</div>
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

      {/* ========================================================================= */}
      {/* SECTION 2: MAKE AN IMPACT IN MORE THAN ONE WAY (4 CARDS)                 */}
      {/* ========================================================================= */}
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
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Donate Technology</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Give laptops, desktops, tablets, monitors, and electronics. Every device is professionally cleaned, refurbished, and tracked to its destination.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/donate-device" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                Donate a device <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Volunteer Your Skills</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teach coding, Scratch, Python, web basics, cybersecurity hygiene, and digital problem-solving in structured weekend workshops.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/volunteer" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                Become a mentor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
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

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
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

      {/* ========================================================================= */}
      {/* SECTION 3: CURRENT PROJECTS                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Real-Time Initiatives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Current Transparent Projects
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSupportClick={(proj) => setSelectedProjectForDonation(proj)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: HOW IT WORKS (5 STEPS)                                        */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 md:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3.5 py-1.5 rounded-full border border-indigo-800">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            How TechForKids Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A zero-guesswork approach ensuring verified child-care centers get practical technology with full donor visibility and child safeguarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-3 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white">NGO Needs Intake</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Registered child-care institutions articulate specific hardware, software, or mentor requirements.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-3 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Rigorous Verification</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Admins audit registration deeds, tax compliance, and child safeguarding policies prior to publishing.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-3 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Community Action</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Supporters choose: donate a device, volunteer mentor hours, or fund transparent refurbishment milestones.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-3 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-white">Refurbish & Deliver</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hardware is securely wiped, refurbished, and delivered to supervised learning stations with tracked #TFK codes.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 space-y-3 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center mb-3">
                5
              </div>
              <h4 className="text-sm font-bold text-white">Impact Reporting</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                NGOs publish verifiable student learning hours and workshop completions with zero child PII exposure.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Read the Full Verification & Refurbishment Protocol →
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: DEVICE DONATION HIGHLIGHT                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800">
                Hardware Lifecycle
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Your Old Laptop Could Become Someone&apos;s First Computer
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than letting working electronics gather dust or end up in landfills, TechForKids wipes them clean, installs child-safe educational software, and tracks them directly into supervised classrooms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure DoD-level disk wiping</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live tracking code (#TFK-XXXX)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Educational Linux & Scratch pre-installed</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Impact updates sent to donor</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/donate-device"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/20"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Start Device Donation Form</span>
                </Link>
              </div>
            </div>

            {/* Tracking Preview Visual */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded">
                  Example Tracker #TFK-104
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  Active in Classroom ✓
                </span>
              </div>
              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Device:</span>
                  <span className="font-semibold text-white">Dell Latitude 5490</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-semibold text-white">Bright Futures Learning Foundation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Classroom:</span>
                  <span className="font-semibold text-white">North Delhi Computer Lab</span>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 bg-black/20 p-3 rounded-xl">
                &ldquo;Configured with Ubuntu LTS. 32 students currently using station #3 for weekly programming lessons.&rdquo;
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: IMPACT STATISTICS                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Platform Verification Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Measurable Progress Across Classrooms
            </h2>
            <p className="text-xs text-slate-500">
              *Demo values shown for initial platform launch testing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">47</div>
              <div className="text-xs font-bold text-slate-800">Computers Provided</div>
              <p className="text-[11px] text-slate-500">Refurbished & verified</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">126</div>
              <div className="text-xs font-bold text-slate-800">Students Reached</div>
              <p className="text-[11px] text-slate-500">Aggregated cohort tally</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">18</div>
              <div className="text-xs font-bold text-slate-800">Active Volunteers</div>
              <p className="text-[11px] text-slate-500">Software & STEM mentors</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">12</div>
              <div className="text-xs font-bold text-slate-800">Workshops Held</div>
              <p className="text-[11px] text-slate-500">Coding & Cyber safety</p>
            </div>

            <div className="p-2 space-y-1 col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹184.5k</div>
              <div className="text-xs font-bold text-slate-800">Resources Supported</div>
              <p className="text-[11px] text-slate-500">Hardware & kits fulfilled</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: BUILT AROUND TRANSPARENCY                                      */}
      {/* ========================================================================= */}
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
                Traditional fundraising often relies on emotional vulnerability and unverified intermediary accounts. TechForKids is engineered differently:
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Non-Profit Partners:</strong> 80G, 12A trust deeds, and physical center checks before project approval.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Project-Based Transparency:</strong> Every dollar and device tied to tangible itemized needs.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Child Safeguarding Charter:</strong> Zero individual PII exposure, consent-verified media, and immediate reporting tools.</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/how-it-works"
                  className="px-5 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>See How We Verify Organizations</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <SafeguardingBanner />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: VOLUNTEER CTA (SKILLS SHOWCASE)                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Mentorship Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Skill Could Change a Future
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Share 2 hours a week to guide young curious minds. We match volunteers based on subject interest, language comfort, and availability.
            </p>
          </div>

          {/* Skill pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {[
              'Coding (Scratch / Python)',
              'Web Development',
              'Cybersecurity Awareness',
              'AI & Digital Tools',
              'Robotics & Arduino',
              'Computer Hardware Repair',
              'Graphic Design',
              'English Literacy',
              'Applied Mathematics',
              'Science Experiments'
            ].map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/volunteer/apply"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              <span>Apply as Volunteer Mentor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FINAL CTA                                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 rounded-3xl p-10 sm:p-16 text-white space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Help Build a More Digitally Connected Future
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Every device donated, hour mentored, and classroom equipped opens up a world of possibilities for a young learner.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/projects"
              className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 hover:bg-slate-100 font-extrabold text-sm transition shadow-md"
            >
              Explore Projects
            </Link>
            <Link
              href="/donate-device"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-sm transition shadow-md"
            >
              Donate a Device
            </Link>
            <Link
              href="/volunteer"
              className="px-6 py-3.5 rounded-2xl bg-indigo-700/80 text-white hover:bg-indigo-700 font-bold text-sm transition border border-indigo-400/40"
            >
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Active Donation Modal Trigger */}
      <DonationModal
        project={selectedProjectForDonation}
        isOpen={Boolean(selectedProjectForDonation)}
        onClose={() => setSelectedProjectForDonation(null)}
      />

    </div>
  );
}
