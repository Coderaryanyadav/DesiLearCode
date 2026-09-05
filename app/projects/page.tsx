'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { ProjectCard } from '@/components/ProjectCard';
import { DonationModal } from '@/components/DonationModal';
import { Project, ProjectCategory } from '@/lib/types';
import { Search, Filter, SlidersHorizontal, Layers, MapPin, Sparkles, X } from 'lucide-react';

export default function ProjectsPage() {
  const { projects } = useStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'most_needed' | 'almost_complete' | 'recently_updated'>('most_needed');

  const categories = [
    'All',
    'Technology',
    'Education',
    'STEM',
    'Coding',
    'Cybersecurity',
    'AI',
    'Internet Access',
    'School Supplies',
    'Infrastructure'
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search query
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.region.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

      // Urgency
      const matchesUrgency = selectedUrgency === 'All' || project.urgency === selectedUrgency;

      return matchesSearch && matchesCategory && matchesUrgency;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'almost_complete') {
        return b.progressPercentage - a.progressPercentage;
      }
      if (sortBy === 'recently_updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      // default: most needed (lower progress or higher urgency)
      return a.progressPercentage - b.progressPercentage;
    });
  }, [projects, searchQuery, selectedCategory, selectedUrgency, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedUrgency('All');
    setSortBy('most_needed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Project Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Verified Community Projects
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Discover vetted initiatives providing computers, digital education, robotics, and connectivity to children in care homes and community learning hubs.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organization, keyword or location..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Urgency Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Urgencies</option>
              <option value="critical">Critical Urgency</option>
              <option value="high">High Urgency</option>
              <option value="normal">Standard Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
            >
              <option value="most_needed">Sort: Most Needed First</option>
              <option value="almost_complete">Sort: Almost Complete</option>
              <option value="newest">Sort: Newest Added</option>
              <option value="recently_updated">Sort: Recently Updated</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full shrink-0 font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing <strong>{filteredProjects.length}</strong> active initiatives</span>
        {(searchQuery || selectedCategory !== 'All' || selectedUrgency !== 'All') && (
          <button
            onClick={clearFilters}
            className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSupportClick={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Projects Found</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We couldn&apos;t find any initiatives matching your current filter criteria. Try clearing your search keywords or switching category filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Donation Modal */}
      <DonationModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
}
