import React from 'react';
import Link from 'next/link';
import { getActiveVolunteerOpportunities } from '@/lib/db/volunteers';
import { 
  Code, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Users, 
  Laptop, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const metadata = {
  title: 'Volunteer & Mentor — DesiLearCode',
  description: 'Volunteer your technical skills to teach programming, digital literacy, and STEM to enthusiastic young learners.',
};

export default async function VolunteerLandingPage() {
  const volunteerOpportunities = await getActiveVolunteerOpportunities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="bg-foreground rounded-[2rem] p-8 sm:p-16 text-surface text-center space-y-6 shadow-card relative overflow-hidden">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-success-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/10 text-surface text-xs font-bold border border-surface/20 shadow-sm backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-primary-300" />
            <span className="tracking-wide">Tech & Skills Mentorship</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Your Knowledge Can Shape a Young Innovator&apos;s Journey
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed mt-6">
            Volunteer 2 to 4 hours a week to teach coding, computational thinking, robotics, cyber safety, or basic digital literacy to enthusiastic children in verified care centers.
          </p>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteer/apply"
              className="px-8 py-4 rounded-2xl bg-primary-500 hover:bg-primary-400 text-surface font-extrabold text-sm transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2.5"
            >
              <Code className="w-5 h-5" />
              <span>Apply to Volunteer</span>
            </Link>
            <a
              href="#opportunities"
              className="px-8 py-4 rounded-2xl bg-surface/10 hover:bg-surface/20 text-surface font-bold text-sm transition-all border border-surface/20 backdrop-blur-sm"
            >
              Browse Open Roles
            </a>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Volunteering */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft space-y-4 hover:border-primary-200 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <Laptop className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Practical Hands-on Curriculum</h3>
          <p className="text-sm text-muted leading-relaxed">
            We provide structured lesson guides (Scratch block coding, foundational Python, robotics) so you can focus on inspiring rather than prepping materials from scratch.
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft space-y-4 hover:border-success-200 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center border border-success-100 group-hover:bg-success-600 group-hover:text-white transition-colors">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Flexible Scheduling</h3>
          <p className="text-sm text-muted leading-relaxed">
            Join online weekend workshops or visit nearby verified physical computer labs in your city. Commitment is 2–4 hours per week.
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft space-y-4 hover:border-info-200 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-info-50 text-info-600 flex items-center justify-center border border-info-100 group-hover:bg-info-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Child Safeguarding Vetted</h3>
          <p className="text-sm text-muted leading-relaxed">
            All volunteer interactions take place in supervised environments with strict zero-individual-PII policies to protect children and mentors alike.
          </p>
        </div>
      </div>

      {/* Open Roles Section */}
      <div id="opportunities" className="space-y-8 scroll-mt-24">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full">
            Active Openings
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
            Open Volunteer Mentorship Opportunities
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl">
            Apply directly to a specific learning center project or submit a general volunteer application.
          </p>
        </div>

        {volunteerOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteerOpportunities.map((opp) => (
              <div key={opp.id} className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6 flex flex-col justify-between hover:shadow-card-hover hover:border-primary-200 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span className="font-bold text-primary-600">{opp.organizationName}</span>
                    <span className="bg-surfaceHover border border-border px-3 py-1 rounded-full font-semibold capitalize">{opp.mode}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-foreground">{opp.roleTitle}</h3>
                  <p className="text-sm text-muted line-clamp-3 leading-relaxed">{opp.description}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {opp.skillsRequired.map((skill, idx) => (
                      <span key={idx} className="text-xs font-bold bg-surfaceHover text-foreground px-3 py-1.5 rounded-xl border border-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm font-medium text-muted flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>{opp.hoursPerWeek} hrs/week • {opp.durationWeeks} weeks</span>
                  </div>
                  <Link
                    href={`/volunteer/apply?opp=${opp.id}`}
                    className="px-5 py-2.5 rounded-xl bg-foreground hover:bg-foreground/90 text-surface font-bold text-sm transition-all shadow-card text-center"
                  >
                    Apply for Role
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-surface rounded-3xl border border-border text-center space-y-4 shadow-soft">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-primary-100">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">General Volunteer Applications Open</h3>
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              Submit your general mentorship profile and our education coordinators will match you with upcoming classes.
            </p>
            <div className="pt-4">
              <Link
                href="/volunteer/apply"
                className="inline-block px-8 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-colors shadow-sm"
              >
                Start General Application
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
