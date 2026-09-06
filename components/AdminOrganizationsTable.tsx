'use client';

import React, { useState } from 'react';
import { Organization, OrganizationVerificationStatus } from '@/lib/types';
import { VerificationBadge } from '@/components/VerificationBadge';
import { updateOrganizationStatus } from '@/app/actions/organizations';
import { CheckCircle2, Ban, AlertCircle, RefreshCw, FileText } from 'lucide-react';

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
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-panel">
      
      {/* Mobile Card List View (< md) */}
      <div className="md:hidden divide-y divide-border">
        {organizations.map((org) => (
          <div key={org.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-foreground">{org.name}</h4>
                <div className="text-xs text-muted font-mono">{org.contactPerson} ({org.email})</div>
              </div>
              <VerificationBadge status={org.verificationStatus} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-surfaceSubtle p-2.5 rounded-lg border border-border font-mono">
              <div>Reg #: <span className="text-foreground">{org.registrationNumber || 'N/A'}</span></div>
              <div>Region: <span className="text-foreground">{org.location}</span></div>
              <div className="col-span-2 flex items-center gap-1 text-muted">
                <FileText className="w-3 h-3 text-muted" />
                <span>{org.documents?.length || 0} statutory audited files</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {updatingId === org.id ? (
                <span className="text-xs text-muted font-mono py-1">Updating...</span>
              ) : (
                <>
                  {org.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleStatusChange(org.id, 'verified')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-success-50 text-success-700 font-medium hover:bg-success-100 transition-colors border border-success-200 inline-flex items-center gap-1.5 text-xs font-mono touch-target"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {org.verificationStatus !== 'under_review' && (
                    <button
                      onClick={() => handleStatusChange(org.id, 'under_review')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-warning-50 text-warning-700 font-medium hover:bg-warning-100 transition-colors border border-warning-200 text-xs font-mono touch-target"
                    >
                      Review
                    </button>
                  )}
                  {org.verificationStatus !== 'suspended' && (
                    <button
                      onClick={() => handleStatusChange(org.id, 'suspended')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-error-50 text-error-700 font-medium hover:bg-error-100 transition-colors border border-error-200 inline-flex items-center gap-1.5 text-xs font-mono touch-target"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Suspend</span>
                    </button>
                  )}
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
              <th className="p-3">Partner Entity</th>
              <th className="p-3">Statutory Reg #</th>
              <th className="p-3">Region</th>
              <th className="p-3">Standing</th>
              <th className="p-3">Audited Files</th>
              <th className="p-3 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-surfaceSubtle/50 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-foreground">{org.name}</div>
                  <span className="text-[11px] text-muted font-mono">{org.contactPerson} ({org.email})</span>
                </td>
                <td className="p-3 font-mono text-muted">{org.registrationNumber}</td>
                <td className="p-3 text-foreground font-mono">{org.location}</td>
                <td className="p-3">
                  <VerificationBadge status={org.verificationStatus} size="sm" />
                </td>
                <td className="p-3">
                  <span className="text-[11px] text-muted font-mono flex items-center gap-1">
                    <FileText className="w-3 h-3 text-muted" />
                    {org.documents?.length || 0} statutory files
                  </span>
                </td>
                <td className="p-3 text-right space-x-1 whitespace-nowrap font-mono">
                  {updatingId === org.id ? (
                    <span className="text-xs text-muted">Updating...</span>
                  ) : (
                    <>
                      {org.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => handleStatusChange(org.id, 'verified')}
                          className="px-2 py-1 rounded bg-success-50 text-success-700 font-medium hover:bg-success-100 transition-colors border border-success-200 inline-flex items-center gap-1 text-[11px]"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}
                      {org.verificationStatus !== 'under_review' && (
                        <button
                          onClick={() => handleStatusChange(org.id, 'under_review')}
                          className="px-2 py-1 rounded bg-warning-50 text-warning-700 font-medium hover:bg-warning-100 transition-colors border border-warning-200 text-[11px]"
                        >
                          Review
                        </button>
                      )}
                      {org.verificationStatus !== 'suspended' && (
                        <button
                          onClick={() => handleStatusChange(org.id, 'suspended')}
                          className="px-2 py-1 rounded bg-error-50 text-error-700 font-medium hover:bg-error-100 transition-colors border border-error-200 inline-flex items-center gap-1 text-[11px]"
                        >
                          <Ban className="w-3 h-3" />
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
