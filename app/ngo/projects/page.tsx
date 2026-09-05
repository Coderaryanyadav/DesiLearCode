'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { ArrowLeft, Plus, ExternalLink, Settings } from 'lucide-react';

export default function NgoProjectsListPage() {
  const { currentUser } = useAuth();
  const { projects, organizations } = useStore();

  const org = organizations.find(o => o.id === currentUser.organizationId) || organizations[0];
  const orgProjects = projects.filter(p => p.organizationId === org.id);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orgProjects.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs">
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
                <ProgressBar
                  percentage={p.progressPercentage}
                  labelLeft={`₹${p.currentValue.toLocaleString()} raised`}
                  labelRight={`Goal: ₹${p.goalValue.toLocaleString()}`}
                  size="sm"
                />
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                <span>Target: {p.targetStudents} students</span>
                <span>{p.needs.length} itemized needs</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <Link
                href={`/ngo/projects/${p.id}`}
                className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Milestones & Needs</span>
              </Link>
              <Link
                href={`/projects/${p.slug}`}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
              >
                Public Page
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
