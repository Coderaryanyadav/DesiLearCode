'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface text-muted pt-10 sm:pt-14 pb-8 sm:pb-10 border-t border-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 sm:pb-12 border-b border-border">
          
          {/* Mission & Privacy Banner */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center font-mono font-black text-surface text-xs">
                DL
              </div>
              <span className="font-display font-extrabold text-base text-foreground tracking-tight">
                DesiLearCode
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Social impact platform connecting hardware donations, engineering mentors, and verified grassroots educational learning centers across India.
            </p>

            <div className="p-3 rounded-lg bg-surfaceSubtle border border-border space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Zero-PII Child Safeguarding Charter</span>
              </div>
              <p className="text-[11px] text-muted leading-normal">
                Strict minor privacy protection. No individual student faces, names, or localized shelter coordinates are publicly exposed.
              </p>
            </div>
          </div>

          {/* Links Section Grid on Mobile (2 cols on mobile, 3 cols on desktop) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            
            {/* Column 1: Programs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-foreground tracking-wider font-mono">Programs</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/projects" className="hover:text-foreground transition-colors inline-block py-0.5">Explore Projects</Link>
                </li>
                <li>
                  <Link href="/donate-device" className="hover:text-foreground transition-colors inline-block py-0.5">Donate a Device</Link>
                </li>
                <li>
                  <Link href="/volunteer" className="hover:text-foreground transition-colors inline-block py-0.5">Volunteer as Mentor</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors inline-block py-0.5">How It Works</Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Trust & Impact */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-foreground tracking-wider font-mono">Trust & Impact</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/impact" className="hover:text-foreground transition-colors inline-block py-0.5">Where Contributions Go</Link>
                </li>
                <li>
                  <Link href="/organizations" className="hover:text-foreground transition-colors inline-block py-0.5">Partner Directory</Link>
                </li>
                <li>
                  <Link href="/safeguarding" className="hover:text-foreground transition-colors inline-block py-0.5">Safeguarding Policy</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors inline-block py-0.5">About Us</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Portals & Governance */}
            <div className="col-span-2 sm:col-span-1 space-y-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              <h4 className="text-xs font-bold uppercase text-foreground tracking-wider font-mono">Operations</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/ngo/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1 py-0.5">
                    <span>NGO Portal</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-foreground transition-colors flex items-center gap-1 py-0.5">
                    <span>Admin Console</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors inline-block py-0.5">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors inline-block py-0.5">Terms of Operations</Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Footer Bottomline */}
        <div className="pt-5 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted text-center md:text-left">
          <div>
            © {new Date().getFullYear()} DesiLearCode • Data sanitization aligned with NIST SP 800-88 guidance
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-success-600" />
              Data Protection
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
              Verified Network
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
