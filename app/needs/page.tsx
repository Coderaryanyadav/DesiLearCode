import React from 'react';
import { getOpenNeeds } from '@/lib/db/needs';
import { getPublicProjects } from '@/lib/db/projects';
import { NeedsList } from '@/components/NeedsList';

export const metadata = {
  title: 'Hardware & Educational Inventory Needs — DesiLearCode',
  description: 'Itemized computing equipment, laptop allocations, and STEM mentorship requirements requested by verified learning centers.',
};

export default async function NeedsPage() {
  const [needs, projects] = await Promise.all([
    getOpenNeeds(),
    getPublicProjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Editorial Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>ITEMIZED ALLOCATION REGISTRY • 2026</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Itemized Hardware & Lab Requirements
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          Targeted equipment needs requested by verified grassroots learning centers. Sponsor an individual device, pledge a spare laptop, or support mentor hours.
        </p>
      </div>

      <NeedsList initialNeeds={needs} projects={projects} />
    </div>
  );
}
