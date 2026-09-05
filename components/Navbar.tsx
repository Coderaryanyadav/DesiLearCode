'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search, 
  ChevronRight, 
  LogOut, 
  User, 
  Shield, 
  Laptop,
  Terminal,
  Activity
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
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/needs', label: 'Hardware Needs' },
    { href: '/how-it-works', label: 'Infrastructure' },
    { href: '/volunteer', label: 'Mentorship' },
    { href: '/organizations', label: 'Verified Partners' },
    { href: '/impact', label: 'Audit & Impact' },
  ];

  const getDashboardHref = () => {
    if (currentRole === 'admin') return '/admin';
    if (currentRole === 'ngo') return '/ngo/dashboard';
    if (currentRole === 'volunteer') return '/dashboard/volunteering';
    return '/dashboard';
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-colors duration-200 border-b ${
        scrolled 
          ? 'bg-surface/95 backdrop-blur-md border-border shadow-subtle' 
          : 'bg-surface/80 backdrop-blur-sm border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & System Status */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded bg-foreground flex items-center justify-center text-surface font-mono font-black text-xs">
                DL
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight leading-none">
                  DesiLearCode
                </span>
                <span className="text-[10px] font-mono text-muted tracking-wide mt-0.5 hidden sm:block">
                  INFRASTRUCTURE • 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive 
                        ? 'text-foreground bg-surfaceSubtle font-semibold' 
                        : 'text-muted hover:text-foreground hover:bg-surfaceSubtle/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Verified Open Platform Badge */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              <span>COMMUNITY INFRASTRUCTURE</span>
            </div>

            {/* Authenticated State */}
            {!isLoading && isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surfaceSubtle transition-colors text-xs"
                >
                  <div className="w-5 h-5 rounded bg-foreground text-surface flex items-center justify-center font-mono font-bold text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium text-foreground">{currentUser.name}</span>
                  <span className="text-[10px] font-mono text-muted uppercase">({currentUser.role})</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-elevation border border-border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-border">
                        <div className="font-bold text-xs text-foreground truncate">{currentUser.name}</div>
                        <div className="text-[11px] font-mono text-muted truncate mt-0.5">{currentUser.email}</div>
                      </div>
                      <div className="py-1">
                        <Link
                          href={getDashboardHref()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-1.5 rounded hover:bg-surfaceSubtle text-foreground text-xs font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {currentUser.role === 'admin' ? <Shield className="w-3.5 h-3.5 text-primary-500" /> : <User className="w-3.5 h-3.5 text-primary-500" />}
                            Control Panel
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted" />
                        </Link>
                      </div>
                      <div className="pt-1 border-t border-border">
                        <form action={logout}>
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-error-600 hover:bg-error-50 text-xs font-medium transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Disconnect Session
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : !isLoading ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-foreground hover:bg-surfaceSubtle transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/donate-device"
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-foreground text-surface hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  Pledge Hardware
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md border border-border text-foreground hover:bg-surfaceSubtle transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface shadow-elevation animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors flex justify-between items-center ${
                      isActive ? 'bg-surfaceSubtle font-semibold text-foreground' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 text-primary-500" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 text-center text-xs font-medium rounded bg-surfaceSubtle border border-border text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/donate-device"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 text-center text-xs font-medium rounded bg-foreground text-surface flex items-center justify-center gap-1.5"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    Pledge Hardware
                  </Link>
                </>
              ) : (
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-medium rounded bg-foreground text-surface"
                >
                  Open Control Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
