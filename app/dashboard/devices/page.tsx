import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDevicesForDonor } from '@/lib/db/devices';
import { DeviceTimeline } from '@/components/DeviceTimeline';
import { Laptop, ArrowLeft, Plus } from 'lucide-react';

export const metadata = {
  title: 'My Donated Devices — TechForKids',
};

export default async function DashboardDevicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('id, full_name, email').eq('user_id', user.id).single();
  const devices = profile ? await getDevicesForDonor(profile.id) : [];

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
            My Donated Devices ({devices.length})
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status milestones, wiping records, and classroom assignments.
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

      {devices.length > 0 ? (
        <div className="space-y-6">
          {devices.map((device) => (
            <DeviceTimeline key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 text-xs text-slate-500">
          <Laptop className="w-8 h-8 text-slate-400 mx-auto" />
          <p>No device donations recorded on your account yet.</p>
          <Link href="/donate-device" className="inline-block font-bold text-indigo-600 hover:underline">
            Submit a device assessment →
          </Link>
        </div>
      )}

    </div>
  );
}
