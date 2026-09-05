import React from 'react';
import { getOpenNeeds } from '@/lib/db/needs';
import { getPublicProjects } from '@/lib/db/projects';
import { NeedsList } from '@/components/NeedsList';

export const metadata = {
  title: 'Needs Marketplace — TechForKids',
  description: 'Tangible technology, laptop, and mentorship needs requested by verified educational centers.',
};

export default async function NeedsPage() {
  const [needs, projects] = await Promise.all([
    getOpenNeeds(),
    getPublicProjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Transparent Needs Registry
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Live Needs Marketplace
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Explore individual tangible requirements requested by verified childcare centers. You can fulfill specific laptops, mentor hours, hardware kits, or educational guides directly.
        </p>
      </div>

      <NeedsList initialNeeds={needs} projects={projects} />
    </div>
  );
}
