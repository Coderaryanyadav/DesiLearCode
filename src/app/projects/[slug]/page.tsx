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
    return { title: 'Project Not Found — DesiLearCode' };
  }
  return {
    title: `${project.title} — DesiLearCode`,
    description: project.tagline || project.description.slice(0, 150),
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-display font-bold text-foreground">Project Not Found</h2>
        <p className="text-base text-muted">The requested initiative could not be located in our active directory.</p>
        <Link href="/projects" className="inline-block px-6 py-3 rounded-xl bg-foreground text-surface font-semibold hover:bg-foreground/90 transition shadow-card">
          ← Return to Projects
        </Link>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}
