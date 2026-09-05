import React from 'react';
import { getPublicProjects } from '@/lib/db/projects';
import { ProjectsList } from '@/components/ProjectsList';

export const metadata = {
  title: 'Community Projects — DesiLearCode',
  description: 'Explore verified community projects providing computer labs, coding education, hardware donations, and mentorship to children in need.',
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
          Project Marketplace
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-foreground tracking-tight">
          Explore Verified Community Projects
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          Every project listed below has been verified with organizational documentation, transparent hardware targets, and vetted child safeguarding protocols.
        </p>
      </div>

      {/* Projects interactive list */}
      <ProjectsList initialProjects={projects} />
    </div>
  );
}
