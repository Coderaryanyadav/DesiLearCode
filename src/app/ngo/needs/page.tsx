import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOpenNeeds } from '@/lib/db/needs';
import { NeedCard } from '@/components/NeedCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Manage Needs — DesiLearCode NGO',
};

export default async function NgoNeedsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  const allNeeds = await getOpenNeeds();
  const orgNeeds = profile?.organization_id 
    ? allNeeds.filter(n => n.organizationId === profile.organization_id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NGO Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Hardware & Mentorship Requirements
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Manage Open Needs ({orgNeeds.length})
          </h1>
          <p className="text-xs text-slate-500">
            Itemized requirements published across your active learning labs.
          </p>
        </div>

        <Link
          href="/needs"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
        >
          View Public Needs Marketplace →
        </Link>
      </div>

      {orgNeeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 text-xs text-slate-500 shadow-sm">
          <p>No open needs registered under your organization.</p>
        </div>
      )}

    </div>
  );
}
