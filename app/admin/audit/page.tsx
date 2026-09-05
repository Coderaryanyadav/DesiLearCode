import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAuditLogsForAdmin } from '@/lib/db/audit';
import { AdminAuditLogsView } from '@/components/AdminAuditLogsView';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Audit Trail & Event Log — TechForKids Admin',
};

export default async function AdminAuditLogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const auditLogs = await getAuditLogsForAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            System Transparency
          </span>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            PostgreSQL Append-Only
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Administrative Audit Trail ({auditLogs.length})
        </h1>
        <p className="text-xs text-slate-500">
          Structured event log capturing all state changes, verifications, status transitions, and support pledges.
        </p>
      </div>

      <AdminAuditLogsView initialLogs={auditLogs} />

    </div>
  );
}
