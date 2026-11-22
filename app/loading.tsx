import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-pulse" aria-busy="true" aria-label="Loading content">
      
      {/* Hero Skeleton */}
      <div className="space-y-4 max-w-3xl">
        <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-10 sm:h-12 w-full max-w-2xl rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-4 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="pt-2 flex flex-wrap gap-3">
          <div className="h-11 w-36 rounded-lg bg-slate-300 dark:bg-slate-700 skeleton-shimmer" />
          <div className="h-11 w-36 rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        </div>
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-surface space-y-2">
            <div className="h-7 w-20 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Featured Cards Grid Skeleton */}
      <div className="space-y-4 pt-6">
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 space-y-4">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-14 w-full rounded bg-slate-100 dark:bg-slate-900 skeleton-shimmer" />
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
