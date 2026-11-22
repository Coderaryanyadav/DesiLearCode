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
  const [availabilityHoursPerWeek, setAvailabilityHoursPerWeek] = useState(2);
  const [preferredMode, setPreferredMode] = useState<'online' | 'in_person' | 'both'>('both');
  const [location, setLocation] = useState('Pune Urban / Hybrid');
  const [preferredAgeGroup, setPreferredAgeGroup] = useState('11–16 years');
  const [bio, setBio] = useState('Passionate about teaching hands-on programming and computational thinking.');
  const [safeguardingConsent, setSafeguardingConsent] = useState(false);

  // Selected Skills & Subjects
  const availableSkills = [
    'Coding (Scratch/Block)',
    'Python 3',
    'Web Development (HTML/CSS/JS)',
    'Cybersecurity & Safe Web',
    'AI & Digital Tools',
    'Robotics & Arduino',
    'Computer Hardware Prep',
    'Applied Mathematics',
  ];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python 3', 'Coding (Scratch/Block)']);

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
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-12 h-12 bg-success-50 text-success-600 rounded-md flex items-center justify-center mx-auto border border-success-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-success-700 bg-success-50 px-2.5 py-0.5 rounded border border-success-200">
            APPLICATION LOGGED
          </span>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Mentorship Intake Recorded
          </h1>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Thank you for stepping forward. Our education coordinator will review your profile and match you with a verified lab workshop cohort.
          </p>
        </div>

        <div className="p-4 bg-surfaceSubtle rounded-md border border-border text-left text-xs font-mono space-y-2 max-w-md mx-auto text-muted">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span>INTAKE STATUS:</span>
            <span className="font-bold text-warning-700 bg-warning-50 px-2 py-0.5 rounded border border-warning-200">PENDING AUDIT</span>
          </div>
          <div className="flex justify-between items-center">
            <span>SAFEGUARDING CHARTER:</span>
            <span className="font-bold text-success-700">SIGNED & LOGGED</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard/volunteering"
            className="px-6 py-2.5 rounded-md bg-foreground hover:bg-foreground/90 text-surface text-xs font-medium transition-colors inline-block"
          >
            Access Volunteer Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <Link href="/volunteer" className="text-xs font-mono text-muted hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO OVERVIEW
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold text-primary-600 uppercase">
          Mentor Registration • 2026
        </span>
        <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight">
          Apply to Mentor Student Cohorts
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          Complete your technical profile and availability. All mentors undergo identity verification and safeguarding compliance before lab allocation.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-surface p-5 sm:p-8 rounded-2xl border border-border space-y-6">
        
        {/* Contact info */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-foreground flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-primary-500" />
            <span>01 / Contact & Experience</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                City / Location
              </label>
              <input
                type="text"
                autoComplete="address-level2"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra / Hybrid"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Relevant Tech Experience (Years)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Available Time (Hours / Week)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="20"
                value={availabilityHoursPerWeek}
                onChange={(e) => setAvailabilityHoursPerWeek(parseInt(e.target.value, 10))}
                className="w-full min-h-[44px] px-3.5 py-2 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label className="block text-xs font-mono font-bold uppercase text-foreground">
            02 / Technical Skills You Can Teach
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-foreground text-surface border-foreground shadow-xs font-bold'
                      : 'bg-surfaceSubtle text-muted border-border hover:bg-surfaceHover hover:text-foreground'
                  }`}
                >
                  {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label className="block text-xs font-mono font-bold uppercase text-foreground">
            03 / Instruction Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary-50 text-primary-800 border-primary-300 shadow-xs font-bold'
                      : 'bg-surfaceSubtle text-muted border-border hover:bg-surfaceHover hover:text-foreground'
                  }`}
                >
                  {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 pt-4 border-t border-border">
          <label className="block text-xs font-mono font-bold uppercase text-foreground">
            04 / Statement of Teaching Intent
          </label>
          <textarea
            rows={3}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Briefly describe your programming background and experience working with learners..."
            className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
          />
        </div>

        {/* Child Safeguarding Agreement */}
        <div className="p-4 bg-surfaceSubtle rounded-xl border border-border space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldCheck className="w-4 h-4 text-success-600 shrink-0" />
            <span>Child Safeguarding Charter Agreement</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            By submitting, you pledge adherence to our Zero-PII protection policy: never soliciting private contact info from minors, keeping all communications in supervised lab channels, and agreeing to identity validation.
          </p>
          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              required
              checked={safeguardingConsent}
              onChange={(e) => setSafeguardingConsent(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <span className="text-xs font-medium text-foreground">
              I agree to the safeguarding charter and background check verification.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] py-3 rounded-xl bg-foreground hover:bg-foreground/90 text-surface font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Mentorship Application'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function VolunteerApplyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-muted">Loading secure intake form...</div>}>
      <VolunteerApplyContent />
    </Suspense>
  );
}
