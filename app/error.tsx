'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors securely without leaking confidential data
    console.error('Application Error Boundary Triggered:', error?.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center space-y-6 shadow-panel">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-foreground">
            Service Communication Notice
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            The platform encountered a controlled error while communicating with backend data services. Zero-PII security policies prevent automatic retry with stale data.
          </p>
          {error.digest && (
            <div className="text-[10px] font-mono text-muted pt-1">
              Error Digest: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-foreground text-surface text-xs font-mono font-medium hover:bg-foreground/90 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-surfaceSubtle border border-border text-foreground text-xs font-mono font-medium hover:bg-surfaceHover transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
