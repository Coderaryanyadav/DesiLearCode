'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { addProjectMilestone, addProjectUpdate } from '@/app/actions/projects';
import { ArrowLeft, Plus, CheckCircle2, Clock, ShieldCheck, Sparkles, Send, AlertCircle } from 'lucide-react';

export default function ManageProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // Milestone Form
  const [msTitle, setMsTitle] = useState('');
  const [msDesc, setMsDesc] = useState('');
  const [msDate, setMsDate] = useState('2026-11-01');
  const [isAddingMs, setIsAddingMs] = useState(false);
  const [msSuccess, setMsSuccess] = useState(false);

  // Update Form
  const [updTitle, setUpdTitle] = useState('');
  const [updContent, setUpdContent] = useState('');
  const [isPostingUpd, setIsPostingUpd] = useState(false);
  const [updatePosted, setUpdatePosted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle) return;
    setIsAddingMs(true);
    setErrorMessage(null);

    try {
      const res = await addProjectMilestone(id, msTitle, msDesc, msDate);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setMsTitle('');
        setMsDesc('');
        setMsSuccess(true);
        setTimeout(() => setMsSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add milestone.');
    } finally {
      setIsAddingMs(false);
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updTitle || !updContent) return;
    setIsPostingUpd(true);
    setErrorMessage(null);

    try {
      const res = await addProjectUpdate(id, updTitle, updContent);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setUpdTitle('');
        setUpdContent('');
        setUpdatePosted(true);
        setTimeout(() => setUpdatePosted(false), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to post update.');
    } finally {
      setIsPostingUpd(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/ngo/projects" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NGO Projects
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Project Control Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Manage Milestones & Learning Updates
        </h1>
        <p className="text-xs text-slate-500">
          Post verifiable progress checkpoints and classroom activity logs for donors and mentors.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Milestone Creator */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Add Project Milestone
            </h3>
            {msSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Milestone Saved
              </span>
            )}
          </div>

          <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Milestone Title</label>
              <input
                type="text"
                required
                value={msTitle}
                onChange={(e) => setMsTitle(e.target.value)}
                placeholder="e.g. Complete 10 Linux Desktop Installations"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                required
                value={msDate}
                onChange={(e) => setMsDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={msDesc}
                onChange={(e) => setMsDesc(e.target.value)}
                placeholder="Describe specifically what is delivered in this milestone..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isAddingMs}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md disabled:opacity-60"
            >
              {isAddingMs ? 'Saving Milestone...' : 'Save Milestone'}
            </button>
          </form>
        </div>

        {/* Update Publisher */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Publish Classroom Update
            </h3>
            {updatePosted && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Update Published
              </span>
            )}
          </div>

          <form onSubmit={handleAddUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Update Title</label>
              <input
                type="text"
                required
                value={updTitle}
                onChange={(e) => setUpdTitle(e.target.value)}
                placeholder="e.g. Week 4: Students Built First Scratch Storyboards"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Content (Zero-PII Only)</label>
              <textarea
                rows={5}
                required
                value={updContent}
                onChange={(e) => setUpdContent(e.target.value)}
                placeholder="Detail classroom activities, student progress, or hardware utilization without mentioning individual names..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl text-[11px] text-indigo-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safeguarded: Automatic scanner verifies zero child PII is leaked.</span>
            </div>

            <button
              type="submit"
              disabled={isPostingUpd}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-md disabled:opacity-60"
            >
              {isPostingUpd ? 'Publishing...' : 'Publish Update to Donors'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
