'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { NeedCard } from '@/components/NeedCard';
import { DonationModal } from '@/components/DonationModal';
import { NeedItem } from '@/lib/types';
import { Search, Sparkles, Filter, Laptop, Code, Wrench, Cpu, Wifi, BookOpen, X } from 'lucide-react';

export default function NeedsPage() {
  const { needs, projects } = useStore();
  const [selectedNeed, setSelectedNeed] = useState<NeedItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [filterFulfilled, setFilterFulfilled] = useState<boolean>(false);

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
    return needs.filter((need) => {
      const matchesSearch = 
        need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || need.type === selectedType;
      const matchesPriority = selectedPriority === 'All' || need.priority === selectedPriority;
      const matchesFulfilled = filterFulfilled ? true : !need.fulfilled;

      return matchesSearch && matchesType && matchesPriority && matchesFulfilled;
    });
  }, [needs, searchQuery, selectedType, selectedPriority, filterFulfilled]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Transparent Needs Registry
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Live Needs Marketplace
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Explore individual tangible requirements requested by verified childcare centers. You can fulfill specific laptops, mentor hours, hardware kits, or educational guides directly.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by need (e.g. laptop, python mentor, router, kits)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Priority */}
          <div className="md:col-span-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="urgent">Urgent Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
            </select>
          </div>

          {/* Show Fulfilled Checkbox */}
          <div className="md:col-span-3 flex items-center gap-2 pl-1">
            <input
              type="checkbox"
              id="fulfilledToggle"
              checked={filterFulfilled}
              onChange={(e) => setFilterFulfilled(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="fulfilledToggle" className="text-xs text-slate-600 font-medium select-none">
              Include completed needs
            </label>
          </div>

        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {typeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing <strong>{filteredNeeds.length}</strong> live requirements</span>
        {(searchQuery || selectedType !== 'All' || selectedPriority !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
              setSelectedPriority('All');
            }}
            className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Needs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNeeds.map((need) => (
          <NeedCard
            key={need.id}
            need={need}
            onFulfillClick={(n) => setSelectedNeed(n)}
          />
        ))}
      </div>

      {/* Donation Modal for Fulfilling */}
      <DonationModal
        need={selectedNeed}
        isOpen={Boolean(selectedNeed)}
        onClose={() => setSelectedNeed(null)}
      />

    </div>
  );
}
