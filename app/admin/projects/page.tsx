import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllProjectsForAdmin } from '@/lib/db/projects';
import { AdminProjectsTable } from '@/components/AdminProjectsTable';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Admin Projects Moderation — TechForKids',
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const projects = await getAllProjectsForAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Initiative Moderation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Project Moderation & Publishing ({projects.length})
        </h1>
        <p className="text-xs text-slate-500">
          Enforce child safeguarding standards, itemized need specifications, and budget realities.
        </p>
      </div>

      <AdminProjectsTable initialProjects={projects} />

    </div>
  );
}
