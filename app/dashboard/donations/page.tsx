import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDonationsForDonor } from '@/lib/db/donations';
import { FileText, Download, ShieldCheck, CheckCircle2, ArrowLeft, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Donation History & Receipts — DesiLearCode',
};

export default async function DashboardDonationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('id, full_name, email').eq('user_id', user.id).single();
  const donations = profile ? await getDonationsForDonor(profile.id) : [];

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
            Donation Intent & Receipts
          </h1>
          <p className="text-xs text-slate-500">
            Review your project allocations and transparent donation records.
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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        {donations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Receipt #</th>
                  <th className="p-3.5">Supported Project</th>
                  <th className="p-3.5">Partner Organization</th>
                  <th className="p-3.5">Allocated Need</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono font-bold text-indigo-600">{don.receiptNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{don.projectTitle}</td>
                    <td className="p-3.5 text-slate-600">{don.organizationName}</td>
                    <td className="p-3.5 text-slate-500 capitalize">{don.allocatedNeedType || 'General Lab Fund'}</td>
                    <td className="p-3.5 font-bold text-slate-900">₹{don.amount.toLocaleString()}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {don.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-slate-400 font-mono">
                      {new Date(don.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto" />
            <p>No donation pledges recorded yet.</p>
            <Link href="/projects" className="inline-block font-bold text-indigo-600 hover:underline">
              Browse community projects →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
