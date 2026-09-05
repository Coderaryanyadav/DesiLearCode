'use client';

import React, { useState } from 'react';
import { DeviceDonation, DeviceStatus } from '@/lib/types';
import { updateDeviceStatus } from '@/app/actions/devices';
import { Laptop, Wrench, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface AdminDevicesManagerProps {
  initialDevices: DeviceDonation[];
}

export const AdminDevicesManager: React.FC<AdminDevicesManagerProps> = ({ initialDevices }) => {
  const [devices, setDevices] = useState<DeviceDonation[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [newStatus, setNewStatus] = useState<DeviceStatus>('Repair');
  const [technicianNote, setTechnicianNote] = useState('Hardware bench diagnostics passed. Storage sanitized.');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const statuses: DeviceStatus[] = [
    'Submitted', 'Under Review', 'Approved', 'Pickup Scheduled', 'Received', 'Inspection', 'Repair', 'Ready', 'Assigned', 'Delivered', 'In Use', 'Retired'
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId) return;
    setIsUpdating(true);
    setSuccessMessage(null);

    try {
      const res = await updateDeviceStatus(selectedDeviceId, newStatus, technicianNote);
      if (res.success) {
        setDevices(prev =>
          prev.map(d => d.id === selectedDeviceId ? { ...d, status: newStatus } : d)
        );
        setSuccessMessage(`Device updated to ${newStatus}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to update device status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Device List Table */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Tracker #</th>
                <th className="p-3.5">Device Specs</th>
                <th className="p-3.5">Donor</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5 rounded-r-xl text-right">Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.map((d) => (
                <tr
                  key={d.id}
                  className={`hover:bg-slate-50/60 transition cursor-pointer ${
                    selectedDeviceId === d.id ? 'bg-indigo-50/60' : ''
                  }`}
                  onClick={() => {
                    setSelectedDeviceId(d.id);
                    setNewStatus(d.status);
                  }}
                >
                  <td className="p-3.5 font-mono font-bold text-indigo-600">{d.trackingCode}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{d.manufacturer} {d.model}</div>
                    <span className="text-[11px] text-slate-500">{d.storage} • {d.ram}</span>
                  </td>
                  <td className="p-3.5 text-slate-600">{d.donorName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        selectedDeviceId === d.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {selectedDeviceId === d.id ? 'Active' : 'Edit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technician Transition Panel */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <Wrench className="w-4 h-4" />
          <span>Bench Diagnostics & Status Update</span>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
            {successMessage}
          </div>
        )}

        {selectedDeviceId ? (
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Target Status</label>
              <select
                value={newStatus}
                onChange={(e: any) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Technician Log Note</label>
              <textarea
                rows={3}
                required
                value={technicianNote}
                onChange={(e) => setTechnicianNote(e.target.value)}
                placeholder="Log wiping confirmation or diagnostic findings..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition shadow-md disabled:opacity-60"
            >
              {isUpdating ? 'Logging Status...' : 'Commit Status Transition'}
            </button>
          </form>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            Select a device from the table to log bench updates.
          </div>
        )}
      </div>

    </div>
  );
};
