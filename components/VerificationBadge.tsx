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
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  switch (status) {
    case 'verified':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {showText && <span>Verified NGO</span>}
        </span>
      );
    case 'under_review':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {showText && <span>Verification Under Review</span>}
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-red-50 text-red-700 border border-red-200/80 ${sizeClasses}`}>
          <Ban className="w-3.5 h-3.5 text-red-600" />
          {showText && <span>Verification Rejected</span>}
        </span>
      );
    case 'suspended':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          {showText && <span>Suspended</span>}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-50 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {showText && <span>Pending Verification</span>}
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {statusStr.replace('_', ' ')}
      </span>
    );
  }

  if (['pending_approval', 'Under Review', 'Submitted', 'Inspection', 'Repair'].includes(statusStr)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {statusStr.replace('_', ' ')}
      </span>
    );
  }

  if (['almost_funded', 'Pickup Scheduled', 'Assigned', 'Delivered'].includes(statusStr)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        {statusStr.replace('_', ' ')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      {statusStr.replace('_', ' ')}
    </span>
  );
};
