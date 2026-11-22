import React from 'react';

export default function OrganizationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse" aria-busy="true">
      <div className="space-y-3 max-w-3xl">
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-8 sm:h-10 w-72 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            </div>
            <div className="h-14 w-full rounded bg-slate-100 dark:bg-slate-900 skeleton-shimmer" />
            <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
