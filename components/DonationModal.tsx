'use client';

import React, { useState } from 'react';
import { Project, NeedItem } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { submitDonationIntent } from '@/app/actions/donations';
import { X, HeartHandshake, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const { currentUser } = useAuth();

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<string>('');

  if (!isOpen || !project) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 100) {
      setErrorMessage('Minimum contribution is ₹100.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('donorName', isAnonymous ? 'Anonymous Supporter' : (donorName || 'Generous Donor'));
    formData.append('donorEmail', donorEmail || 'donor@example.com');
    formData.append('isAnonymous', isAnonymous ? 'true' : 'false');
    formData.append('projectId', project.id);
    formData.append('amount', amount.toString());
    if (need?.type) formData.append('allocatedNeedType', need.type);
    if (message) formData.append('message', message);

    try {
      const res = await submitDonationIntent(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.receiptNumber) {
        setGeneratedReceipt(res.receiptNumber);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
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
                Pledge #{generatedReceipt}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                Thank You For Your Support!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Your support pledge of <strong className="text-slate-900">₹{amount.toLocaleString()}</strong> for <strong>{project.title}</strong> has been recorded in the platform ledger.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Partner Organization:</span>
                <span className="font-semibold text-slate-900">{project.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary Target:</span>
                <span className="font-semibold text-slate-900">{project.targetStudents} Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Allocation Status:</span>
                <span className="text-emerald-700 font-semibold">Allocated to Project Hardware & Need Fund</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetAndClose}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition"
              >
                Close & View Project
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
                Support {project.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Managed by {project.organizationName}
              </p>
            </div>

            {need && (
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span>Allocating towards need: <strong>{need.title}</strong></span>
                <span className="font-semibold">{need.quantityFulfilled}/{need.quantityRequired} fulfilled</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
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
                    placeholder="Or enter custom amount (min ₹100)"
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
                  <strong>Transparent Direct Pledge:</strong> Pledges directly update project funding status in PostgreSQL. Gateway payment processing connects via secure sandbox/provider webhook.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-600/20 disabled:opacity-60"
              >
                {isSubmitting ? 'Recording Pledge...' : `Pledge ₹${amount.toLocaleString()} Support`}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
