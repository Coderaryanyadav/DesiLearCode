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
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-panel">
      
      {/* Mobile Card List View (< md) */}
      <div className="md:hidden divide-y divide-border">
        {projects.map((p) => (
          <div key={p.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-foreground">{p.title}</h4>
                <div className="text-xs text-muted font-mono">{p.organizationName}</div>
              </div>
              <StatusBadge status={p.status} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-surfaceSubtle p-2.5 rounded-lg border border-border font-mono">
              <div>Category: <span className="text-foreground font-semibold">{p.category}</span></div>
              <div>Goal: <span className="text-foreground font-semibold">₹{p.goalValue.toLocaleString()}</span></div>
              <div className="col-span-2">Cohort: <span className="text-foreground font-semibold">{p.targetStudents} Students</span></div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {updatingId === p.id ? (
                <span className="text-xs text-muted font-mono py-1">Updating status...</span>
              ) : (
                <>
                  {p.status !== 'active' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'active')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-success-50 text-success-700 font-medium hover:bg-success-100 transition-colors border border-success-200 inline-flex items-center gap-1.5 text-xs font-mono touch-target"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {p.status !== 'paused' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'paused')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-warning-50 text-warning-700 font-medium hover:bg-warning-100 transition-colors border border-warning-200 inline-flex items-center gap-1.5 text-xs font-mono touch-target"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-surfaceSubtle hover:bg-surfaceHover text-foreground font-medium border border-border inline-flex items-center gap-1.5 text-xs font-mono ml-auto touch-target"
                  >
                    <span>View Spec</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surfaceSubtle text-muted font-mono font-bold uppercase text-[10px] border-b border-border">
            <tr>
              <th className="p-3">Initiative Proposal</th>
              <th className="p-3">Partner Entity</th>
              <th className="p-3">Category</th>
              <th className="p-3">Itemized Goal</th>
              <th className="p-3">State</th>
              <th className="p-3 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-surfaceSubtle/50 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-foreground">{p.title}</div>
                  <span className="text-[11px] text-muted font-mono">Cohort: {p.targetStudents} Students</span>
                </td>
                <td className="p-3 text-foreground font-mono">{p.organizationName}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-surfaceSubtle text-foreground font-mono text-[11px] border border-border">
                    {p.category}
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-foreground">
                  ₹{p.goalValue.toLocaleString()}
                </td>
                <td className="p-3">
                  <StatusBadge status={p.status} size="sm" />
                </td>
                <td className="p-3 text-right space-x-1 whitespace-nowrap font-mono">
                  {updatingId === p.id ? (
                    <span className="text-xs text-muted">Updating...</span>
                  ) : (
                    <>
                      {p.status !== 'active' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'active')}
                          className="px-2 py-1 rounded bg-success-50 text-success-700 font-medium hover:bg-success-100 transition-colors border border-success-200 inline-flex items-center gap-1 text-[11px]"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                      {p.status !== 'paused' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'paused')}
                          className="px-2 py-1 rounded bg-warning-50 text-warning-700 font-medium hover:bg-warning-100 transition-colors border border-warning-200 inline-flex items-center gap-1 text-[11px]"
                        >
                          <Pause className="w-3 h-3" />
                          <span>Pause</span>
                        </button>
                      )}
                      <Link
                        href={`/projects/${p.slug}`}
                        className="px-2 py-1 rounded bg-surfaceSubtle hover:bg-surfaceHover text-foreground font-medium border border-border inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Spec</span>
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
