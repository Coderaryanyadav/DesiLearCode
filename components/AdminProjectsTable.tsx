'use client';

import React, { useState } from 'react';
import { Project, ProjectStatus } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { updateProjectStatus } from '@/app/actions/projects';
import { CheckCircle2, Ban, Pause, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminProjectsTableProps {
  initialProjects: Project[];
}

export const AdminProjectsTable: React.FC<AdminProjectsTableProps> = ({ initialProjects }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    setUpdatingId(projectId);
    try {
      const res = await updateProjectStatus(projectId, newStatus, 'Approved/moderated via Admin Portal');
      if (res.success) {
        setProjects(prev =>
          prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
        );
      }
    } catch (error) {
      console.error('Failed to update project status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5 rounded-l-xl">Initiative Title</th>
              <th className="p-3.5">Organization</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Goal Budget</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 rounded-r-xl text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{p.title}</div>
                  <span className="text-[11px] text-slate-500">{p.beneficiaryGroup}</span>
                </td>
                <td className="p-3.5 text-slate-600 font-medium">{p.organizationName}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {p.category}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-slate-900">
                  ₹{p.goalValue.toLocaleString()}
                </td>
                <td className="p-3.5">
                  <StatusBadge status={p.status} size="sm" />
                </td>
                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                  {updatingId === p.id ? (
                    <span className="text-xs text-slate-400">Updating...</span>
                  ) : (
                    <>
                      {p.status !== 'active' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                      {p.status !== 'paused' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'paused')}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition inline-flex items-center gap-1"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </button>
                      )}
                      <Link
                        href={`/projects/${p.slug}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
