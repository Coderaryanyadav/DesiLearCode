import React from 'react';

export default function ProjectsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse" aria-busy="true">
      {/* Editorial Header Skeleton */}
      <div className="space-y-3 max-w-3xl">
        <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-8 sm:h-10 w-72 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="h-12 w-full rounded-xl bg-surface border border-border p-2 flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-6 flex-1 rounded bg-slate-100 dark:bg-slate-900 skeleton-shimmer" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface overflow-hidden space-y-4">
            <div className="h-10 bg-surfaceSubtle border-b border-border flex items-center justify-between p-3">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            </div>
            <div className="p-5 space-y-4">
              <div className="h-6 w-4/5 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-12 w-full rounded bg-slate-100 dark:bg-slate-900 skeleton-shimmer" />
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
