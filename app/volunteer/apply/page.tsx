'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { applyForVolunteering } from '@/app/actions/volunteers';
import { Code, CheckCircle2, ShieldCheck, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

function VolunteerApplyContent() {
  const searchParams = useSearchParams();
  const opportunityId = searchParams?.get('opp') || undefined;

  const { currentUser } = useAuth();

  // Form states
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [experienceYears, setExperienceYears] = useState(3);
  const [availabilityHoursPerWeek, setAvailabilityHoursPerWeek] = useState(3);
  const [preferredMode, setPreferredMode] = useState<'online' | 'in_person' | 'both'>('both');
  const [location, setLocation] = useState('Pune Urban / Remote');
  const [preferredAgeGroup, setPreferredAgeGroup] = useState('11–16 years');
  const [bio, setBio] = useState('Passionate about teaching hands-on programming and computational thinking.');
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
  ];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Coding (Scratch/Block)']);

  const availableLanguages = ['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Telugu', 'Bengali'];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Hindi']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeguardingConsent) {
      setErrorMessage('You must review and accept the child safeguarding standards.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('experienceYears', experienceYears.toString());
    formData.append('availabilityHoursPerWeek', availabilityHoursPerWeek.toString());
    formData.append('preferredMode', preferredMode);
    formData.append('preferredAgeGroup', preferredAgeGroup);
    formData.append('location', location);
    formData.append('bio', bio);
    formData.append('safeguardingConsent', safeguardingConsent ? 'true' : 'false');
    if (opportunityId) formData.append('opportunityId', opportunityId);

    selectedSkills.forEach(s => formData.append('skills', s));
    selectedLanguages.forEach(l => formData.append('languages', l));

    try {
      const res = await applyForVolunteering(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Received!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Thank you for stepping forward to mentor young minds. Our education and safeguarding coordinator will review your background and reach out.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2 max-w-md mx-auto text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Application Status:</span>
            <span className="font-bold text-amber-600">Pending Background Check</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Safeguarding Agreement:</span>
            <span className="font-semibold text-emerald-600">Signed & Logged</span>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard/volunteering"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md inline-block"
          >
            Go to Volunteer Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/volunteer" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Volunteer Overview
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Volunteer Mentorship Intake
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Join the TechForKids Mentorship Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Please complete this application with your teaching preferences, skills, and background details.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Contact info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-600" />
            Basic Contact & Experience
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra / Remote"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relevant Tech Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Time (Hours / Week)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={availabilityHoursPerWeek}
                onChange={(e) => setAvailabilityHoursPerWeek(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900">
            Skills You Can Teach (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900">
            Languages You Are Comfortable Mentoring In
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900">
            Brief Intro & Teaching Motivation
          </label>
          <textarea
            rows={3}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about your experience with programming or why you'd like to mentor children..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Child Safeguarding Agreement */}
        <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mandatory Child Safeguarding & Privacy Agreement</span>
          </div>
          <p className="text-[11px] text-indigo-900/90 leading-relaxed">
            By submitting this application, you agree to comply with our Zero-PII Safeguarding Charter: never soliciting private contact information from children, maintaining supervised sessions, and submitting to background validation.
          </p>
          <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={safeguardingConsent}
              onChange={(e) => setSafeguardingConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-xs font-bold text-slate-800">
              I agree to the child safeguarding protocols and identity verification check.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Volunteer Application'}
        </button>

      </form>
    </div>
  );
}

export default function VolunteerApplyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading form...</div>}>
      <VolunteerApplyContent />
    </Suspense>
  );
}
