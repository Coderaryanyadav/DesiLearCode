'use client';

import React, { useState } from 'react';
import { Organization } from '@/lib/types';
import { OrganizationCard } from '@/components/OrganizationCard';
import { Building2, Search, X } from 'lucide-react';

interface OrganizationsListProps {
  initialOrganizations: Organization[];
}

export const OrganizationsList: React.FC<OrganizationsListProps> = ({ initialOrganizations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'verified' | 'under_review'>('All');

  const filtered = initialOrganizations.filter((org) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || org.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-panel">
        <div className="relative w-full sm:w-96">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partner by name, region, or focus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-7 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs font-mono">
          {(['All', 'verified', 'under_review'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors border ${
                filterStatus === st
                  ? 'bg-foreground text-surface border-foreground shadow-subtle'
                  : 'bg-surfaceSubtle text-muted border-border hover:bg-surfaceHover hover:text-foreground'
              }`}
            >
              {st === 'All' ? 'All Partners' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((org) => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      ) : (
        <div className="p-10 bg-surface rounded-xl border border-border text-center space-y-2">
          <Building2 className="w-6 h-6 text-muted mx-auto" />
          <h3 className="text-xs font-mono font-bold text-foreground">No organizations found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search keywords or filter status.
          </p>
        </div>
      )}
    </div>
  );
};
