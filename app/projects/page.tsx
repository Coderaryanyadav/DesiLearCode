import React from 'react';
import { getPublicProjects } from '@/lib/db/projects';
import { ProjectsList } from '@/components/ProjectsList';

export const metadata = {
  title: 'Open Initiatives & Computer Labs — DesiLearCode',
  description: 'Explore verified learning initiatives providing computer labs, coding education, hardware donations, and mentorship across India.',
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Editorial Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>NATIONAL DIRECTORY • VERIFIED LABS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Verified Learning Initiatives
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          Every initiative is physically inspected, itemized for specific hardware allocations, and governed under milestone-gated public ledgers with Zero-PII child privacy.
        </p>
      </div>

      {/* Interactive Projects List */}
      <ProjectsList initialProjects={projects} />
    </div>
  );
}
