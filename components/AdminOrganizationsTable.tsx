'use client';

import React, { useState } from 'react';
import { Organization, OrganizationVerificationStatus } from '@/lib/types';
import { VerificationBadge } from '@/components/VerificationBadge';
import { updateOrganizationStatus } from '@/app/actions/organizations';
import { CheckCircle2, Ban, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminOrganizationsTableProps {
  initialOrganizations: Organization[];
}

export const AdminOrganizationsTable: React.FC<AdminOrganizationsTableProps> = ({ initialOrganizations }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orgId: string, newStatus: OrganizationVerificationStatus) => {
    setUpdatingId(orgId);
    try {
      const res = await updateOrganizationStatus(orgId, newStatus, 'Status changed via Admin Portal');
      if (res.success) {
        setOrganizations(prev =>
          prev.map(o => o.id === orgId ? { ...o, verificationStatus: newStatus } : o)
        );
      }
    } catch (error) {
      console.error('Failed to update organization status:', error);
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
                  <span className="text-[11px] text-slate-500 font-mono">
                    {org.documents?.length || 0} files on file
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                  {updatingId === org.id ? (
                    <span className="text-xs text-slate-400">Updating...</span>
                  ) : (
                    <>
                      {org.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => handleStatusChange(org.id, 'verified')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      )}
                      {org.verificationStatus !== 'under_review' && (
                        <button
                          onClick={() => handleStatusChange(org.id, 'under_review')}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition"
                        >
                          Review
                        </button>
                      )}
                      {org.verificationStatus !== 'suspended' && (
                        <button
                          onClick={() => handleStatusChange(org.id, 'suspended')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition inline-flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                      )}
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
