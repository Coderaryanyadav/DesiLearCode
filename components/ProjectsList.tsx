'use client';

import React, { useState, useMemo } from 'react';
import { ProjectCard, ProjectListRow } from '@/components/ProjectCard';
import { DonationModal } from '@/components/DonationModal';
import { Project } from '@/lib/types';
import { Search, Filter, Layers, X, LayoutGrid, List } from 'lucide-react';

interface ProjectsListProps {
  initialProjects: Project[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ initialProjects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'most_needed' | 'almost_complete' | 'recently_updated'>('most_needed');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All',
    'Technology',
    'Education',
    'STEM',
    'Coding',
    'Cybersecurity',
    'Hardware',
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
    <div className="space-y-6">
      
      {/* Control Console */}
      <div className="bg-surface p-4 sm:p-5 rounded-xl border border-border space-y-4 shadow-panel">
        
        {/* Top search & sorting toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search initiatives by title, partner NGO, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-muted hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort initiatives"
              className="px-3 py-2 text-xs font-mono font-medium rounded-md border border-border bg-surfaceSubtle focus:outline-none focus:border-primary-500 text-foreground cursor-pointer"
            >
              <option value="most_needed">Sort: Highest Need First</option>
              <option value="almost_complete">Sort: Almost Funded</option>
              <option value="newest">Sort: Recently Added</option>
              <option value="recently_updated">Sort: Recently Updated</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-md overflow-hidden bg-surfaceSubtle">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-surface text-foreground shadow-subtle' : 'text-muted hover:text-foreground'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-surface text-foreground shadow-subtle' : 'text-muted hover:text-foreground'}`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-1 px-1 touch-pan-x text-xs">
          <span className="text-[11px] font-mono text-muted uppercase shrink-0 mr-1">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all border flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-foreground text-surface border-foreground font-bold shadow-xs'
                  : 'bg-surfaceSubtle border-border text-muted hover:text-foreground hover:bg-surfaceHover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Metas */}
      <div className="flex items-center justify-between text-xs font-mono text-muted px-1">
        <div>
          Showing <strong className="text-foreground">{filteredProjects.length}</strong> active initiatives
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
        </div>

        {(selectedCategory !== 'All' || selectedUrgency !== 'All' || searchQuery) && (
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Projects Display */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSupportClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <ProjectListRow
                key={project.id}
                project={project}
                onSupportClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-surface rounded-xl p-12 text-center border border-border flex flex-col items-center justify-center space-y-3">
          <Layers className="w-8 h-8 text-muted" />
          <h3 className="font-bold text-sm text-foreground">No initiatives found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            No projects matched your active search query or filter tags.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-md bg-foreground text-surface text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            Clear Filters
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
};
