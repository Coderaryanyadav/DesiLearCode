import React from 'react';

export default function ImpactLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-pulse" aria-busy="true">
      <div className="space-y-3 max-w-3xl">
        <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-8 sm:h-10 w-80 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-border bg-surface space-y-2">
            <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
            <div className="h-16 w-full rounded bg-slate-100 dark:bg-slate-900 skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
