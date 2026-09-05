'use client';

import React from 'react';
import { DeviceDonation, DeviceStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle, Laptop, Truck, Wrench, Sparkles, Building, UserCheck } from 'lucide-react';

const STAGES: { status: DeviceStatus; label: string; icon: any }[] = [
  { status: 'Submitted', label: 'Submitted', icon: Laptop },
  { status: 'Approved', label: 'Approved', icon: CheckCircle2 },
  { status: 'Received', label: 'Received at Hub', icon: Truck },
  { status: 'Repair', label: 'Refurbishing', icon: Wrench },
  { status: 'Ready', label: 'OS & Setup Ready', icon: Sparkles },
  { status: 'Assigned', label: 'Assigned to NGO', icon: Building },
  { status: 'In Use', label: 'Active in Classroom', icon: UserCheck },
];

export const DeviceTimeline: React.FC<{ device: DeviceDonation }> = ({ device }) => {
  const currentStageIndex = STAGES.findIndex(s => s.status === device.status);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      {/* Device Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">
              #{device.trackingCode}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Status: {device.status}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mt-1">
            {device.manufacturer} {device.model} ({device.deviceType})
          </h3>
          <p className="text-xs text-slate-500">
            Donated by {device.donorName} • Submitted {new Date(device.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {device.assignedOrgName && (
          <div className="text-right sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned Destination</div>
            <div className="text-xs font-bold text-slate-900">{device.assignedOrgName}</div>
            {device.assignedProjectName && (
              <div className="text-[11px] text-indigo-600 truncate max-w-[220px]">{device.assignedProjectName}</div>
            )}
          </div>
        )}
      </div>

      {/* Progress Stepper */}
      <div className="relative">
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
                    className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${
                      idx < activeIndex ? 'bg-emerald-500' : 'bg-slate-100'
                    }`}
                  />
                )}

                {/* Node circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StageIcon className="w-4 h-4" />}
                </div>

                {/* Label */}
                <div className="mt-2.5">
                  <p className={`text-[11px] font-bold ${
                    isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper View */}
        <div className="md:hidden space-y-3">
          <div className="text-xs font-semibold text-slate-500 mb-2">Lifecycle Milestones:</div>
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const StageIcon = stage.icon;

            return (
              <div key={stage.status} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <StageIcon className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? 'text-indigo-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stage.label} {isCurrent && ' (Current Step)'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technician Audit Logs & Notes */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Detailed Status History & Technical Logs</span>
        </h4>

        <div className="space-y-2.5">
          {device.statusHistory.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-semibold">{item.status}</strong>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safeguarding note */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Device assigned strictly to verified institutional classrooms with zero personal child identity disclosures.</span>
      </div>
    </div>
  );
};
