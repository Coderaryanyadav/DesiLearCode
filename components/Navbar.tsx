'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search,
  Bell,
  ChevronRight,
  LogOut,
  User,
  Shield,
  Laptop
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/app/actions/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentRole, currentUser, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/how-it-works', label: 'Learn' },
    { href: '/volunteer', label: 'Opportunities' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/about', label: 'About' },
  ];

  const getDashboardHref = () => {
    if (currentRole === 'admin') return '/admin';
    if (currentRole === 'ngo') return '/ngo/dashboard';
    if (currentRole === 'volunteer') return '/dashboard/volunteering';
    return '/dashboard';
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-surface/80 backdrop-blur-xl border-b border-border shadow-soft' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center overflow-hidden shadow-card border border-border group-hover:shadow-card-hover transition-all">
                <img src="/logo.jpg" alt="DesiLearCode" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">DesiLearCode</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-foreground bg-surfaceHover' 
                        : 'text-muted hover:text-foreground hover:bg-surfaceHover/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search (Icon only for now) */}
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-foreground hover:bg-surfaceHover transition-colors">
              <Search className="w-4 h-4" />
            </button>

            {/* Authenticated User Menu or Sign In */}
            {!isLoading && isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-foreground hover:bg-surfaceHover transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary-500 border border-surface"></span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border bg-surface hover:bg-surfaceHover transition-all shadow-card"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-foreground">{currentUser.name}</span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl shadow-float border border-border p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-3 py-3 border-b border-border">
                          <div className="font-semibold text-foreground truncate">{currentUser.name}</div>
                          <div className="text-xs text-muted truncate mt-0.5">{currentUser.email}</div>
                        </div>
                        <div className="py-2 space-y-1">
                          <Link
                            href={getDashboardHref()}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surfaceHover text-foreground text-sm font-medium transition-colors"
                          >
                            <span className="flex items-center gap-2.5">
                              {currentUser.role === 'admin' ? <Shield className="w-4 h-4 text-primary-500" /> : <User className="w-4 h-4 text-primary-500" />}
                              Dashboard
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted" />
                          </Link>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <form action={logout}>
                            <button
                              type="submit"
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-error-600 hover:bg-error-50 text-sm font-medium transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </form>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : !isLoading ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-surfaceHover transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/donate-device"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-foreground text-surface hover:bg-foreground/90 transition-all shadow-card flex items-center gap-2"
                >
                  <Laptop className="w-4 h-4" />
                  Donate Device
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-foreground hover:bg-surfaceHover transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Refined) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-border shadow-float animate-in slide-in-from-top-4 duration-300 origin-top">
          <div className="px-4 py-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surfaceHover border-none text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              />
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3.5 rounded-xl text-base font-medium transition-colors flex justify-between items-center ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-foreground hover:bg-surfaceHover'
                    }`}
                  >
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 text-primary-500" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-border flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 text-center text-sm font-medium rounded-xl bg-surfaceHover text-foreground"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 text-center text-sm font-medium rounded-xl bg-foreground text-surface shadow-card"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/donate-device"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 text-center text-sm font-medium rounded-xl bg-primary-600 text-white shadow-card flex items-center justify-center gap-2"
                  >
                    <Laptop className="w-4 h-4" />
                    Donate a Device
                  </Link>
                </>
              ) : (
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 text-center text-sm font-medium rounded-xl bg-foreground text-surface shadow-card"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
