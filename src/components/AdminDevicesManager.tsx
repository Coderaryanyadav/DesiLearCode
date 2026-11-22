'use client';

import React, { useState } from 'react';
import { DeviceDonation, DeviceStatus } from '@/lib/types';
import { updateDeviceStatus } from '@/app/actions/devices';
import { StatusBadge } from '@/components/StatusBadge';
import { Laptop, Wrench, CheckCircle2, ShieldCheck, Sparkles, Sliders } from 'lucide-react';

interface AdminDevicesManagerProps {
  initialDevices: DeviceDonation[];
}

export const AdminDevicesManager: React.FC<AdminDevicesManagerProps> = ({ initialDevices }) => {
  const [devices, setDevices] = useState<DeviceDonation[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || '');
  const [newStatus, setNewStatus] = useState<DeviceStatus>('Repair');
  const [technicianNote, setTechnicianNote] = useState('Hardware bench diagnostics passed. Storage sanitized aligned with NIST SP 800-88 guidance.');
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
        setSuccessMessage(`Device transition logged: ${newStatus}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to update device status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Device List Table / Mobile Cards */}
      <div className="lg:col-span-8 bg-surface rounded-xl border border-border overflow-hidden shadow-panel">
        
        {/* Mobile Cards (< md) */}
        <div className="md:hidden divide-y divide-border">
          {devices.map((d) => (
            <div
              key={d.id}
              className={`p-4 space-y-2.5 transition-colors cursor-pointer ${
                selectedDeviceId === d.id ? 'bg-primary-50/50' : 'hover:bg-surfaceSubtle/50'
              }`}
              onClick={() => {
                setSelectedDeviceId(d.id);
                setNewStatus(d.status);
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-primary-600">#{d.trackingCode}</span>
                  <div className="font-bold text-sm text-foreground">{d.manufacturer} {d.model}</div>
                </div>
                <StatusBadge status={d.status} size="sm" />
              </div>

              <div className="text-xs font-mono text-muted flex items-center justify-between">
                <span>{d.storage} • {d.ram}</span>
                <span>Donor: {d.donorName}</span>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors touch-target ${
                    selectedDeviceId === d.id
                      ? 'bg-foreground text-surface'
                      : 'bg-surfaceSubtle text-muted hover:text-foreground border border-border'
                  }`}
                >
                  {selectedDeviceId === d.id ? 'SELECTED' : 'SELECT TO EDIT'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surfaceSubtle text-muted font-mono font-bold uppercase text-[10px] border-b border-border">
              <tr>
                <th className="p-3">Asset ID</th>
                <th className="p-3">Specifications</th>
                <th className="p-3">Donor Entity</th>
                <th className="p-3">Logistics State</th>
                <th className="p-3 text-right">Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devices.map((d) => (
                <tr
                  key={d.id}
                  className={`hover:bg-surfaceSubtle/50 transition-colors cursor-pointer ${
                    selectedDeviceId === d.id ? 'bg-primary-50/40' : ''
                  }`}
                  onClick={() => {
                    setSelectedDeviceId(d.id);
                    setNewStatus(d.status);
                  }}
                >
                  <td className="p-3 font-mono font-bold text-primary-600">#{d.trackingCode}</td>
                  <td className="p-3">
                    <div className="font-bold text-foreground">{d.manufacturer} {d.model}</div>
                    <span className="text-[11px] text-muted font-mono">{d.storage} • {d.ram}</span>
                  </td>
                  <td className="p-3 text-foreground font-mono text-[11px]">{d.donorName}</td>
                  <td className="p-3">
                    <StatusBadge status={d.status} size="sm" />
                  </td>
                  <td className="p-3 text-right font-mono">
                    <button
                      type="button"
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        selectedDeviceId === d.id
                          ? 'bg-foreground text-surface'
                          : 'bg-surfaceSubtle text-muted hover:text-foreground border border-border'
                      }`}
                    >
                      {selectedDeviceId === d.id ? 'ACTIVE' : 'EDIT'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technician Transition Drawer */}
      <div className="lg:col-span-4 bg-surface rounded-xl border border-border p-4 sm:p-5 shadow-panel space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase">
          <Wrench className="w-3.5 h-3.5 text-primary-500" />
          <span>Bench Diagnostics & Transition</span>
        </div>

        {successMessage && (
          <div className="p-2.5 bg-success-50 border border-success-200 text-success-800 rounded-lg text-xs font-mono">
            {successMessage}
          </div>
        )}

        {selectedDeviceId ? (
          <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-muted font-semibold mb-1 font-mono text-[11px]">TARGET LOGISTICS STATE</label>
              <select
                value={newStatus}
                onChange={(e: any) => setNewStatus(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-border bg-surfaceSubtle font-mono text-xs text-foreground focus:outline-none focus:border-primary-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-muted font-semibold mb-1 font-mono text-[11px]">AUDIT LOG ENTRY</label>
              <textarea
                rows={3}
                required
                value={technicianNote}
                onChange={(e) => setTechnicianNote(e.target.value)}
                placeholder="Record disk sanitization verification (NIST SP 800-88 aligned), thermal renewal, or lab dispatch notes..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-surfaceSubtle text-xs focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full min-h-[44px] py-2.5 rounded-lg bg-foreground text-surface font-semibold text-xs hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 touch-target shadow-subtle"
            >
              {isUpdating ? 'Logging...' : 'Commit Status Transition'}
            </button>
          </form>
        ) : (
          <div className="p-4 text-center text-xs font-mono text-muted">
            Select a device from the list to log bench updates.
          </div>
        )}
      </div>

    </div>
  );
};
