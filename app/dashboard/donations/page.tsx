'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { DonationIntent } from '@/lib/types';
import { FileText, Download, ShieldCheck, CheckCircle2, ArrowLeft, HeartHandshake } from 'lucide-react';

export default function DashboardDonationsPage() {
  const { currentUser } = useAuth();
  const { donations } = useStore();
  const [selectedReceipt, setSelectedReceipt] = useState<DonationIntent | null>(null);

  const userDonations = donations.filter(d => d.donorEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'donor');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Financial & Tax Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Donation Intent & 80G Receipts
          </h1>
          <p className="text-xs text-slate-500">
            Download your partner tax receipts and review itemized project allocations.
          </p>
        </div>

        <Link
          href="/projects"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
        >
          Support Another Initiative
        </Link>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Receipt #</th>
                <th className="p-3.5">Supported Project</th>
                <th className="p-3.5">Partner Organization</th>
                <th className="p-3.5">Allocated Need</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Tax Exemption</th>
                <th className="p-3.5 rounded-r-xl text-right">Receipt Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userDonations.map((don) => (
                <tr key={don.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 font-mono font-bold text-indigo-600">{don.receiptNumber}</td>
                  <td className="p-3.5 font-bold text-slate-900">{don.projectTitle}</td>
                  <td className="p-3.5 text-slate-600">{don.organizationName}</td>
                  <td className="p-3.5 text-slate-500 capitalize">{don.allocatedNeedType?.replace('_', ' ') || 'General Support'}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">₹{don.amount.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      80G Valid
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedReceipt(don)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition inline-flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Exemption Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Official Donation Acknowledgment</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="text-center space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] uppercase font-bold text-slate-400">Acknowledgment Voucher</div>
              <div className="text-xl font-extrabold text-indigo-600 font-mono">{selectedReceipt.receiptNumber}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{selectedReceipt.amount.toLocaleString()}</div>
            </div>

            <div className="text-xs space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Donor:</span>
                <span className="font-semibold text-slate-900">{selectedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Designated Initiative:</span>
                <span className="font-semibold text-slate-900 text-right max-w-xs">{selectedReceipt.projectTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Partner Non-Profit:</span>
                <span className="font-semibold text-slate-900">{selectedReceipt.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issuance Date:</span>
                <span className="font-semibold text-slate-900">{new Date(selectedReceipt.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax Status:</span>
                <span className="font-bold text-emerald-700">Eligible for 80G Tax Deductions</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl text-[11px] leading-relaxed">
              {selectedReceipt.complianceNotice}
            </div>

            <button
              onClick={() => {
                alert(`Receipt #${selectedReceipt.receiptNumber} downloaded as simulated PDF.`);
                setSelectedReceipt(null);
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed Receipt (PDF)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
