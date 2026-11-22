'use client';

import React, { useState, useMemo } from 'react';
import { NeedItem, Project } from '@/lib/types';
import { NeedCard } from '@/components/NeedCard';
import { DonationModal } from '@/components/DonationModal';
import { Search, Sparkles, Laptop, Code, Wrench, Cpu, Wifi, BookOpen, X, Layers } from 'lucide-react';

interface NeedsListProps {
  initialNeeds: NeedItem[];
  projects: Project[];
}

export const NeedsList: React.FC<NeedsListProps> = ({ initialNeeds, projects }) => {
  const [selectedNeed, setSelectedNeed] = useState<NeedItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const typeOptions = [
    { value: 'All', label: 'All Inventory', icon: Sparkles },
    { value: 'laptop', label: 'Laptops & PCs', icon: Laptop },
    { value: 'mentor', label: 'Engineering Mentors', icon: Code },
    { value: 'refurbishment_fund', label: 'Refurbish Funds', icon: Wrench },
    { value: 'arduino_kit', label: 'STEM & Robotics', icon: Cpu },
    { value: 'internet_sponsorship', label: 'Internet Lines', icon: Wifi },
    { value: 'books', label: 'Curriculum Books', icon: BookOpen },
  ];

  const filteredNeeds = useMemo(() => {
    return initialNeeds.filter((need) => {
      const matchesSearch = 
        need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || need.type === selectedType;
      const matchesPriority = selectedPriority === 'All' || need.priority === selectedPriority;

      return matchesSearch && matchesType && matchesPriority;
    });
  }, [initialNeeds, searchQuery, selectedType, selectedPriority]);

  const activeProject = selectedNeed
    ? projects.find((p) => p.id === selectedNeed.projectId) || null
    : null;

  return (
    <div className="space-y-6">
      
      {/* Type pill selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {typeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedType(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-medium whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-foreground text-surface border-foreground shadow-subtle'
                  : 'bg-surfaceSubtle text-muted border-border hover:bg-surfaceHover hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-surface p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-panel">
        <div className="relative w-full sm:w-96">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter item name, lab, or purpose..."
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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-mono text-muted">PRIORITY:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            aria-label="Filter priority"
            className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-md border border-border bg-surfaceSubtle text-foreground cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
            <option value="medium">Normal Priority</option>
            <option value="low">Standard</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredNeeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNeeds.map((need) => (
            <NeedCard
              key={need.id}
              need={need}
              onFulfillClick={(n: NeedItem) => setSelectedNeed(n)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl p-10 text-center border border-border space-y-2">
          <Layers className="w-6 h-6 text-muted mx-auto" />
          <h3 className="text-xs font-mono font-bold text-foreground">No open items match filter criteria</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try resetting your type filter or clearing the search query.
          </p>
        </div>
      )}

      {/* Donation Modal */}
      {selectedNeed && activeProject && (
        <DonationModal
          project={activeProject}
          need={selectedNeed}
          isOpen={Boolean(selectedNeed)}
          onClose={() => setSelectedNeed(null)}
        />
      )}
    </div>
  );
};
