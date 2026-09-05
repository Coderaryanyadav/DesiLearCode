import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjectsForOrg } from '@/lib/db/projects';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { ArrowLeft, Plus, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Manage Projects — TechForKids NGO',
};

export default async function NgoProjectsListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  const orgProjects = profile?.organization_id ? await getProjectsForOrg(profile.organization_id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NGO Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Project Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Manage Initiatives ({orgProjects.length})
          </h1>
        </div>

        <Link
          href="/ngo/projects/new"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Initiative</span>
        </Link>
      </div>

      {orgProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orgProjects.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {p.category}
                  </span>
                  <StatusBadge status={p.status} />
                </div>

                <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{p.tagline}</p>

                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                    <span>Pledged ₹{p.currentValue.toLocaleString()} of ₹{p.goalValue.toLocaleString()}</span>
                    <span>{p.progressPercentage}%</span>
                  </div>
                  <ProgressBar progress={p.progressPercentage} height="h-2" showLabel={false} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/projects/${p.slug}`}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 text-xs text-slate-500 shadow-sm">
          <p>No initiatives registered yet.</p>
          <Link href="/ngo/projects/new" className="inline-block font-bold text-indigo-600 hover:underline">
            Submit a new project →
          </Link>
        </div>
      )}

    </div>
  );
}
