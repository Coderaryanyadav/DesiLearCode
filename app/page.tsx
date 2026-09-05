import React from 'react';
import { getPublicProjects } from '@/lib/db/projects';
import { getPlatformImpactMetrics } from '@/lib/db/impact';
import { HomeView } from '@/components/HomeView';

export const metadata = {
  title: 'DesiLearCode — Technology. Education. Opportunity.',
  description: 'A transparent, privacy-first platform connecting donors, mentors, and verified child-care organizations to provide technology access and coding education.',
};

export default async function HomePage() {
  const [projects, metrics] = await Promise.all([
    getPublicProjects(),
    getPlatformImpactMetrics(),
  ]);

  const featuredProjects = projects.slice(0, 3);

  return (
    <HomeView
      featuredProjects={featuredProjects}
      metrics={metrics}
    />
  );
}
