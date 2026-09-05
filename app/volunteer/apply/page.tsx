'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { Code, CheckCircle2, ShieldCheck, HeartHandshake, Lock, ArrowLeft } from 'lucide-react';

function VolunteerApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams?.get('opp') || undefined;

  const { applyForVolunteering, volunteerOpportunities } = useStore();
  const { currentUser, setRole } = useAuth();

  const opp = volunteerOpportunities.find(o => o.id === opportunityId);

  // Form states
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [experienceYears, setExperienceYears] = useState(3);
  const [availabilityHoursPerWeek, setAvailabilityHoursPerWeek] = useState(3);
  const [preferredMode, setPreferredMode] = useState<'online' | 'in_person' | 'both'>('both');
  const [location, setLocation] = useState('Delhi NCR / Remote');
  const [preferredAgeGroup, setPreferredAgeGroup] = useState('11–16 years');
  const [bio, setBio] = useState('Passionate about teaching hands-on programming and computer literacy to empower children.');
  const [safeguardingConsent, setSafeguardingConsent] = useState(false);

  // Selected Skills & Subjects
  const availableSkills = [
    'Coding (Scratch/Block)',
    'Python',
    'Web Development (HTML/CSS/JS)',
    'Cybersecurity & Safe Web',
    'AI & Digital Tools',
    'Robotics & Arduino',
    'Computer Hardware Repair',
    'English Literacy',
    'Applied Mathematics',
    'Science Experiments',
    'Graphic Design'
  ];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Coding (Scratch/Block)']);

  const availableLanguages = ['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Telugu', 'Bengali'];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Hindi']);

  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeguardingConsent) {
      alert('Please review and confirm the Child Safeguarding declaration.');
      return;
    }

    applyForVolunteering({
      name,
      email,
      skills: selectedSkills,
      experienceYears,
      availabilityHoursPerWeek,
      preferredMode,
      preferredSubjects: selectedSkills,
      preferredAgeGroup,
      location,
      languages: selectedLanguages,
      bio,
      opportunityId,
    });

    setRole('volunteer');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            Application Registered
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Welcome to the TechForKids Volunteer Community!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Your mentor profile has been initialized. We have activated the <strong>Volunteer Portal</strong> for your session where you can track opportunities, hours, and workshop schedules.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/volunteering"
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-md"
          >
            Go to Volunteer Dashboard →
          </Link>
          <Link
            href="/volunteer"
            className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
          >
            Explore More Roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/volunteer" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Volunteering
        </Link>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Mentor Onboarding
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Apply as a Volunteer Mentor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {opp ? `Applying for specific role: "${opp.roleTitle}" at ${opp.organizationName}` : 'Register your skills and availability across technology and digital literacy modules.'}
        </p>
      </div>

      {opp && (
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-start gap-3">
          <Code className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong>Selected Role:</strong> {opp.roleTitle} ({opp.organizationName}) • {opp.hoursPerWeek} hrs/week ({opp.mode})
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            1. Personal & Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Mehra"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98111 22334"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            2. Skills & Teaching Subjects (Select all that apply)
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {skill} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability & Mode */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            3. Availability & Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Availability</label>
              <select
                value={availabilityHoursPerWeek}
                onChange={(e) => setAvailabilityHoursPerWeek(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value={2}>2 Hours / Week (Weekend)</option>
                <option value={4}>4 Hours / Week</option>
                <option value={6}>6+ Hours / Week</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Mode</label>
              <select
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="both">Both Online & In-Person</option>
                <option value="in_person">In-Person Only (Classroom)</option>
                <option value="online">Virtual / Online Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Age Group</label>
              <select
                value={preferredAgeGroup}
                onChange={(e) => setPreferredAgeGroup(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="8–12 years">Primary (8–12 years)</option>
                <option value="11–16 years">Middle & High School (11–16 years)</option>
                <option value="15–18 years">Young Adults (15–18 years)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region Base</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Languages for Instruction</label>
              <div className="flex flex-wrap gap-1.5">
                {availableLanguages.map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium ${
                      selectedLanguages.includes(lang)
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Short Introduction / Motivation</label>
          <textarea
            rows={3}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about your technical background and why you wish to mentor..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Child Safeguarding Consent */}
        <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-700" />
            <span className="text-xs font-bold text-indigo-950">Child Safeguarding & Protection Agreement</span>
          </div>
          <p className="text-[11px] text-indigo-900 leading-relaxed">
            By applying as a mentor, you agree to adhere to TechForKids Zero-Harm and Zero-PII principles. You will conduct sessions strictly within supervised environments and never solicit or publish personal contact details of young participants.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="safeguardConsent"
              required
              checked={safeguardingConsent}
              onChange={(e) => setSafeguardingConsent(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300"
            />
            <label htmlFor="safeguardConsent" className="text-xs text-indigo-950 font-semibold select-none">
              I agree to the Child Safeguarding Code of Conduct & Identity Verification Checks.
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-lg shadow-indigo-600/20"
        >
          Submit Volunteer Application
        </button>

      </form>
    </div>
  );
}

export default function VolunteerApplyPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Loading volunteer onboarding portal...
      </div>
    }>
      <VolunteerApplyContent />
    </Suspense>
  );
}
