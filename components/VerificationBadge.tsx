'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Ban, ShieldCheck } from 'lucide-react';
import { OrganizationVerificationStatus, ProjectStatus, DeviceStatus } from '@/lib/types';

export const VerificationBadge: React.FC<{ 
  status: OrganizationVerificationStatus; 
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, showText = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2',
  }[size];

  switch (status) {
    case 'verified':
      return (
        <span 
          title="Verified 501(c)(3)/Section 8 NGO with validated physical learning lab"
          className={`inline-flex items-center font-medium rounded-md bg-success-50 text-success-700 border border-success-200 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-success-600 shrink-0" />
          {showText && <span className="font-mono text-[11px] tracking-tight">VERIFIED NGO</span>}
        </span>
      );
    case 'under_review':
      return (
        <span 
          title="Documents submitted and awaiting verification review"
          className={`inline-flex items-center font-medium rounded-md bg-warning-50 text-warning-700 border border-warning-200 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-warning-600 shrink-0" />
          {showText && <span className="font-mono text-[11px] tracking-tight">UNDER REVIEW</span>}
        </span>
      );
    case 'rejected':
      return (
        <span 
          title="Verification criteria not met"
          className={`inline-flex items-center font-medium rounded-md bg-error-50 text-error-700 border border-error-200 ${sizeClasses}`}
        >
          <Ban className="w-3.5 h-3.5 text-error-600 shrink-0" />
          {showText && <span className="font-mono text-[11px] tracking-tight">UNVERIFIED</span>}
        </span>
      );
    case 'suspended':
      return (
        <span 
          title="Account suspended pending compliance review"
          className={`inline-flex items-center font-medium rounded-md bg-surfaceSubtle text-muted border border-border ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-muted shrink-0" />
          {showText && <span className="font-mono text-[11px] tracking-tight">SUSPENDED</span>}
        </span>
      );
    default:
      return (
        <span 
          title="Awaiting documentation"
          className={`inline-flex items-center font-medium rounded-md bg-surfaceSubtle text-muted border border-border ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
          {showText && <span className="font-mono text-[11px] tracking-tight">PENDING</span>}
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ 
  status: ProjectStatus | DeviceStatus | string; 
  type?: 'project' | 'device' | 'need';
  size?: 'sm' | 'md';
}> = ({ status, type = 'project', size = 'md' }) => {
  const statusStr = String(status);
  const textClass = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';
  
  if (['active', 'In Use', 'Ready', 'Approved', 'successful', 'Delivered'].includes(statusStr)) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-success-50 text-success-700 border border-success-200 ${textClass}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
        {statusStr.toUpperCase().replace('_', ' ')}
      </span>
    );
  }

  if (['pending_approval', 'Under Review', 'Submitted', 'Inspection', 'Repair'].includes(statusStr)) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-warning-50 text-warning-700 border border-warning-200 ${textClass}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-warning-500 animate-pulse"></span>
        {statusStr.toUpperCase().replace('_', ' ')}
      </span>
    );
  }

  if (['almost_funded', 'Pickup Scheduled', 'Assigned'].includes(statusStr)) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-primary-50 text-primary-700 border border-primary-200 ${textClass}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
        {statusStr.toUpperCase().replace('_', ' ')}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md bg-surfaceSubtle text-muted border border-border ${textClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-muted"></span>
      {statusStr.toUpperCase().replace('_', ' ')}
    </span>
  );
};
