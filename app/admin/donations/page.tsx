'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowLeft, HeartHandshake, FileText, CheckCircle2 } from 'lucide-react';

export default function AdminDonationsPage() {
  const { donations } = useStore();

  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            Financial Intent Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Donation Intent & Partner Tax Log ({donations.length})
          </h1>
          <p className="text-xs text-slate-500">
            Total project support recorded: <strong>₹{total.toLocaleString()}</strong> across verified partner institutions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Receipt #</th>
                <th className="p-3.5">Donor Name</th>
                <th className="p-3.5">Project Target</th>
                <th className="p-3.5">Partner NGO</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Tax Status</th>
                <th className="p-3.5 rounded-r-xl">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((don) => (
                <tr key={don.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 font-mono font-bold text-indigo-600">{don.receiptNumber}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900">{don.donorName}</span>
                    <span className="text-[11px] text-slate-500 block font-normal">{don.donorEmail}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{don.projectTitle}</td>
                  <td className="p-3.5 text-slate-600">{don.organizationName}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">₹{don.amount.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      80G Valid
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    {new Date(don.createdAt).toLocaleString()}
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
