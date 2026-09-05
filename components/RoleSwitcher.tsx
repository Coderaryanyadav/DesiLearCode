'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { Shield, UserCheck, HeartHandshake, Building2, User, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setRole, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: any; dashboardUrl: string }[] = [
    { role: 'visitor', label: 'Visitor', desc: 'Browse projects & impact', icon: User, dashboardUrl: '/' },
    { role: 'donor', label: 'Donor', desc: 'Pledges, devices & receipts', icon: HeartHandshake, dashboardUrl: '/dashboard' },
    { role: 'volunteer', label: 'Volunteer', desc: 'Applications & service hours', icon: UserCheck, dashboardUrl: '/dashboard/volunteering' },
    { role: 'ngo', label: 'NGO Lead', desc: 'Manage projects, needs & volunteers', icon: Building2, dashboardUrl: '/ngo/dashboard' },
    { role: 'admin', label: 'Platform Admin', desc: 'Verifications, moderation & audit logs', icon: Shield, dashboardUrl: '/admin' },
  ];

  const currentRoleInfo = roles.find(r => r.role === currentRole) || roles[0];
  const Icon = currentRoleInfo.icon;

  return (
    <div className="relative inline-block text-left z-50">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm border border-slate-700"
          title="Switch demo persona"
        >
          <Icon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Role: <strong className="text-emerald-400 font-bold">{currentRoleInfo.label}</strong></span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {currentRole !== 'visitor' && (
          <Link
            href={currentRoleInfo.dashboardUrl}
            className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-200"
          >
            My Portal →
          </Link>
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/10 focus:outline-none z-50 border border-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Interactive Demo Personas</p>
              <p className="text-xs text-slate-600 mt-0.5">Switch perspective to test role permissions:</p>
            </div>
            <div className="py-1.5 space-y-1">
              {roles.map(r => {
                const RoleIcon = r.icon;
                const isSelected = r.role === currentRole;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      setRole(r.role);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                      isSelected ? 'bg-indigo-50 text-indigo-950 font-medium' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{r.label}</div>
                        <div className="text-[11px] text-slate-500">{r.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex justify-between items-center">
              <span>Active: {currentUser.name}</span>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-indigo-600 hover:underline font-semibold">
                Sign In Page
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
