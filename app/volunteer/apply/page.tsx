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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto shadow-card border border-success-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
            Application Received!
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-md mx-auto leading-relaxed">
            Thank you for stepping forward to mentor young minds. Our education and safeguarding coordinator will review your background and reach out.
          </p>
        </div>

        <div className="p-6 bg-surfaceHover rounded-3xl border border-border text-left text-sm space-y-4 max-w-md mx-auto text-muted shadow-soft">
          <div className="flex justify-between items-center pb-3 border-b border-border/60">
            <span className="font-medium">Application Status:</span>
            <span className="font-bold text-warning-600 bg-warning-50 px-2.5 py-1 rounded-full border border-warning-200">Pending Check</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Safeguarding Agreement:</span>
            <span className="font-bold text-success-600 bg-success-50 px-2.5 py-1 rounded-full border border-success-200">Signed & Logged</span>
          </div>
        </div>

        <div className="pt-6">
          <Link
            href="/dashboard/volunteering"
            className="px-8 py-3.5 rounded-2xl bg-foreground hover:bg-foreground/90 text-surface text-sm font-bold transition-all shadow-card inline-block"
          >
            Go to Volunteer Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link href="/volunteer" className="text-sm font-medium text-muted hover:text-foreground flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Volunteer Overview
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-success-700 bg-success-50 border border-success-200 px-3 py-1.5 rounded-full">
          Volunteer Mentorship Intake
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Join the DesiLearCode Mentorship Team
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
          Please complete this application with your teaching preferences, skills, and background details.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-surface p-6 sm:p-10 rounded-3xl border border-border shadow-soft space-y-8">
        
        {/* Contact info */}
        <div className="space-y-5">
          <h3 className="text-base font-display font-bold text-foreground flex items-center gap-2.5">
            <Code className="w-5 h-5 text-primary-500" />
            Basic Contact & Experience
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra / Remote"
                className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Relevant Tech Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Available Time (Hours / Week)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={availabilityHoursPerWeek}
                onChange={(e) => setAvailabilityHoursPerWeek(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 pt-6 border-t border-border">
          <label className="block text-base font-display font-bold text-foreground">
            Skills You Can Teach (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                    isSelected
                      ? 'bg-foreground text-surface border-foreground shadow-card'
                      : 'bg-surfaceHover text-muted border-border hover:bg-border/50 hover:text-foreground'
                  }`}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-4 pt-6 border-t border-border">
          <label className="block text-base font-display font-bold text-foreground">
            Languages You Are Comfortable Mentoring In
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                    isSelected
                      ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-sm'
                      : 'bg-surfaceHover text-muted border-border hover:bg-border/50 hover:text-foreground'
                  }`}
                >
                  {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3 pt-6 border-t border-border">
          <label className="block text-base font-display font-bold text-foreground">
            Brief Intro & Teaching Motivation
          </label>
          <textarea
            rows={4}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about your experience with programming or why you'd like to mentor children..."
            className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted resize-y"
          />
        </div>

        {/* Child Safeguarding Agreement */}
        <div className="p-6 bg-info-50/50 rounded-3xl border border-info-100 space-y-4 shadow-inner">
          <div className="flex items-center gap-2.5 text-sm font-bold text-info-900">
            <ShieldCheck className="w-5 h-5 text-info-600 shrink-0" />
            <span>Mandatory Child Safeguarding & Privacy Agreement</span>
          </div>
          <p className="text-xs sm:text-sm text-info-800/80 leading-relaxed font-medium">
            By submitting this application, you agree to comply with our Zero-PII Safeguarding Charter: never soliciting private contact information from children, maintaining supervised sessions, and submitting to background validation.
          </p>
          <label className="flex items-start gap-3 pt-2 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                required
                checked={safeguardingConsent}
                onChange={(e) => setSafeguardingConsent(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-info-300 rounded-md bg-surface checked:bg-info-600 checked:border-info-600 transition-all focus:outline-none focus:ring-2 focus:ring-info-500/30 cursor-pointer"
              />
              <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
            </div>
            <span className="text-sm font-bold text-info-900 group-hover:text-info-950 transition-colors">
              I agree to the child safeguarding protocols and identity verification check.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-foreground hover:bg-foreground/90 text-surface font-bold text-sm transition-all shadow-card disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                Submitting Application...
              </span>
            ) : 'Submit Volunteer Application'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function VolunteerApplyPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm font-medium text-muted">Loading secure form...</div>}>
      <VolunteerApplyContent />
    </Suspense>
  );
}
