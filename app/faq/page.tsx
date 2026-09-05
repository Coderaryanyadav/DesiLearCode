'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does TechForKids ensure children’s privacy and safety?',
      a: 'We operate under a strict Zero-PII (Personally Identifiable Information) policy. We never publish child names, dates of birth, exact home/shelter addresses, or unconsented photographs. All reports use aggregated group metrics (e.g. "30 Middle School Students"). Volunteers only mentor in supervised group classrooms.'
    },
    {
      q: 'What happens to my old computer after I donate it?',
      a: 'Upon receipt at our central processing hub, the hard drive is cryptographically sanitized using DoD 5220.22-M standards to wipe all past donor data. The device is physically inspected, cleaned, upgraded with SSDs if necessary, and re-imaged with child-safe educational Linux and programming tools. You receive a unique tracking code (e.g. #TFK-104) to follow its journey.'
    },
    {
      q: 'How are NGOs and childcare organizations verified?',
      a: 'Our administrative compliance team verifies valid trust/society registrations, 12A tax exemption certificates, audited financials, and conducts physical checks to ensure safe classroom environments and designated child protection officers.'
    },
    {
      q: 'How are monetary contributions handled?',
      a: 'Contributions on TechForKids are structured around tangible, itemized project milestones (like laptop batteries or internet lines). Pledges are routed directly through verified partner accounts. We do not store raw credit card numbers or banking credentials.'
    },
    {
      q: 'Can I volunteer remotely as a coding mentor?',
      a: 'Yes! While many centers have in-person weekend labs, we facilitate virtual mentor sessions where volunteers conduct interactive live tutorials in Scratch, Python, and Cyber Safety with the assistance of an on-site center coordinator.'
    },
    {
      q: 'What kinds of devices do you accept?',
      a: 'We accept working laptops (Windows, Mac, Linux), desktop computers, tablets, monitors, keyboards, mice, Wi-Fi routers, Raspberry Pi, and Arduino hardware kits.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need to Know
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Answers to common questions regarding device refurbishing, child safety, verification, and volunteering.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-indigo-600 transition"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6 text-xs text-slate-500">
        Still have questions? <Link href="/contact" className="text-indigo-600 font-bold underline">Contact our helpdesk team</Link>.
      </div>

    </div>
  );
}
