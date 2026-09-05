'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowLeft, Shield, Clock, Search, Filter } from 'lucide-react';

export default function AdminAuditLogPage() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchQuery = 
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.targetId.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === 'All' || log.actorRole === roleFilter;
      return matchQuery && matchRole;
    });
  }, [auditLogs, search, roleFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              System Transparency
            </span>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Immutable
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Administrative Audit Trail ({auditLogs.length})
          </h1>
          <p className="text-xs text-slate-500">
            Cryptographically structured event log capturing all state changes, verifications, status transitions, and support pledges.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, target or detail..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Actor Role:
          </span>
          {['All', 'admin', 'ngo', 'donor', 'volunteer'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full font-medium transition capitalize ${
                roleFilter === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Timestamp</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Target</th>
                <th className="p-3.5 rounded-r-xl">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <strong className="text-slate-900 block font-semibold">{log.actorName}</strong>
                    <span className="text-[10px] text-slate-500 capitalize">{log.actorRole}</span>
                  </td>
                  <td className="p-3.5 text-slate-600 whitespace-nowrap">
                    <span className="uppercase text-[10px] text-slate-400 block">{log.targetType}</span>
                    <span className="font-bold text-slate-800">#{log.targetId}</span>
                  </td>
                  <td className="p-3.5 font-sans text-slate-700 max-w-md leading-relaxed">
                    {log.details}
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
