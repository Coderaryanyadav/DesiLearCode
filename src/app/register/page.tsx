'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Laptop } from 'lucide-react';
import { signup } from '@/app/actions/auth';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    
    setIsPending(false);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-surface mx-auto shadow-md">
          <Laptop className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
          Create DesiLearCode Account
        </h1>
        <p className="text-xs text-muted max-w-xs mx-auto">
          Join our network of donors, volunteer mentors, and verified child-care institutions.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-7 shadow-xs space-y-4">
        
        {error && (
          <div className="p-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              autoComplete="name"
              placeholder="e.g. Vikram Joshi"
              className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="vikram@example.org"
              className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">I am joining as a:</label>
            <select
              name="role"
              className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
            >
              <option value="donor">Donor (Support projects & donate computers)</option>
              <option value="volunteer">Volunteer (Mentor coding & digital skills)</option>
              <option value="ngo">NGO / Organization Representative</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full min-h-[48px] py-3 rounded-xl bg-foreground hover:bg-foreground/90 text-surface font-semibold text-xs transition shadow-xs disabled:opacity-50 flex items-center justify-center"
          >
            {isPending ? 'Creating Account...' : 'Create Account & Continue'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-muted">
          Already registered?{' '}
          <Link href="/login" className="text-primary-600 font-bold hover:underline p-1 inline-block touch-target">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
