'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { UserCheck, Clock, Award, Users, Plus, CheckCircle2, ArrowLeft, Code } from 'lucide-react';

export default function DashboardVolunteeringPage() {
  const { currentUser } = useAuth();
  const { volunteerProfiles, logVolunteerHours, volunteerOpportunities } = useStore();

  const profile = volunteerProfiles.find(v => v.userId === currentUser.id || v.email === currentUser.email) || volunteerProfiles[0];

  const [hoursToAdd, setHoursToAdd] = useState(2);
  const [sessionNote, setSessionNote] = useState('Conducted 90-min Scratch loops & animation session with 14 students.');
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      logVolunteerHours(profile.id, hoursToAdd, sessionNote);
      setLoggedSuccess(true);
      setTimeout(() => setLoggedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Volunteer Mentorship Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Volunteer Service & Mentorship Tracker
          </h1>
          <p className="text-xs text-slate-500">
            Track your verified teaching hours, workshop milestones, and application statuses.
          </p>
        </div>

        <Link
          href="/volunteer"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
        >
          Browse Open Roles
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{profile?.hoursVolunteered || 0} hrs</div>
          <div className="text-xs font-bold text-slate-700">Verified Teaching Hours</div>
          <p className="text-[11px] text-slate-500">Logged with partner coordinators</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{profile?.workshopsCompleted || 0}</div>
          <div className="text-xs font-bold text-slate-700">Workshops Completed</div>
          <p className="text-[11px] text-slate-500">Python, Scratch & Cyber Safety</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">{profile?.studentsReached || 0}</div>
          <div className="text-xs font-bold text-slate-700">Students Reached</div>
          <p className="text-[11px] text-slate-500">Aggregated learner impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Applications list & Profile */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Your Volunteer Applications</h2>

            <div className="space-y-3">
              {profile?.applications?.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{app.projectTitle}</h4>
                    <p className="text-[11px] text-slate-500">{app.organizationName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Mentor
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Your Verified Skill Profile</h2>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold">
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              <strong>Bio:</strong> {profile?.bio}
            </p>
          </div>
        </div>

        {/* Right: Log Service Session Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Log a Mentorship Workshop</h2>
          <p className="text-xs text-slate-500">Record session hours for verification and impact tallying.</p>

          {loggedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Workshop session hours successfully logged!</span>
            </div>
          )}

          <form onSubmit={handleLogHours} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hours Conducted</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Summary & Module Taught</label>
              <textarea
                rows={3}
                required
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                placeholder="e.g. Completed Python functions module with 15 participants..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
            >
              Log Verified Hours
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
