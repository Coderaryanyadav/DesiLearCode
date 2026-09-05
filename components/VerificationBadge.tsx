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
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  switch (status) {
    case 'verified':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-success-50 text-success-700 border border-success-200/80 shadow-sm ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
          {showText && <span>Verified NGO</span>}
        </span>
      );
    case 'under_review':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-warning-50 text-warning-700 border border-warning-200/80 shadow-sm ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-warning-600" />
          {showText && <span>Under Review</span>}
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-error-50 text-error-700 border border-error-200/80 shadow-sm ${sizeClasses}`}>
          <Ban className="w-3.5 h-3.5 text-error-600" />
          {showText && <span>Rejected</span>}
        </span>
      );
    case 'suspended':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-surfaceHover text-muted border border-border shadow-sm ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-muted" />
          {showText && <span>Suspended</span>}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-surfaceHover text-muted border border-border shadow-sm ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-muted" />
          {showText && <span>Pending</span>}
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ 
  status: ProjectStatus | DeviceStatus | string; 
  type?: 'project' | 'device' | 'need' 
}> = ({ status, type = 'project' }) => {
  const statusStr = String(status);
  
  if (['active', 'In Use', 'Ready', 'Approved', 'successful'].includes(statusStr)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-success-50 text-success-700 border border-success-200">
        <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
        {statusStr.replace('_', ' ')}
      </span>
    );
  }

  if (['pending_approval', 'Under Review', 'Submitted', 'Inspection', 'Repair'].includes(statusStr)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-warning-50 text-warning-700 border border-warning-200">
        <span className="w-1.5 h-1.5 rounded-full bg-warning-500"></span>
        {statusStr.replace('_', ' ')}
      </span>
    );
  }

  if (['almost_funded', 'Pickup Scheduled', 'Assigned', 'Delivered'].includes(statusStr)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-info-50 text-info-700 border border-info-200">
        <span className="w-1.5 h-1.5 rounded-full bg-info-500"></span>
        {statusStr.replace('_', ' ')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-surfaceHover text-muted border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-muted"></span>
      {statusStr.replace('_', ' ')}
    </span>
  );
};
