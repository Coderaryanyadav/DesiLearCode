'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowLeft, CheckCircle2, Ban, Pause } from 'lucide-react';

export default function AdminProjectsPage() {
  const { projects, updateProjectStatus } = useStore();
  const { currentUser } = useAuth();

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

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
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
                  <td className="p-3.5 font-bold text-slate-900">₹{p.goalValue.toLocaleString()}</td>
                  <td className="p-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status !== 'active' ? (
                        <button
                          onClick={() => updateProjectStatus(p.id, 'active', currentUser.name)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => updateProjectStatus(p.id, 'paused', currentUser.name)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 font-bold text-xs rounded-lg transition"
                        >
                          Pause
                        </button>
                      )}
                      <button
                        onClick={() => updateProjectStatus(p.id, 'draft', currentUser.name)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs rounded-lg transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
