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
      <div className="overflow-x-auto">
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
