'use client';

import React from 'react';
import { DeviceDonation, DeviceStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle, Laptop, Truck, Wrench, Sparkles, Building, UserCheck } from 'lucide-react';

const STAGES: { status: DeviceStatus; label: string; icon: any }[] = [
  { status: 'Submitted', label: 'Submitted', icon: Laptop },
  { status: 'Approved', label: 'Approved', icon: CheckCircle2 },
  { status: 'Received', label: 'Received Hub', icon: Truck },
  { status: 'Repair', label: 'Sanitizing & Prep', icon: Wrench },
  { status: 'Ready', label: 'OS Deployed', icon: Sparkles },
  { status: 'Assigned', label: 'Allocated Lab', icon: Building },
  { status: 'In Use', label: 'Active Classroom', icon: UserCheck },
];

export const DeviceTimeline: React.FC<{ device: DeviceDonation }> = ({ device }) => {
  const currentStageIndex = STAGES.findIndex(s => s.status === device.status);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 0;

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
      {/* Device Logistics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-primary-50 text-primary-700 px-2 py-0.5 rounded border border-primary-200">
              #{device.trackingCode}
            </span>
            <span className="text-xs font-mono font-medium text-success-700 bg-success-50 px-2 py-0.5 rounded border border-success-200">
              STATE: {device.status.toUpperCase()}
            </span>
          </div>
          <h3 className="font-display font-bold text-foreground text-lg mt-1.5">
            {device.manufacturer} {device.model} <span className="font-normal text-muted">({device.deviceType})</span>
          </h3>
          <p className="text-xs font-mono text-muted mt-0.5">
            Intake Date: {new Date(device.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Donor ID: Encrypted
          </p>
        </div>

        {device.assignedOrgName && (
          <div className="text-left sm:text-right bg-surfaceSubtle p-3 rounded-md border border-border">
            <div className="text-[10px] font-mono font-bold text-muted uppercase">Lab Allocation</div>
            <div className="text-xs font-bold text-foreground">{device.assignedOrgName}</div>
            {device.assignedProjectName && (
              <div className="text-[11px] text-primary-600 truncate max-w-[220px]">{device.assignedProjectName}</div>
            )}
          </div>
        )}
      </div>

      {/* Progress Flow Pipeline */}
      <div className="relative py-2">
        <div className="hidden md:grid grid-cols-7 gap-2">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const StageIcon = stage.icon;

            return (
              <div key={stage.status} className="flex flex-col items-center text-center relative group">
                {/* Connecting Line */}
                {idx < STAGES.length - 1 && (
                  <div
                    className={`absolute top-3.5 left-1/2 w-full h-[2px] -z-0 ${
                      idx < activeIndex ? 'bg-success-600' : 'bg-border'
                    }`}
                  />
                )}

                {/* Node */}
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center z-10 transition-all ${
                    isCompleted
                      ? 'bg-success-600 text-white'
                      : isCurrent
                      ? 'bg-foreground text-surface ring-2 ring-primary-500'
                      : 'bg-surfaceSubtle text-muted border border-border'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <StageIcon className="w-3.5 h-3.5" />}
                </div>

                {/* Label */}
                <div className="mt-2">
                  <p className={`text-[11px] font-mono leading-tight ${
                    isCurrent ? 'text-foreground font-bold' : isCompleted ? 'text-muted font-medium' : 'text-muted/60'
                  }`}>
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-2">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const StageIcon = stage.icon;

            return (
              <div key={stage.status} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-success-600 text-white'
                      : isCurrent
                      ? 'bg-foreground text-surface'
                      : 'bg-surfaceSubtle text-muted border border-border'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <StageIcon className="w-3 h-3" />}
                </div>
                <span className={`text-xs font-mono ${isCurrent ? 'text-foreground font-bold' : isCompleted ? 'text-foreground' : 'text-muted'}`}>
                  {stage.label} {isCurrent && '← CURRENT'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technician Audit Logs & Notes */}
      <div className="bg-surfaceSubtle rounded-lg p-4 border border-border space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase text-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary-500" />
          <span>Chain of Custody & Technical Audit Logs</span>
        </h4>

        <div className="space-y-2">
          {device.statusHistory.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-foreground font-mono text-[11px]">{item.status.toUpperCase()}</strong>
                  <span className="text-muted font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-muted mt-0.5 text-xs">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safeguarding note */}
      <div className="text-[11px] text-muted flex items-center gap-1.5 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
        <span>All donor personal data wiped under NIST 800-88 sanitization standards before lab deployment.</span>
      </div>
    </div>
  );
};
