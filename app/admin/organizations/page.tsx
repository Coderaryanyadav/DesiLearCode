'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { VerificationBadge } from '@/components/VerificationBadge';
import { ArrowLeft, CheckCircle2, Ban, AlertCircle, FileText } from 'lucide-react';

export default function AdminOrganizationsPage() {
  const { organizations, updateOrganizationStatus } = useStore();
  const { currentUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            Compliance Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Organizations & Verification Audit ({organizations.length})
          </h1>
          <p className="text-xs text-slate-500">
            Review 12A/80G deeds, society certificates, and update verified credentials.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Organization</th>
                <th className="p-3.5">Registration #</th>
                <th className="p-3.5">Region</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Documents</th>
                <th className="p-3.5 rounded-r-xl text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{org.name}</div>
                    <span className="text-[11px] text-slate-500">{org.contactPerson} ({org.email})</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{org.registrationNumber}</td>
                  <td className="p-3.5 text-slate-600">{org.location}</td>
                  <td className="p-3.5">
                    <VerificationBadge status={org.verificationStatus} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] text-indigo-600 font-medium">
                      {org.documents?.length || 0} statutory files
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {org.verificationStatus !== 'verified' ? (
                        <button
                          onClick={() => updateOrganizationStatus(org.id, 'verified', currentUser.name)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => updateOrganizationStatus(org.id, 'suspended', currentUser.name)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 font-bold text-xs rounded-lg transition"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => updateOrganizationStatus(org.id, 'rejected', currentUser.name)}
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
