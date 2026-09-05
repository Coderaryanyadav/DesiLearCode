'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { DeviceStatus } from '@/lib/types';
import { ArrowLeft, Laptop, Wrench, CheckCircle2, ShieldCheck, Sparkles, Building } from 'lucide-react';

export default function AdminDevicesPage() {
  const { devices, updateDeviceStatus } = useStore();
  const { currentUser } = useAuth();

  const [selectedDevice, setSelectedDevice] = useState<string>(devices[0]?.id);
  const [newStatus, setNewStatus] = useState<DeviceStatus>('Repair');
  const [technicianNote, setTechnicianNote] = useState('Hardware bench diagnostics passed. Storage sanitized.');

  const statuses: DeviceStatus[] = [
    'Submitted', 'Under Review', 'Approved', 'Pickup Scheduled', 'Received', 'Inspection', 'Repair', 'Ready', 'Assigned', 'Delivered', 'In Use', 'Retired'
  ];

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    updateDeviceStatus(selectedDevice, newStatus, technicianNote, currentUser.name);
    alert(`Device #${selectedDevice} transitioned to ${newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Hardware Lifecycle Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Refurbishment & Device Pipeline ({devices.length})
          </h1>
          <p className="text-xs text-slate-500">
            Log technical bench inspections, DoD wiping verification, and deploy units to partner centers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Device List Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Tracker #</th>
                  <th className="p-3.5">Device Specs</th>
                  <th className="p-3.5">Donor</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Select</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {devices.map((d) => (
                  <tr key={d.id} className={`hover:bg-slate-50/60 transition ${selectedDevice === d.id ? 'bg-indigo-50/50' : ''}`}>
                    <td className="p-3.5 font-mono font-bold text-indigo-600">#{d.trackingCode}</td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {d.manufacturer} {d.model}
                      <span className="text-[11px] text-slate-500 block font-normal">{d.deviceType} • {d.ram} RAM • {d.storage}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{d.donorName}</td>
                    <td className="p-3.5 capitalize text-slate-600">{d.condition.replace('_', ' ')}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedDevice(d.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Transition Action Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-emerald-600" />
            <span>Technician Status Update</span>
          </h3>

          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Device</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white font-mono font-semibold"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>#{d.trackingCode} - {d.manufacturer} {d.model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Lifecycle State</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white font-semibold"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Technician Log / Dispatch Remarks</label>
              <textarea
                rows={3}
                required
                value={technicianNote}
                onChange={(e) => setTechnicianNote(e.target.value)}
                placeholder="Details on hardware diagnostic tests, OS installation, or NGO allocation..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
            >
              Commit Status Transition & Log Audit
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
