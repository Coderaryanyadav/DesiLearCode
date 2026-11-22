'use client';

import React, { useState, useMemo } from 'react';
import { AuditLogEntry } from '@/lib/types';
import { Search, Shield, Clock, Terminal } from 'lucide-react';

interface AdminAuditLogsViewProps {
  initialLogs: AuditLogEntry[];
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ initialLogs }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return initialLogs.filter((log) => {
      const matchQuery = 
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.targetId.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === 'All' || log.actorRole === roleFilter;
      return matchQuery && matchRole;
    });
  }, [initialLogs, search, roleFilter]);

  return (
    <div className="space-y-4">
      
      {/* Filter bar */}
      <div className="bg-surface p-3.5 rounded-xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-panel">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or details..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-muted text-[11px]">ROLE:</span>
          {['All', 'admin', 'ngo', 'volunteer', 'donor', 'visitor'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors border ${
                roleFilter === r 
                  ? 'bg-foreground text-surface border-foreground' 
                  : 'bg-surfaceSubtle text-muted border-border hover:bg-surfaceHover hover:text-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-panel">
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surfaceSubtle text-muted font-mono font-bold uppercase text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Target Reference</th>
                  <th className="p-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surfaceSubtle/50 transition-colors font-mono">
                    <td className="p-3 text-muted text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-foreground font-sans">{log.actorName}</div>
                      <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded border border-primary-200">
                        {log.actorRole.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-foreground text-[11px] bg-surfaceSubtle px-2 py-0.5 rounded border border-border">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-muted truncate max-w-[140px]">
                      {log.targetType}:{log.targetId.slice(0, 8)}
                    </td>
                    <td className="p-3 text-foreground font-sans text-xs max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-muted">
            No security audit logs match current filter query.
          </div>
        )}
      </div>
    </div>
  );
};
