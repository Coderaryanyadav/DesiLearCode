'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { DonationModal } from '@/components/DonationModal';
import { Project } from '@/lib/types';
import { 
  Laptop, 
  Code, 
  BookOpen, 
  Rocket, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  LineChart
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

  // Since we don't have real impact numbers yet (as per prompt instructions to not fake data),
  // we will show explanatory metrics or the real counts from the database if they exist.
  const hasLiveMetrics = metrics.activeProjectsCount > 0 || metrics.verifiedOrgsCount > 0;

  return (
    <div className="flex flex-col bg-background min-h-screen pb-24">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50/50 via-background to-background"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-soft">
              <span className="flex w-2 h-2 rounded-full bg-success-500 relative">
                <span className="absolute inset-0 rounded-full bg-success-500 animate-ping opacity-75"></span>
              </span>
              <span className="text-xs font-semibold text-foreground tracking-wide">Platform Now Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground tracking-tight leading-[1.05]">
              Technology access for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-info-500">
                every child's future.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
              DesiLearCode connects you with verified child-care organizations to provide technology, digital education, and refurbished devices to children who need it most.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/projects"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-foreground text-surface hover:bg-foreground/90 font-medium text-sm transition-all shadow-float flex items-center justify-center gap-2"
              >
                Explore Live Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/donate-device"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-border text-foreground hover:bg-surfaceHover font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <Laptop className="w-4 h-4 text-primary-500" />
                Donate a Device
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success-500" />
                <span>Verified NGO Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary-500" />
                <span>Tracked Project Milestones</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-info-500" />
                <span>Zero-PII Child Privacy</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS (PATHWAYS) */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
              How you can make an impact
            </h2>
            <p className="text-muted text-lg">
              Support verified classrooms through equipment, mentorship, or direct funding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Pathway 1 */}
            <div className="bg-background rounded-3xl p-8 border border-border hover:shadow-soft transition-all flex flex-col h-full group">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Donate Technology</h3>
              <p className="text-muted mb-8 leading-relaxed flex-grow">
                Have an idle laptop or tablet? Every device is wiped, tracked, and assigned directly to a verified computer lab or classroom.
              </p>
              <Link href="/donate-device" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Start device donation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pathway 2 */}
            <div className="bg-background rounded-3xl p-8 border border-border hover:shadow-soft transition-all flex flex-col h-full group">
              <div className="w-12 h-12 rounded-xl bg-success-50 text-success-600 flex items-center justify-center mb-6">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Volunteer Skills</h3>
              <p className="text-muted mb-8 leading-relaxed flex-grow">
                Teach coding, robotics, or digital literacy. We match software engineers and tech professionals with structured weekend workshops.
              </p>
              <Link href="/volunteer" className="text-sm font-semibold text-success-600 hover:text-success-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Become a mentor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pathway 3 */}
            <div className="bg-background rounded-3xl p-8 border border-border hover:shadow-soft transition-all flex flex-col h-full group">
              <div className="w-12 h-12 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Support Projects</h3>
              <p className="text-muted mb-8 leading-relaxed flex-grow">
                Help fund specific, itemized needs like internet lines, smartboards, and STEM kits for newly established community labs.
              </p>
              <Link href="/projects" className="text-sm font-semibold text-warning-600 hover:text-warning-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Browse open needs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PROJECTS */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">
                Active Projects
              </h2>
              <p className="text-muted">
                Transparent initiatives led by verified NGOs. Track exact progress and resource deployment.
              </p>
            </div>
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-xl bg-surface border border-border text-foreground hover:bg-surfaceHover transition-colors flex items-center gap-2 font-medium text-sm w-fit shrink-0"
            >
              View All Projects
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSupportClick={() => setSelectedProjectForDonation(project)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface rounded-3xl border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-surfaceHover flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-muted" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No active projects yet</h3>
              <p className="text-muted max-w-md mb-6">
                We're currently onboarding new verified NGOs and setting up their initial projects. Check back soon!
              </p>
              <Link
                href="/organizations"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View our partner organizations &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: LIVE METRICS (Only show if there is real data) */}
      {hasLiveMetrics && (
        <section className="py-20 bg-surface border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
                  {metrics.activeProjectsCount}
                </div>
                <div className="text-sm font-medium text-muted uppercase tracking-wider">
                  Active Projects
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
                  {metrics.verifiedOrgsCount}
                </div>
                <div className="text-sm font-medium text-muted uppercase tracking-wider">
                  Verified NGOs
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
                  {metrics.devicesReceivedCount}
                </div>
                <div className="text-sm font-medium text-muted uppercase tracking-wider">
                  Devices Tracked
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
                  {metrics.volunteersCount}
                </div>
                <div className="text-sm font-medium text-muted uppercase tracking-wider">
                  Volunteers
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Active Donation Modal */}
      <DonationModal
        project={selectedProjectForDonation}
        isOpen={Boolean(selectedProjectForDonation)}
        onClose={() => setSelectedProjectForDonation(null)}
      />

    </div>
  );
};
