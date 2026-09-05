import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@/lib/db/projects';
import { ProjectDetailView } from '@/components/ProjectDetailView';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: 'Project Not Found — TechForKids' };
  }
  return {
    title: `${project.title} — TechForKids`,
    description: project.tagline || project.description.slice(0, 150),
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-600">The requested initiative slug could not be located in our active directory.</p>
        <Link href="/projects" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
          ← Return to Projects
        </Link>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}
