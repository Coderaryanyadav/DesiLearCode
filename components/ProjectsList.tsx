'use client';

import React, { useState, useMemo } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { DonationModal } from '@/components/DonationModal';
import { Project } from '@/lib/types';
import { Search, Filter, Layers, X, Sparkles } from 'lucide-react';

interface ProjectsListProps {
  initialProjects: Project[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ initialProjects }) => {
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
    return initialProjects.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
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
      return a.progressPercentage - b.progressPercentage;
    });
  }, [initialProjects, searchQuery, selectedCategory, selectedUrgency, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedUrgency('All');
    setSortBy('most_needed');
  };

  return (
    <div className="space-y-8">
      {/* Controls / Filter Bar */}
      <div className="bg-surface p-4 sm:p-6 rounded-3xl border border-border shadow-soft space-y-5">
        
        {/* Top row: Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project name, NGO, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:text-foreground transition"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
            <span className="text-sm text-muted font-medium hidden sm:inline-block">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort projects"
              className="px-4 py-3 text-sm font-medium rounded-2xl border border-border bg-surfaceHover focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-foreground cursor-pointer transition-all"
            >
              <option value="most_needed">Highest Need (Lowest %)</option>
              <option value="almost_complete">Almost Funded</option>
              <option value="newest">Recently Added</option>
              <option value="recently_updated">Recently Updated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted mr-2 shrink-0">
            <Filter className="w-4 h-4" /> <span>Category</span>
          </div>
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-foreground text-surface border-foreground shadow-card'
                    : 'bg-surface border-border text-foreground hover:bg-surfaceHover hover:border-muted/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filter Info & Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted px-2 gap-4">
        <div>
          Showing <strong className="text-foreground">{filteredProjects.length}</strong> active projects
          {selectedCategory !== 'All' && <span> in <strong className="text-foreground">{selectedCategory}</strong></span>}
          {searchQuery && <span> matching &ldquo;<strong className="text-foreground">{searchQuery}</strong>&rdquo;</span>}
        </div>

        {(selectedCategory !== 'All' || selectedUrgency !== 'All' || searchQuery) && (
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSupportClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-3xl p-12 lg:p-20 text-center border border-border shadow-sm flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-surfaceHover border border-border flex items-center justify-center">
            <Layers className="w-8 h-8 text-muted" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No projects found</h3>
            <p className="text-base text-muted max-w-md mx-auto">
              We couldn&apos;t find any verified projects matching your selected filter criteria. Try broadening your search.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-6 py-3 rounded-xl bg-foreground text-surface font-medium hover:bg-foreground/90 transition shadow-float"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Donation Modal */}
      <DonationModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
