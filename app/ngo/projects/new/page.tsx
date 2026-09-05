'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';
import { ProjectCategory } from '@/lib/types';
import { ArrowLeft, Plus, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [whatSupportProvides, setWhatSupportProvides] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Technology');
  const [region, setRegion] = useState('Pune Urban, Maharashtra');
  const [beneficiaryGroup, setBeneficiaryGroup] = useState('30 Middle School Students from community learning center');
  const [targetStudents, setTargetStudents] = useState(30);
  const [goalValue, setGoalValue] = useState(35000);
  const [heroImageUrl, setHeroImageUrl] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('tagline', tagline);
    formData.append('description', description);
    formData.append('whyItMatters', whyItMatters);
    formData.append('whatSupportProvides', whatSupportProvides);
    formData.append('category', category);
    formData.append('region', region);
    formData.append('beneficiaryGroup', beneficiaryGroup);
    formData.append('targetStudents', targetStudents.toString());
    formData.append('goalValue', goalValue.toString());
    formData.append('heroImageUrl', heroImageUrl);

    try {
      const res = await createProject(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        router.push('/ngo/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NGO Dashboard
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Project Creation Wizard
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Create New Technology or Education Project
        </h1>
        <p className="text-xs text-slate-500">
          Projects are submitted to platform administrators for statutory vetting and child safeguarding validation prior to public publication.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Basic Metas */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            1. Core Overview
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title (min 10 characters)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pune Coding Lab & Python Mentorship Program"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Tagline / Summary (min 15 characters)
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Equipping 30 middle-school children with refurbished laptops and weekend coding instructors."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Technology">Technology & Laptops</option>
                  <option value="Coding">Coding & Software</option>
                  <option value="STEM">STEM & Robotics</option>
                  <option value="Education">Education Support</option>
                  <option value="Cybersecurity">Cybersecurity & Safety</option>
                  <option value="Internet Access">Internet Access</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  General Location / Region
                </label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Pune Urban, Maharashtra"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Justification */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            2. Detailed Purpose & Impact
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Description (min 50 characters)
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive details regarding the learning center, schedule, and computer curriculum..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Why This Matters For Children (min 30 characters)
              </label>
              <textarea
                rows={2}
                required
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                placeholder="Explain the digital divide context and what skills the children will acquire..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What Donor Support Provides (min 30 characters)
              </label>
              <textarea
                rows={2}
                required
                value={whatSupportProvides}
                onChange={(e) => setWhatSupportProvides(e.target.value)}
                placeholder="Detail specifically what hardware or funds accomplish (e.g. SSD upgrades, chargers, OS installation)..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Beneficiaries & Budget Target */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            3. Beneficiaries & Budget (Strict Zero Child-PII)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Students (Cohort)
              </label>
              <input
                type="number"
                min="5"
                required
                value={targetStudents}
                onChange={(e) => setTargetStudents(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aggregated Cohort Description
              </label>
              <input
                type="text"
                required
                value={beneficiaryGroup}
                onChange={(e) => setBeneficiaryGroup(e.target.value)}
                placeholder="e.g. 30 Middle School Students"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Budget Target (INR)
              </label>
              <input
                type="number"
                min="1000"
                required
                value={goalValue}
                onChange={(e) => setGoalValue(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Safeguarding Notice */}
        <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Safeguarding Guard:</strong> Never enter names or private addresses of children. Projects undergo administrative review before publication.
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting Project...' : 'Submit Project for Administrative Approval'}
        </button>

      </form>
    </div>
  );
}
