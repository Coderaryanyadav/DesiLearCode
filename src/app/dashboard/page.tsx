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
  title: 'Supporter Dashboard — DesiLearCode',
};

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full">
            Donor & Supporter Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
            Welcome back, {profile?.full_name || 'Supporter'}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl">
            Track your supported initiatives, hardware lifecycles, and contribution pledges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/donate-device"
            className="px-5 py-2.5 rounded-xl bg-success-600 text-white font-bold text-sm hover:bg-success-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Laptop className="w-4 h-4" />
            <span>Donate Device</span>
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-xl bg-foreground text-surface font-bold text-sm hover:bg-foreground/90 transition-colors shadow-card"
          >
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-foreground">₹{totalPledged.toLocaleString()}</div>
            <div className="text-sm font-bold text-foreground mt-1">Total Project Pledges</div>
            <p className="text-xs text-muted font-medium mt-0.5">{donations.length} contributions recorded</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center border border-success-100 group-hover:bg-success-600 group-hover:text-white transition-colors">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-foreground">{devices.length}</div>
            <div className="text-sm font-bold text-foreground mt-1">Devices Donated</div>
            <p className="text-xs text-muted font-medium mt-0.5">Tracked in lifecycle ledger</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-info-50 text-info-600 flex items-center justify-center border border-info-100 group-hover:bg-info-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-foreground">Active</div>
            <div className="text-sm font-bold text-foreground mt-1">Account Security</div>
            <p className="text-xs text-muted font-medium mt-0.5">Authenticated via Supabase</p>
          </div>
        </div>
      </div>

      {/* Recent Devices */}
      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-border/60">
          <h3 className="text-lg font-display font-bold text-foreground">Your Donated Hardware</h3>
          <Link href="/dashboard/devices" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
            View all ({devices.length}) →
          </Link>
        </div>

        {devices.length > 0 ? (
          <div className="space-y-4">
            {devices.slice(0, 3).map((d) => (
              <div key={d.id} className="p-5 bg-surfaceHover rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm hover:border-primary-200 transition-colors">
                <div>
                  <span className="font-mono font-bold text-primary-600 text-xs">{d.trackingCode}</span>
                  <div className="font-bold text-foreground mt-1 text-base">{d.manufacturer} {d.model}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-success-50 text-success-700 border border-success-200 font-bold text-xs">
                    {d.status}
                  </span>
                  <Link href={`/donate-device`} className="text-muted hover:text-foreground font-semibold flex items-center gap-1 transition-colors">
                    Timeline <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm font-medium text-muted bg-surfaceHover rounded-2xl border border-border">
            No devices donated yet. <Link href="/donate-device" className="text-primary-600 font-bold hover:underline">Donate a laptop or PC</Link> to equip a learning center.
          </div>
        )}
      </div>

      {/* Recent Donations */}
      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-border/60">
          <h3 className="text-lg font-display font-bold text-foreground">Recent Project Support</h3>
          <Link href="/dashboard/donations" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
            View all ({donations.length}) →
          </Link>
        </div>

        {donations.length > 0 ? (
          <div className="space-y-4">
            {donations.slice(0, 3).map((don) => (
              <div key={don.id} className="p-5 bg-surfaceHover rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm hover:border-primary-200 transition-colors">
                <div>
                  <span className="font-mono text-muted font-bold text-xs">{don.receiptNumber}</span>
                  <div className="font-bold text-foreground mt-1 text-base">{don.projectTitle}</div>
                  <div className="text-xs text-muted font-medium">{don.organizationName}</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-foreground text-lg">₹{don.amount.toLocaleString()}</div>
                  <span className="text-[10px] text-success-700 font-bold uppercase tracking-wider">{don.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm font-medium text-muted bg-surfaceHover rounded-2xl border border-border">
            No project contributions recorded yet. <Link href="/projects" className="text-primary-600 font-bold hover:underline">Explore community projects</Link>.
          </div>
        )}
      </div>

    </div>
  );
}
