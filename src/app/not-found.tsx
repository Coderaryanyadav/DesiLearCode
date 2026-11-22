import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center space-y-6 shadow-panel">
        <div className="w-12 h-12 rounded-full bg-surfaceSubtle border border-border text-muted flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-primary-600 uppercase tracking-wider">
            404 • Not Found
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Initiative or Resource Not Found
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            The requested initiative, tracking code, or page does not exist in the public ledger or has been archived following milestone completion.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-foreground text-surface text-xs font-mono font-medium hover:bg-foreground/90 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Initiatives</span>
          </Link>
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
