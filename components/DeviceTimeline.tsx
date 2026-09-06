'use client';

import React from 'react';
import { DeviceDonation, DeviceStatus } from '@/lib/types';
import { PublicDeviceTracking } from '@/lib/dtos';
import { CheckCircle2, Clock, AlertCircle, Laptop, Truck, Wrench, Sparkles, Building, UserCheck, Circle } from 'lucide-react';

const STAGES: { status: DeviceStatus; label: string; icon: any }[] = [
  { status: 'Submitted', label: 'DONATED', icon: Laptop },
  { status: 'Received', label: 'RECEIVED', icon: Truck },
  { status: 'Inspection', label: 'INSPECTED', icon: Clock },
  { status: 'Repair', label: 'SANITIZED', icon: Wrench },
  { status: 'Ready', label: 'PREPARED', icon: Sparkles },
  { status: 'Assigned', label: 'MATCHED', icon: Building },
  { status: 'Delivered', label: 'DELIVERED', icon: Truck },
  { status: 'In Use', label: 'IN USE', icon: UserCheck },
];

export const DeviceTimeline: React.FC<{ device: DeviceDonation | PublicDeviceTracking }> = ({ device }) => {
  // Normalize current status to closest stage index
  const statusMap: Record<string, number> = {
    'Submitted': 0,
    'Under Review': 0,
    'Approved': 0,
    'Pickup Scheduled': 1,
    'Received': 1,
    'Inspection': 2,
    'Repair': 3,
    'Ready': 4,
    'Assigned': 5,
    'Delivered': 6,
    'In Use': 7,
    'Retired': 7,
  };

  const activeIndex = statusMap[device.status] ?? 0;

  const historyItems = 'statusHistory' in device && Array.isArray(device.statusHistory)
    ? device.statusHistory.map(h => ({ status: h.status, timestamp: h.timestamp, note: h.note }))
    : 'timeline' in device && Array.isArray(device.timeline)
    ? device.timeline.map(t => ({ status: t.status, timestamp: t.timestamp, note: t.publicSummary }))
    : [];

  const intakeDate = 'createdAt' in device && device.createdAt 
    ? new Date(device.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'lastUpdated' in device && device.lastUpdated
    ? new Date(device.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently Logged';

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 space-y-5 sm:space-y-6">
      
      {/* Device Logistics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider">Device</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono font-bold bg-surfaceSubtle text-foreground px-2.5 py-0.5 rounded border border-border">
              {device.trackingCode}
            </span>
            <span className="text-xs font-mono font-semibold text-success-700 bg-success-50 px-2 py-0.5 rounded border border-success-200">
              STATUS: {device.status.toUpperCase()}
            </span>
          </div>
          <h3 className="font-display font-bold text-foreground text-base sm:text-lg pt-0.5">
            {device.deviceType} · {device.manufacturer} {device.model}
          </h3>
          <p className="text-[11px] font-mono text-muted">
            Intake: {intakeDate} • Zero Donor PII Exposed
          </p>
        </div>

        {device.assignedOrgName && (
          <div className="text-left sm:text-right bg-surfaceSubtle p-3 rounded-lg border border-border">
            <div className="text-[10px] font-mono font-bold text-muted uppercase">Lab Allocation</div>
            <div className="text-xs font-bold text-foreground">{device.assignedOrgName}</div>
            {device.assignedProjectName && (
              <div className="text-[11px] text-primary-600 truncate max-w-[220px]">{device.assignedProjectName}</div>
            )}
          </div>
        )}
      </div>

      {/* Vertical Timeline on Mobile, Horizontal on Desktop */}
      <div className="py-2">
        <div className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider mb-3">
          Lifecycle Progression
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-3 pl-2">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={stage.status} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-success-600 text-white'
                        : isCurrent
                        ? 'bg-foreground text-surface ring-2 ring-primary-500'
                        : 'bg-surfaceSubtle text-muted/40 border border-border'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-primary-400" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-muted/40" />
                    )}
                  </div>
                  <span className={`text-xs ${
                    isCurrent 
                      ? 'font-bold text-foreground' 
                      : isCompleted 
                      ? 'font-semibold text-foreground' 
                      : 'text-muted/60'
                  }`}>
                    {stage.label}
                  </span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="text-success-600 font-bold">✓</span>
                  ) : isCurrent ? (
                    <span className="text-primary-600 font-bold text-[10px] bg-primary-50 px-1.5 py-0.5 rounded border border-primary-200">CURRENT</span>
                  ) : (
                    <span className="text-muted/40">○</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Pipeline View */}
        <div className="hidden md:grid grid-cols-8 gap-2">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const StageIcon = stage.icon;

            return (
              <div key={stage.status} className="flex flex-col items-center text-center relative group">
                {idx < STAGES.length - 1 && (
                  <div
                    className={`absolute top-3.5 left-1/2 w-full h-[2px] -z-0 ${
                      idx < activeIndex ? 'bg-success-600' : 'bg-border'
                    }`}
                  />
                )}

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

                <div className="mt-2">
                  <p className={`text-[10px] font-mono leading-tight ${
                    isCurrent ? 'text-foreground font-bold' : isCompleted ? 'text-muted font-medium' : 'text-muted/50'
                  }`}>
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technician Audit Logs & Notes */}
      <div className="bg-surfaceSubtle rounded-lg p-3.5 sm:p-4 border border-border space-y-2.5">
        <h4 className="text-xs font-mono font-bold uppercase text-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary-500" />
          <span>Chain of Custody & Technical Audit Logs</span>
        </h4>

        <div className="space-y-2">
          {historyItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <strong className="text-foreground font-mono text-[11px]">{item.status.toUpperCase()}</strong>
                  <span className="text-muted font-mono text-[10px]">
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
        <span className="w-1.5 h-1.5 rounded-full bg-success-500 shrink-0"></span>
        <span>All donor personal data sanitized (NIST SP 800-88 aligned) prior to lab allocation.</span>
      </div>
    </div>
  );
};
