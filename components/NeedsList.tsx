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
    { value: 'All', label: 'All Needs', icon: Sparkles },
    { value: 'laptop', label: 'Laptops & Computers', icon: Laptop },
    { value: 'mentor', label: 'Volunteer Mentors', icon: Code },
    { value: 'refurbishment_fund', label: 'Refurbishment Funds', icon: Wrench },
    { value: 'arduino_kit', label: 'STEM & Robotics Kits', icon: Cpu },
    { value: 'internet_sponsorship', label: 'Internet Sponsorships', icon: Wifi },
    { value: 'books', label: 'Workbooks & Supplies', icon: BookOpen },
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
    <div className="space-y-8">
      {/* Type pill selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        {typeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedType(opt.value)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specific item, school, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            aria-label="Filter priority"
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Standard</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredNeeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.map((need) => (
            <NeedCard
              key={need.id}
              need={need}
              onFulfillClick={(n: NeedItem) => setSelectedNeed(n)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No open needs match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try selecting &ldquo;All Needs&rdquo; or clearing your search term.
          </p>
        </div>
      )}

      {/* Donation Modal */}
      {selectedNeed && activeProject && (
        <DonationModal
          project={activeProject}
          need={selectedNeed}
          isOpen={!!selectedNeed}
          onClose={() => setSelectedNeed(null)}
        />
      )}
    </div>
  );
};
