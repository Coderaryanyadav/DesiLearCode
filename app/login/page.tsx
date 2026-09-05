'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DEMO_USERS } from '@/lib/mock-data';
import { UserRole } from '@/lib/types';
import { Laptop, HeartHandshake, UserCheck, Building2, Shield, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, setRole } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'user@example.com', selectedRole);
    if (selectedRole === 'admin') router.push('/admin');
    else if (selectedRole === 'ngo') router.push('/ngo/dashboard');
    else router.push('/dashboard');
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setRole(role);
    if (role === 'admin') router.push('/admin');
    else if (role === 'ngo') router.push('/ngo/dashboard');
    else if (role === 'volunteer') router.push('/dashboard/volunteering');
    else router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
          <Laptop className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to TechForKids
        </h1>
        <p className="text-xs text-slate-500">
          Access your transparent contribution history, device tracker, or management portal.
        </p>
      </div>

      {/* Quick Interactive Demo Login Buttons */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          ⚡ 1-Click Interactive Demo Login
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickDemoLogin('donor')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition text-left flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Donor</div>
              <div className="text-[10px] text-slate-500">Pledges & devices</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('volunteer')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition text-left flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Volunteer</div>
              <div className="text-[10px] text-slate-500">Hours & sessions</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('ngo')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition text-left flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">NGO Lead</div>
              <div className="text-[10px] text-slate-500">Manage initiatives</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('admin')}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition text-left flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Platform Admin</div>
              <div className="text-[10px] text-slate-500">Audit & verification</div>
            </div>
          </button>
        </div>
      </div>

      {/* Standard Credentials Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-700">Or sign in with email:</div>
        
        <form onSubmit={handleCustomLogin} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya.donor@techforkids.org"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Persona Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer Mentor</option>
              <option value="ngo">NGO Partner Lead</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm"
          >
            Sign In
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Register as Volunteer or NGO
          </Link>
        </div>
      </div>

    </div>
  );
}
