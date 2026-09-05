'use client';

import React, { useState } from 'react';
import { Project, NeedItem } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { submitDonationIntent } from '@/app/actions/donations';
import { X, HeartHandshake, ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-surface rounded-xl shadow-overlay border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-1.5 text-muted hover:text-foreground rounded-md hover:bg-surfaceSubtle transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-12 h-12 bg-success-50 text-success-600 rounded-md flex items-center justify-center mx-auto border border-success-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold bg-success-50 text-success-700 px-2.5 py-0.5 rounded border border-success-200">
                PLEDGE #{generatedReceipt}
              </span>
              <h3 className="text-xl font-display font-bold text-foreground">
                Support Pledge Recorded
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Your support pledge of <strong className="text-foreground">₹{amount.toLocaleString()}</strong> for <strong>{project.title}</strong> has been logged in the milestone registry.
              </p>
            </div>

            <div className="bg-surfaceSubtle p-4 rounded-md border border-border text-left text-xs font-mono space-y-2 text-muted">
              <div className="flex justify-between items-center">
                <span>ORGANIZATION:</span>
                <span className="font-bold text-foreground truncate max-w-[180px]">{project.organizationName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>COHORT TARGET:</span>
                <span className="font-bold text-foreground">{project.targetStudents} Students</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span>STATUS:</span>
                <span className="text-success-700 font-bold">CONFIRMED ALLOCATION</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="w-full py-2.5 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors"
              >
                Close & View Initiative
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-primary-600 uppercase">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>MILESTONE-GATED PLEDGE</span>
              </div>
              <h3 className="text-lg font-display font-bold text-foreground truncate">
                Support {project.title}
              </h3>
              <p className="text-xs font-mono text-muted">
                Partner: <strong className="text-foreground">{project.organizationName}</strong>
              </p>
            </div>

            {need && (
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border text-xs text-foreground flex items-center justify-between gap-2">
                <span>Item: <strong className="font-bold">{need.title}</strong></span>
                <span className="font-mono text-[10px] text-muted">
                  {need.quantityFulfilled}/{need.quantityRequired} units
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preset Amounts */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  Select Contribution Tier (INR)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-1.5 text-xs font-mono font-medium rounded border transition-colors ${
                        amount === preset && !customAmount
                          ? 'bg-foreground text-surface border-foreground'
                          : 'bg-surfaceSubtle text-muted border-border hover:bg-surfaceHover hover:text-foreground'
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    placeholder="Custom amount (min ₹100)"
                    value={customAmount}
                    onChange={handleCustomChange}
                    min="100"
                    className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Your Name / Handle
                  </label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    disabled={isAnonymous}
                    value={isAnonymous ? 'Anonymous Supporter' : donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 disabled:opacity-50 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-foreground">
                    Email for Ledger Receipt
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-foreground">
                  Encouragement Note (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Keep building future tech leaders!"
                  maxLength={150}
                  className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                />
              </div>

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span>Record pledge anonymously in public ledger</span>
              </label>

              {/* Transparency Notice */}
              <div className="p-3 bg-surfaceSubtle rounded-md border border-border text-[11px] text-muted flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-success-600 shrink-0" />
                <span>100% of pledges are milestone-gated and auditable by platform administrators.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Recording Ledger Entry...</span>
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
