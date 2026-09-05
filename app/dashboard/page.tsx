import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDonationsForDonor } from '@/lib/db/donations';
import { getDevicesForDonor } from '@/lib/db/devices';
import { 
  HeartHandshake, 
  Laptop, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Building2
} from 'lucide-react';

export const metadata = {
  title: 'Supporter Dashboard — TechForKids',
};

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const [donations, devices] = await Promise.all([
    profile ? getDonationsForDonor(profile.id) : [],
    profile ? getDevicesForDonor(profile.id) : [],
  ]);

  const totalPledged = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Donor & Supporter Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Welcome back, {profile?.full_name || 'Supporter'}
          </h1>
          <p className="text-xs text-slate-500">
            Track your supported initiatives, hardware lifecycles, and contribution pledges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/donate-device"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Donate Device</span>
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
          >
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalPledged.toLocaleString()}</div>
          <div className="text-xs font-bold text-slate-700">Total Project Pledges</div>
          <p className="text-[11px] text-slate-500">{donations.length} contributions recorded</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{devices.length}</div>
          <div className="text-xs font-bold text-slate-700">Devices Donated</div>
          <p className="text-[11px] text-slate-500">Tracked in lifecycle ledger</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Active</div>
          <div className="text-xs font-bold text-slate-700">Account Security</div>
          <p className="text-[11px] text-slate-500">Authenticated via Supabase</p>
        </div>
      </div>

      {/* Recent Devices */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Your Donated Hardware</h3>
          <Link href="/dashboard/devices" className="text-xs font-semibold text-indigo-600 hover:underline">
            View all ({devices.length}) →
          </Link>
        </div>

        {devices.length > 0 ? (
          <div className="space-y-3">
            {devices.slice(0, 3).map((d) => (
              <div key={d.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-indigo-600">{d.trackingCode}</span>
                  <div className="font-bold text-slate-900 mt-0.5">{d.manufacturer} {d.model}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    {d.status}
                  </span>
                  <Link href={`/donate-device`} className="text-slate-600 hover:text-slate-900 font-semibold">
                    Timeline →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            No devices donated yet. <Link href="/donate-device" className="text-indigo-600 font-bold hover:underline">Donate a laptop or PC</Link> to equip a learning center.
          </div>
        )}
      </div>

      {/* Recent Donations */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Recent Project Support</h3>
          <Link href="/dashboard/donations" className="text-xs font-semibold text-indigo-600 hover:underline">
            View all ({donations.length}) →
          </Link>
        </div>

        {donations.length > 0 ? (
          <div className="space-y-3">
            {donations.slice(0, 3).map((don) => (
              <div key={don.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono text-slate-500 font-semibold">{don.receiptNumber}</span>
                  <div className="font-bold text-slate-900 mt-0.5">{don.projectTitle}</div>
                  <div className="text-[11px] text-slate-400">{don.organizationName}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900 text-sm">₹{don.amount.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold capitalize">{don.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            No project contributions recorded yet. <Link href="/projects" className="text-indigo-600 font-bold hover:underline">Explore community projects</Link>.
          </div>
        )}
      </div>

    </div>
  );
}
