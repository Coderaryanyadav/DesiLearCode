'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink, Terminal, Activity, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090c10] text-[#8b949e] pt-14 pb-10 border-t border-[#21262d] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#21262d]">
          
          {/* Mission & Protection Banner (Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-white flex items-center justify-center font-mono font-black text-black text-xs">
                DL
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">
                DesiLearCode Platform
              </span>
            </div>

            <p className="text-xs text-[#8b949e] leading-relaxed max-w-sm">
              Nonprofit technology infrastructure connecting hardware donations, engineering mentors, and verified grassroots learning labs across India.
            </p>

            <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-PII Child Safeguarding Charter</span>
              </div>
              <p className="text-[11px] text-[#8b949e] leading-normal">
                Strict adherence to minor privacy protocols. No individual student faces, names, or localized school coordinates are publicly exposed.
              </p>
            </div>
          </div>

          {/* Links Column 1: Hardware & Infrastructure (Span 2) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Infrastructure</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/donate-device" className="hover:text-white transition-colors">Hardware Intake</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">Open Initiatives</Link>
              </li>
              <li>
                <Link href="/needs" className="hover:text-white transition-colors">Hardware Inventory</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">Deployment Flow</Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Governance & Verification (Span 2) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/organizations" className="hover:text-white transition-colors">Partner Directory</Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">Impact & Audits</Link>
              </li>
              <li>
                <Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding Policy</Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white transition-colors">Mentor Standards</Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Control Portals & Legal (Span 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">System & Operations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ngo/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>NGO Operator Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#576071]" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Administrative Console</span>
                  <ExternalLink className="w-3 h-3 text-[#576071]" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy & Data Retention</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Operations</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Audit Inquiries / Contact</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Technical Footer Baseline */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#576071]">
          <div>
            © 2026 DesiLearCode • Verifiable Open Infrastructure • ISO / NIST 800-88 Data Sanitized
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#8b949e]">
              <Lock className="w-3 h-3 text-emerald-400" />
              TLS 1.3 Strict
            </span>
            <span className="flex items-center gap-1 text-[#8b949e]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              FCRA / 12A Verified
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
