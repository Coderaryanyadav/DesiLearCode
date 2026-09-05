'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { DeviceTimeline } from '@/components/DeviceTimeline';
import { 
  HeartHandshake, 
  Laptop, 
  UserCheck, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function UserDashboardPage() {
  const { currentUser } = useAuth();
  const { donations, devices, projects } = useStore();

  const userDonations = donations.filter(d => d.donorEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'donor');
  const userDevices = devices.filter(d => d.donorEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'donor');

  const totalPledged = userDonations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Donor & Supporter Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500">
            Track your supported initiatives, hardware lifecycles, and tax receipts.
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">₹{totalPledged.toLocaleString()}</div>
          <div className="text-xs font-bold text-slate-700">Total Support Pledged</div>
          <p className="text-[11px] text-slate-500">Itemized project allocations</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{userDevices.length}</div>
          <div className="text-xs font-bold text-slate-700">Devices Donated</div>
          <p className="text-[11px] text-slate-500">Refurbished with #TFK codes</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{userDonations.length}</div>
          <div className="text-xs font-bold text-slate-700">Tax Receipts (80G)</div>
          <p className="text-[11px] text-slate-500">Eligible for statutory deductions</p>
        </div>
      </div>

      {/* Tabs / Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <Link href="/dashboard" className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700">
          Overview
        </Link>
        <Link href="/dashboard/donations" className="px-3 py-1.5 text-slate-600 hover:text-slate-900">
          Donation History
        </Link>
        <Link href="/dashboard/devices" className="px-3 py-1.5 text-slate-600 hover:text-slate-900">
          Device Trackers
        </Link>
        <Link href="/dashboard/volunteering" className="px-3 py-1.5 text-slate-600 hover:text-slate-900">
          Volunteering
        </Link>
        <Link href="/dashboard/profile" className="px-3 py-1.5 text-slate-600 hover:text-slate-900">
          Profile Settings
        </Link>
      </div>

      {/* Active Device Highlight */}
      {userDevices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Active Hardware Lifecycles</h2>
            <Link href="/dashboard/devices" className="text-xs font-bold text-indigo-600 hover:underline">
              View all devices ({userDevices.length}) →
            </Link>
          </div>
          <DeviceTimeline device={userDevices[0]} />
        </div>
      )}

      {/* Recent Pledges Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Project Support Pledges</h2>
          <Link href="/dashboard/donations" className="text-xs font-bold text-indigo-600 hover:underline">
            View Receipts →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Receipt #</th>
                <th className="p-3">Project</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-xl">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userDonations.map((don) => (
                <tr key={don.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-indigo-600">{don.receiptNumber}</td>
                  <td className="p-3 font-semibold text-slate-900">{don.projectTitle}</td>
                  <td className="p-3 text-slate-600">{don.organizationName}</td>
                  <td className="p-3 font-bold text-slate-900">₹{don.amount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(don.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
