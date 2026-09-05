'use client';

import React, { useState } from 'react';
import { Project, NeedItem } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { X, HeartHandshake, ShieldCheck, CheckCircle2, Lock, FileText } from 'lucide-react';

interface DonationModalProps {
  project?: Project | null;
  need?: NeedItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  project,
  need,
  isOpen,
  onClose,
}) => {
  const { submitDonationIntent, projects } = useStore();
  const { currentUser } = useAuth();

  const activeProject = project || (need ? projects.find(p => p.id === need.projectId) : projects[0]);

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState(currentUser.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<string>('');

  if (!isOpen || !activeProject) return null;

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setAmount(num);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const receipt = submitDonationIntent({
      donorName: isAnonymous ? 'Anonymous Supporter' : (donorName || 'Generous Donor'),
      donorEmail: donorEmail || 'donor@example.com',
      isAnonymous,
      projectId: activeProject.id,
      amount,
      allocatedNeedType: need?.type || 'project_support',
      message,
    });

    setGeneratedReceipt(receipt);
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Receipt #{generatedReceipt}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                Thank You For Your Support!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Your support pledge of <strong className="text-slate-900">₹{amount.toLocaleString()}</strong> for <strong>{activeProject.title}</strong> has been confirmed.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Partner Organization:</span>
                <span className="font-semibold text-slate-900">{activeProject.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary Target:</span>
                <span className="font-semibold text-slate-900">{activeProject.targetStudents} Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax Exemption:</span>
                <span className="text-emerald-700 font-semibold">80G Eligible Receipt Generated</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetAndClose}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition"
              >
                Close & View Updates
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Project-Based Support</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Support {activeProject.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Managed by {activeProject.organizationName}
              </p>
            </div>

            {need && (
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span>Allocating towards need: <strong>{need.title}</strong></span>
                <span className="font-semibold">{need.quantityFulfilled}/{need.quantityRequired} fulfilled</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Contribution Amount (INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        amount === preset && !customAmount
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5">
                  <input
                    type="number"
                    placeholder="Or enter custom amount (e.g. 7500)"
                    value={customAmount}
                    onChange={handleCustomChange}
                    min="100"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    disabled={isAnonymous}
                    value={isAnonymous ? 'Anonymous Supporter' : donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email for Receipt
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Words of Encouragement (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Keep inspiring future engineers!"
                  maxLength={150}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-600 select-none">
                  Keep my contribution anonymous on the public project list
                </label>
              </div>

              {/* Transparency Notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Transparency Guarantee:</strong> Support is allocated directly to verified project milestones. No raw card or banking credentials stored.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-600/20"
              >
                Pledge ₹{amount.toLocaleString()} Support
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
