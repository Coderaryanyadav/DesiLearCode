'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { ProjectCategory } from '@/lib/types';
import { ArrowLeft, Plus, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createProject, organizations } = useStore();

  const org = organizations.find(o => o.id === currentUser.organizationId) || organizations[0];

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [whatSupportProvides, setWhatSupportProvides] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Technology');
  const [region, setRegion] = useState(org.location);
  const [beneficiaryGroup, setBeneficiaryGroup] = useState('30 Middle School Students from community learning center');
  const [targetStudents, setTargetStudents] = useState(30);
  const [goalValue, setGoalValue] = useState(35000);
  const [heroImageUrl, setHeroImageUrl] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = createProject({
      title,
      tagline,
      description,
      whyItMatters,
      whatSupportProvides,
      category,
      region,
      beneficiaryGroup,
      targetStudents,
      goalValue,
      heroImageUrl,
    }, org.id);

    router.push('/ngo/dashboard');
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
          Publish a New Learning Initiative
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Provide complete itemized details. All initiatives undergo administrative review prior to public activation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Community Computer Lab for 40 Rural Youth"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Summary *</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Equipping an after-school facility with 6 laptops and weekend mentors."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {['Technology', 'Education', 'STEM', 'Coding', 'Cybersecurity', 'AI', 'Internet Access', 'School Supplies', 'Infrastructure'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Budget (INR ₹)</label>
            <input
              type="number"
              required
              min="1000"
              value={goalValue}
              onChange={(e) => setGoalValue(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Students Count</label>
            <input
              type="number"
              required
              min="5"
              value={targetStudents}
              onChange={(e) => setTargetStudents(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Generalized Region (No private shelter addresses)</label>
            <input
              type="text"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. North Delhi District, Delhi NCR"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Aggregated Beneficiary Group Description</label>
            <input
              type="text"
              required
              value={beneficiaryGroup}
              onChange={(e) => setBeneficiaryGroup(e.target.value)}
              placeholder="e.g. 40 Middle School Students in After-School Care"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the learning hub, weekly class schedules, and facility setup..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Why This Matters For The Children *</label>
            <textarea
              rows={2}
              required
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              placeholder="Explain the educational gap this fills..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">What Support Provides Specifically *</label>
            <textarea
              rows={2}
              required
              value={whatSupportProvides}
              onChange={(e) => setWhatSupportProvides(e.target.value)}
              placeholder="e.g. 4 laptops, ₹8,000 for battery replacements, 2 volunteer mentors..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Safeguarding Declaration */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong>Safeguarding & Moderation Verification:</strong>
            <p className="text-[11px] text-emerald-900 mt-0.5">
              By submitting, you confirm that no children&apos;s personal contact data or identifiable sensitive documents are included. Projects are submitted to the Platform Admin queue with status <code>pending_approval</code>.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-md shadow-indigo-600/20"
        >
          Submit Project for Administrative Moderation
        </button>
      </form>

    </div>
  );
}
