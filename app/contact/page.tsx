'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Question');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact TechForKids
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Have questions regarding device donation logistics, NGO onboarding verification, or corporate CSR partnerships? We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact info */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Headquarters & Helpdesk</h3>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Email Enquiries</strong>
                  <span>support@techforkids.org</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Helpdesk Hotline</strong>
                  <span>+91 80 4000 8820 (Mon–Fri, 9am–6pm IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Hub Logistics Facility</strong>
                  <span>TechForKids Refurbishment Center, Tech Hub, Bengaluru 560100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/70 rounded-3xl p-6 border border-indigo-100 text-xs text-indigo-950 space-y-2">
            <strong className="block font-bold">Child Safeguarding Hotline</strong>
            <p className="leading-relaxed">
              To immediately report any child safety, consent, or privacy concerns regarding any listed initiative, please email <strong>safeguarding@techforkids.org</strong> for priority review within 2 hours.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Dispatched!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting us. A coordinator will reply to <strong>{email}</strong> within 1 business day.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 text-xs font-bold text-indigo-600 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="General Question">General Question</option>
                  <option value="Device Donation Logistics">Device Donation Logistics</option>
                  <option value="NGO Verification Inquiry">NGO Verification Inquiry</option>
                  <option value="Volunteer Mentorship Query">Volunteer Mentorship Query</option>
                  <option value="Corporate CSR Partnership">Corporate CSR Partnership</option>
                  <option value="Safeguarding / Privacy Concern">Safeguarding / Privacy Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
