'use client';

import React from 'react';
import Link from 'next/link';
import { Laptop, ShieldCheck, HeartHandshake, Lock, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Safeguarding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md shadow-indigo-600/30">
                <img src="/logo.jpg" alt="DesiLearCode" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">DesiLearCode</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting people, volunteers, and verified child-care organizations to provide technology, digital education, robotics, and measurable opportunity.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <strong className="text-white block font-semibold">Zero-PII Child Protection</strong>
                We never disclose children’s personal identities, school names, or exact locations. All progress is reported with aggregated metrics and verified partner audits.
              </div>
            </div>
          </div>

          {/* Col 2: Ways to Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Ways to Help</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/projects" className="hover:text-white transition">Explore Projects</Link>
              </li>
              <li>
                <Link href="/needs" className="hover:text-white transition">Needs Marketplace</Link>
              </li>
              <li>
                <Link href="/donate-device" className="hover:text-white transition">Donate a Device</Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white transition">Volunteer as Mentor</Link>
              </li>
              <li>
                <Link href="/organizations" className="hover:text-white transition">Verified NGOs</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparency & Impact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Transparency</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition">Impact Dashboard</Link>
              </li>
              <li>
                <Link href="/safeguarding" className="hover:text-white transition">Child Safeguarding</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Portals & Governance</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/ngo/dashboard" className="hover:text-white transition flex items-center gap-1">
                  NGO Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition flex items-center gap-1">
                  Admin Oversight <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact & Helpdesk</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 DesiLearCode Platform. Built for transparent, project-based education assistance. Fictional sample data clearly labeled.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Secure 256-bit TLS
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-slate-500" />
              Verified Partner Vetting
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
