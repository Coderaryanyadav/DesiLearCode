'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronRight, 
  LogOut, 
  User, 
  Laptop,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/app/actions/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentRole, currentUser, isAuthenticated, isLoading } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Scroll detection for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open & listen for Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/donate-device', label: 'Give' },
    { href: '/volunteer', label: 'Volunteer' },
    { href: '/impact', label: 'Impact' },
    { href: '/how-it-works', label: 'How it works' },
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
          : 'bg-surface/90 backdrop-blur-sm border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center text-surface font-mono font-black text-xs">
                DL
              </div>
              <span className="font-display font-extrabold text-base sm:text-lg text-foreground tracking-tight">
                DesiLearCode
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Desktop Navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
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
            
            {/* Authenticated State (Desktop & Mobile trigger) */}
            {!isLoading && isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md border border-border bg-surface hover:bg-surfaceSubtle transition-colors text-xs font-medium touch-target"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User Account Menu"
                >
                  <div className="w-5 h-5 rounded bg-foreground text-surface flex items-center justify-center font-mono font-bold text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-foreground">{currentUser.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-md bg-surface border border-border shadow-panel py-1 text-xs z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-border">
                      <div className="font-semibold text-foreground truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-muted truncate">{currentUser.email}</div>
                    </div>
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-foreground hover:bg-surfaceSubtle transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary-600" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-3 py-2.5 text-error-700 hover:bg-error-50 transition-colors flex items-center gap-2 border-t border-border"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : !isLoading && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium text-foreground hover:bg-surfaceSubtle transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/donate-device"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-foreground text-surface hover:bg-foreground/90 text-xs sm:text-sm font-medium transition-colors shadow-subtle"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Donate a device</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden touch-target p-2 rounded-md text-foreground hover:bg-surfaceSubtle transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Redesigned Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          ref={drawerRef}
          className="fixed inset-x-0 top-16 bottom-0 z-50 bg-surface/98 backdrop-blur-md md:hidden flex flex-col justify-between overflow-y-auto border-t border-border p-5 safe-pb animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="space-y-4">
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-surfaceSubtle text-foreground font-semibold' 
                        : 'text-foreground hover:bg-surfaceSubtle/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>
                );
              })}
            </nav>

            <div className="my-2 border-t border-border" />

            <div className="space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-medium text-foreground hover:bg-surfaceSubtle transition-colors"
                  >
                    <span>Sign in</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>

                  <div className="pt-2">
                    <Link
                      href="/donate-device"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3.5 px-4 rounded-lg bg-foreground text-surface font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-subtle touch-target"
                    >
                      <Laptop className="w-4 h-4" />
                      <span>Donate a device</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-medium text-foreground hover:bg-surfaceSubtle transition-colors"
                  >
                    <span>Dashboard ({currentUser?.name})</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-error-700 hover:bg-error-50 text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-border text-center text-xs text-muted">
            <p>DesiLearCode • Verified Educational Resource Matching</p>
          </div>
        </div>
      )}
    </header>
  );
};
