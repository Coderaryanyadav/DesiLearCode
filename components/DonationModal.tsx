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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-surface rounded-[2.5rem] shadow-card border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 text-muted hover:text-foreground rounded-full hover:bg-surfaceHover transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-success-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono font-bold bg-success-50 text-success-700 px-3 py-1.5 rounded-full border border-success-200 inline-block">
                Pledge #{generatedReceipt}
              </span>
              <h3 className="text-2xl font-display font-extrabold text-foreground tracking-tight">
                Thank You For Your Support!
              </h3>
              <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                Your support pledge of <strong className="text-foreground">₹{amount.toLocaleString()}</strong> for <strong>{project.title}</strong> has been securely recorded.
              </p>
            </div>

            <div className="bg-surfaceHover p-5 rounded-2xl border border-border text-left text-sm space-y-3 text-muted">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Partner Organization:</span>
                <span className="font-bold text-foreground text-right">{project.organizationName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Beneficiary Target:</span>
                <span className="font-bold text-foreground">{project.targetStudents} Students</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-semibold">Allocation Status:</span>
                <span className="text-success-600 font-bold bg-success-50 px-2 py-0.5 rounded border border-success-100">Confirmed Allocation</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={resetAndClose}
                className="w-full py-4 rounded-2xl bg-foreground hover:bg-foreground/90 text-surface font-bold text-sm transition-all shadow-card"
              >
                Close & View Project Updates
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-10 space-y-8">
            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>Project-Based Support</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                Support {project.title}
              </h3>
              <p className="text-sm font-medium text-muted">
                Managed securely by <strong className="text-foreground">{project.organizationName}</strong>
              </p>
            </div>

            {need && (
              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 text-sm text-primary-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
                <span>Allocating towards: <strong className="font-bold">{need.title}</strong></span>
                <span className="font-bold bg-primary-100 px-2.5 py-1 rounded-full text-xs">
                  {need.quantityFulfilled}/{need.quantityRequired} fulfilled
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Preset Amounts */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  Select Contribution Amount (INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${
                        amount === preset && !customAmount
                          ? 'bg-primary-500 text-surface border-primary-500 shadow-md shadow-primary-500/30 transform scale-[1.02]'
                          : 'bg-surfaceHover text-muted-foreground border-border hover:bg-surface hover:border-primary-200'
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="number"
                    placeholder="Or enter custom amount (min ₹100)"
                    value={customAmount}
                    onChange={handleCustomChange}
                    min="100"
                    className="w-full px-4 py-3.5 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder:text-muted"
                  />
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required={!isAnonymous}
                      disabled={isAnonymous}
                      value={isAnonymous ? 'Anonymous Supporter' : donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium placeholder:text-muted"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider">
                      Email for Receipt
                    </label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder:text-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted uppercase tracking-wider">
                  Words of Encouragement (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Keep inspiring future engineers!"
                  maxLength={150}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder:text-muted"
                />
              </div>

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-border rounded-md bg-surface checked:bg-primary-600 checked:border-primary-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
                  />
                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary-600 transition-colors">
                  Keep my contribution anonymous publicly
                </span>
              </label>

              {/* Transparency Notice */}
              <div className="p-4 bg-surfaceHover rounded-2xl border border-border text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-inner">
                <div className="w-8 h-8 rounded-full bg-success-50 text-success-600 flex items-center justify-center shrink-0 border border-success-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="leading-relaxed">
                  <strong>Transparent Direct Pledge:</strong> 100% of pledges securely update the ledger and directly fund the verifiable hardware and internet needs.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-base transition-all shadow-card disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Recording Secure Pledge...
                  </span>
                ) : (
                  `Pledge ₹${amount.toLocaleString()} Support`
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
