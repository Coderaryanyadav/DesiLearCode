import React from 'react';
import { getPublicProjects } from '@/lib/db/projects';
import { ProjectsList } from '@/components/ProjectsList';

export const metadata = {
  title: 'Community Tech & Education Projects — TechForKids',
  description: 'Explore verified community projects providing computer labs, coding education, hardware donations, and mentorship to children in need.',
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Project Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Verified Community Projects
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Every project listed below has been verified with organizational documentation, transparent hardware targets, and vetted child safeguarding protocols.
        </p>
      </div>

      {/* Projects interactive list */}
      <ProjectsList initialProjects={projects} />
    </div>
  );
}
