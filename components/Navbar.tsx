'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Laptop, 
  Menu, 
  X, 
  Layers, 
  Sparkles, 
  Building2, 
  UserCheck, 
  BarChart3, 
  Info,
  ChevronRight,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/app/actions/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentRole, currentUser, isAuthenticated, isLoading } = useAuth();

  const navLinks = [
    { href: '/projects', label: 'Projects', icon: Layers },
    { href: '/needs', label: 'Needs Marketplace', icon: Sparkles, badge: 'Live' },
    { href: '/organizations', label: 'Verified NGOs', icon: Building2 },
    { href: '/volunteer', label: 'Volunteer', icon: UserCheck },
    { href: '/donate-device', label: 'Donate Device', icon: Laptop },
    { href: '/how-it-works', label: 'How It Works', icon: Info },
    { href: '/impact', label: 'Impact', icon: BarChart3 },
  ];

  const getDashboardHref = () => {
    if (currentRole === 'admin') return '/admin';
    if (currentRole === 'ngo') return '/ngo/dashboard';
    if (currentRole === 'volunteer') return '/dashboard/volunteering';
    return '/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">TechForKids</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                  Trust
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Technology. Education. Opportunity.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive 
                      ? 'text-indigo-600 bg-indigo-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Action button */}
            <Link
              href="/donate-device"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Donate Device</span>
            </Link>

            {/* Authenticated User Menu or Sign In */}
            {!isLoading && isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-xs font-medium text-slate-700"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-semibold">{currentUser.name}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {currentUser.role}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      </div>
                      <div className="py-1 space-y-0.5">
                        <Link
                          href={getDashboardHref()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                        >
                          <span className="flex items-center gap-2">
                            {currentUser.role === 'admin' ? <Shield className="w-3.5 h-3.5 text-indigo-600" /> : <User className="w-3.5 h-3.5 text-indigo-600" />}
                            Role Portal
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        {currentUser.role === 'donor' && (
                          <Link
                            href="/dashboard/donations"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700"
                          >
                            My Donations & Receipts
                          </Link>
                        )}
                        {currentUser.role === 'donor' && (
                          <Link
                            href="/dashboard/devices"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700"
                          >
                            My Donated Devices
                          </Link>
                        )}
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <form action={logout}>
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium transition"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : !isLoading ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const ItemIcon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/donate-device"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Laptop className="w-4 h-4" />
              Donate a Device
            </Link>
            <Link
              href="/volunteer/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
            >
              Volunteer as Mentor
            </Link>
            {isAuthenticated ? (
              <Link
                href={getDashboardHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Go to Portal ({currentRole})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-indigo-600"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
