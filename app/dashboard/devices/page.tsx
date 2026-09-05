'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { DeviceTimeline } from '@/components/DeviceTimeline';
import { Laptop, ArrowLeft, Plus } from 'lucide-react';

export default function DashboardDevicesPage() {
  const { currentUser } = useAuth();
  const { devices } = useStore();

  const userDevices = devices.filter(d => d.donorEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'donor');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Hardware Lifecycles
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            My Donated Devices ({userDevices.length})
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status milestones, DoD wiping records, and classroom assignments.
          </p>
        </div>

        <Link
          href="/donate-device"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Donate Another Device</span>
        </Link>
      </div>

      <div className="space-y-6">
        {userDevices.map((device) => (
          <DeviceTimeline key={device.id} device={device} />
        ))}
      </div>

    </div>
  );
}
