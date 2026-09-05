'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Send
} from 'lucide-react';

export default function ManageProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { projects, addProjectMilestone, addProjectUpdate } = useStore();
  const { currentUser } = useAuth();

  const project = projects.find(p => p.id === id || p.slug === id) || projects[0];

  // Milestone Form
  const [msTitle, setMsTitle] = useState('');
  const [msDesc, setMsDesc] = useState('');
  const [msDate, setMsDate] = useState('2026-11-01');

  // Update Form
  const [updTitle, setUpdTitle] = useState('');
  const [updContent, setUpdContent] = useState('');
  const [updatePosted, setUpdatePosted] = useState(false);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle) return;
    addProjectMilestone(project.id, msTitle, msDesc, msDate);
    setMsTitle('');
    setMsDesc('');
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updTitle || !updContent) return;
    addProjectUpdate(project.id, updTitle, updContent, currentUser.name);
    setUpdTitle('');
    setUpdContent('');
    setUpdatePosted(true);
    setTimeout(() => setUpdatePosted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/projects" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Managed Projects
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{project.title}</h1>
            <p className="text-xs text-slate-500">{project.region} • {project.beneficiaryGroup}</p>
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
          >
            View Live Public Page →
          </Link>
        </div>

        <div className="max-w-xl pt-2">
          <ProgressBar
            percentage={project.progressPercentage}
            labelLeft={`₹${project.currentValue.toLocaleString()} raised`}
            labelRight={`Goal: ₹${project.goalValue.toLocaleString()}`}
            size="md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Milestones */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Project Execution Milestones</h2>

            <div className="space-y-3">
              {project.milestones.map((ms) => (
                <div key={ms.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg mt-0.5 ${ms.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {ms.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{ms.title}</span>
                      <span className="font-mono text-slate-400">{ms.targetDate}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{ms.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Milestone Subform */}
            <form onSubmit={handleAddMilestone} className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">+ Add New Milestone</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Milestone title"
                  value={msTitle}
                  onChange={(e) => setMsTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={msDate}
                  onChange={(e) => setMsDate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <input
                type="text"
                placeholder="Description of milestone deliverables..."
                value={msDesc}
                onChange={(e) => setMsDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Add Milestone
              </button>
            </form>
          </div>
        </div>

        {/* Right: Publish Field Update */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Publish Field Progress Update</h2>
            <p className="text-xs text-slate-500">Post updates regarding student attendance, workshop modules, or newly arrived hardware.</p>

            {updatePosted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Field update published to public page!</span>
              </div>
            )}

            <form onSubmit={handleAddUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Headline</label>
                <input
                  type="text"
                  required
                  value={updTitle}
                  onChange={(e) => setUpdTitle(e.target.value)}
                  placeholder="e.g. 5 Laptops Configured & Week 1 Completed"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Content</label>
                <textarea
                  rows={4}
                  required
                  value={updContent}
                  onChange={(e) => setUpdContent(e.target.value)}
                  placeholder="Summarize progress. Remember to follow Zero-PII rules (no individual child names or photos without consent)..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-2.5 bg-indigo-50 rounded-xl text-[11px] text-indigo-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-PII Child Safeguarding filter active.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Update</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
