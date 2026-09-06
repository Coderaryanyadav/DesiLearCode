'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DeviceDonation, DeviceType } from '@/lib/types';
import { PublicDeviceTracking } from '@/lib/dtos';
import { DeviceTimeline } from '@/components/DeviceTimeline';
import { submitDeviceDonation, trackDeviceCode } from '@/app/actions/devices';
import { 
  Laptop, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Lock, 
  AlertCircle,
  Clock,
  Building2,
  Check,
  ChevronRight,
  Monitor,
  Cpu,
  Tablet
} from 'lucide-react';

export default function DonateDevicePage() {
  const { currentUser } = useAuth();

  // 5-step flow: 1: Device Type, 2: Device Specs & Condition, 3: Handover Method, 4: Contact Details, 5: Review & Consent
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [deviceType, setDeviceType] = useState<DeviceType>('Laptop');
  const [manufacturer, setManufacturer] = useState('Lenovo');
  const [model, setModel] = useState('ThinkPad T480');
  const [approximateAgeYears, setApproximateAgeYears] = useState(3);
  const [condition, setCondition] = useState<'like_new' | 'good' | 'fair' | 'needs_repair'>('good');
  const [powersOn, setPowersOn] = useState(true);
  const [batteryCondition, setBatteryCondition] = useState<'excellent' | 'good' | 'fair' | 'dead_or_missing'>('good');
  const [hasCharger, setHasCharger] = useState(true);
  const [storage, setStorage] = useState('256GB SSD');
  const [ram, setRam] = useState('8GB DDR4');
  const [os, setOs] = useState('Ubuntu / ChromeOS Flex');
  const [pickupPreference, setPickupPreference] = useState<'courier_pickup' | 'dropoff' | 'self_ship'>('courier_pickup');
  const [notes, setNotes] = useState('');
  const [agreedToSanitization, setAgreedToSanitization] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search Tracking
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [trackedDevice, setTrackedDevice] = useState<PublicDeviceTracking | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('donorName', donorName || 'Generous Donor');
    formData.append('donorEmail', donorEmail || 'donor@example.com');
    if (donorPhone) formData.append('donorPhone', donorPhone);
    formData.append('deviceType', deviceType);
    formData.append('manufacturer', manufacturer);
    formData.append('model', model);
    formData.append('approximateAgeYears', approximateAgeYears.toString());
    formData.append('condition', condition);
    formData.append('powersOn', powersOn ? 'true' : 'false');
    formData.append('batteryCondition', batteryCondition);
    formData.append('hasCharger', hasCharger ? 'true' : 'false');
    formData.append('storage', storage);
    formData.append('ram', ram);
    formData.append('os', os);
    formData.append('pickupPreference', pickupPreference);
    if (notes) formData.append('notes', notes);

    try {
      const res = await submitDeviceDonation(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.trackingCode) {
        setSubmittedCode(res.trackingCode);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit device assessment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingCode) return;
    setIsTracking(true);
    setTrackingError(null);

    try {
      const res = await trackDeviceCode(searchTrackingCode);
      if (res.error) {
        setTrackingError(res.error);
        setTrackedDevice(null);
      } else if (res.device) {
        setTrackedDevice(res.device);
      }
    } catch (err: any) {
      setTrackingError('Failed to lookup tracking code. Please check the code and try again.');
      setTrackedDevice(null);
    } finally {
      setIsTracking(false);
    }
  };

  const deviceTypes = [
    { type: 'Laptop', label: 'Laptop', desc: 'Working or repairable', icon: Laptop },
    { type: 'Desktop', label: 'Desktop Tower', desc: 'CPU unit with or without monitor', icon: Monitor },
    { type: 'Tablet', label: 'Tablet', desc: 'Android / iPad / e-Reader', icon: Tablet },
    { type: 'Monitor', label: 'Monitor / Display', desc: 'External screen / HDMI', icon: Monitor },
    { type: 'Raspberry Pi', label: 'STEM Board', desc: 'Raspberry Pi / Arduino kit', icon: Cpu }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surfaceSubtle border border-border text-xs text-muted">
          <span>Hardware Donation Program</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-tight">
          Give your unused computer a second life in a classroom.
        </h1>
        <p className="text-xs sm:text-base text-muted leading-relaxed">
          Tell us about the device. We inspect it, securely wipe all past data (aligned with NIST SP 800-88 guidance), match it with an eligible verified project, and deliver it to an active learning center.
        </p>
      </div>

      {/* TRACKING LOOKUP (Touch-friendly search on mobile) */}
      <div className="bg-surface rounded-xl p-4 sm:p-6 border border-border space-y-3 sm:space-y-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs sm:text-sm">
            <Search className="w-4 h-4 text-primary-600 shrink-0" />
            <span>Track a previously donated device</span>
          </div>
          <span className="text-[11px] font-mono text-muted">Format: DLC-XXXX-XXXX</span>
        </div>

        <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchTrackingCode}
            onChange={(e) => setSearchTrackingCode(e.target.value.toUpperCase())}
            placeholder="Enter tracking code (e.g. DLC-7F3A-8C21)"
            className="flex-1 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-mono"
            autoCapitalize="characters"
            autoCorrect="off"
          />
          <button
            type="submit"
            disabled={isTracking}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-foreground text-surface font-semibold text-xs sm:text-sm hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-subtle touch-target"
          >
            {isTracking ? 'Searching...' : 'Track Device'}
          </button>
        </form>

        {trackingError && (
          <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{trackingError}</span>
          </div>
        )}

        {trackedDevice && (
          <div className="mt-4 pt-4 border-t border-border">
            <DeviceTimeline device={trackedDevice} />
          </div>
        )}
      </div>

      {/* SUBMISSION SUCCESS CONFIRMATION */}
      {submittedCode ? (
        <div className="bg-surface rounded-xl p-6 sm:p-10 border border-border max-w-xl mx-auto text-center space-y-5 sm:space-y-6 shadow-panel">
          <div className="w-12 h-12 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto border border-success-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold bg-surfaceSubtle text-foreground px-3 py-1 rounded border border-border inline-block">
              Tracking ID: #{submittedCode}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              Device registered
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto">
              Your donation assessment has been received. Our team will contact you regarding pickup or drop-off coordination, and you will be updated when the status changes.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSubmittedCode(null);
                setSearchTrackingCode('');
                setCurrentStep(1);
              }}
              className="min-h-[44px] px-6 py-2.5 rounded-lg bg-foreground text-surface hover:bg-foreground/90 font-semibold text-xs sm:text-sm transition-colors touch-target"
            >
              Donate another device
            </button>
          </div>
        </div>
      ) : (
        /* 5-STEP MOBILE-FIRST DONATION WIZARD */
        <div className="bg-surface p-5 sm:p-8 rounded-xl border border-border space-y-5 sm:space-y-6 shadow-subtle">
          
          {/* Step Progress Bar */}
          <div className="space-y-2 border-b border-border pb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-primary-600 font-mono">
                STEP {currentStep} / 5
              </span>
              <span className="text-muted font-medium truncate max-w-[200px] text-right">
                {currentStep === 1 && 'What are you donating?'}
                {currentStep === 2 && 'Tell us about the device'}
                {currentStep === 3 && 'How can we receive it?'}
                {currentStep === 4 && 'Your contact details'}
                {currentStep === 5 && 'Review donation'}
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* STEP 1: WHAT ARE YOU DONATING? (Touch-friendly tiles) */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    What are you donating?
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Select the hardware category you wish to contribute.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {deviceTypes.map((item) => {
                    const Icon = item.icon;
                    const isSelected = deviceType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setDeviceType(item.type as DeviceType)}
                        className={`p-4 rounded-xl border text-left transition-all min-h-[56px] flex items-center sm:items-start gap-3.5 sm:flex-col touch-target ${
                          isSelected
                            ? 'bg-surfaceSubtle border-primary-500 ring-2 ring-primary-500/20'
                            : 'bg-surface border-border hover:bg-surfaceSubtle'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-primary-50 text-primary-600' : 'bg-surfaceSubtle text-muted'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xs sm:text-sm text-foreground">{item.label}</div>
                          <div className="text-[11px] text-muted">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="min-h-[44px] px-6 py-2.5 rounded-lg bg-foreground text-surface text-xs sm:text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-subtle touch-target"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TELL US ABOUT THE DEVICE */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Tell us about the device
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Specifications help our lab technicians match and prepare software.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Brand / Manufacturer</label>
                    <input
                      type="text"
                      required
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="e.g. Lenovo, Dell, HP, Apple"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      autoCapitalize="words"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Model Name</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. ThinkPad T480 / Inspiron 15"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">System RAM</label>
                    <input
                      type="text"
                      required
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      placeholder="e.g. 8GB DDR4"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Storage Capacity</label>
                    <input
                      type="text"
                      required
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      placeholder="e.g. 256GB SSD"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Cosmetic Condition</label>
                    <select
                      value={condition}
                      onChange={(e: any) => setCondition(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    >
                      <option value="like_new">Excellent (Near new / flawless)</option>
                      <option value="good">Good (Minor scratches / normal wear)</option>
                      <option value="fair">Fair (Noticeable casing wear)</option>
                      <option value="needs_repair">Needs minor repair / parts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Approximate Age (Years)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="15"
                      value={approximateAgeYears}
                      onChange={(e) => setApproximateAgeYears(parseInt(e.target.value, 10) || 1)}
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-surfaceSubtle rounded-lg border border-border space-y-2.5 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer font-medium text-foreground min-h-[36px]">
                    <input
                      type="checkbox"
                      checked={powersOn}
                      onChange={(e) => setPowersOn(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary-600 focus:ring-primary-500"
                    />
                    <span>Device turns on and reaches startup / BIOS screen</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer font-medium text-foreground min-h-[36px]">
                    <input
                      type="checkbox"
                      checked={hasCharger}
                      onChange={(e) => setHasCharger(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary-600 focus:ring-primary-500"
                    />
                    <span>Power adapter / charger cable included</span>
                  </label>
                </div>

                <div className="pt-3 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-surfaceSubtle text-foreground text-xs sm:text-sm font-medium hover:bg-surfaceHover transition-colors touch-target"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="min-h-[44px] px-6 py-2.5 rounded-lg bg-foreground text-surface text-xs sm:text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-subtle touch-target"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HOW CAN WE RECEIVE IT? */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    How can we receive it?
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Select your preferred handover logistics option.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'courier_pickup', title: 'Pickup', desc: 'Doorstep collection coordinated' },
                    { id: 'dropoff', title: 'Drop-off', desc: 'Drop at a regional verified hub' },
                    { id: 'self_ship', title: 'Self-ship', desc: 'Ship using tracked courier' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPickupPreference(m.id as any)}
                      className={`p-4 rounded-xl border text-left transition-all min-h-[56px] flex items-center sm:items-start gap-3.5 sm:flex-col touch-target ${
                        pickupPreference === m.id
                          ? 'bg-surfaceSubtle border-primary-500 ring-2 ring-primary-500/20'
                          : 'bg-surface border-border hover:bg-surfaceSubtle'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-foreground">{m.title}</div>
                        <div className="text-[11px] text-muted">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Handover Notes / Instructions (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Preferred pickup days, building access notes, etc."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                  />
                </div>

                <div className="pt-3 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-surfaceSubtle text-foreground text-xs sm:text-sm font-medium hover:bg-surfaceHover transition-colors touch-target"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="min-h-[44px] px-6 py-2.5 rounded-lg bg-foreground text-surface text-xs sm:text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-subtle touch-target"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: YOUR DETAILS (Proper Android keyboard input types) */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Your details
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Used solely for handover coordination and tracking code delivery.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Your Name / Organization</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      autoComplete="name"
                      autoCapitalize="words"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="aryan@example.com"
                      autoComplete="email"
                      inputMode="email"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Phone (for handover)</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-surfaceSubtle text-foreground text-xs sm:text-sm font-medium hover:bg-surfaceHover transition-colors touch-target"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="min-h-[44px] px-6 py-2.5 rounded-lg bg-foreground text-surface text-xs sm:text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-subtle touch-target"
                  >
                    <span>Review donation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW DONATION & SUBMIT */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Review donation
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Confirm details and acknowledge sanitization protocol.</p>
                </div>

                <div className="p-4 bg-surfaceSubtle rounded-xl border border-border space-y-2 text-xs">
                  <div className="font-bold text-foreground">Donation Summary</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-muted">
                    <div>Device: <strong className="text-foreground block">{manufacturer} {model}</strong></div>
                    <div>Category: <strong className="text-foreground block">{deviceType}</strong></div>
                    <div>Specs: <strong className="text-foreground block">{ram} / {storage}</strong></div>
                    <div>Handover: <strong className="text-foreground block capitalize">{pickupPreference.replace('_', ' ')}</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-surfaceSubtle rounded-xl border border-border space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Lock className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>Data Sanitization Acknowledgment</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    All storage drives undergo data sanitization aligned with NIST SP 800-88 guidance before deployment. All existing files will be permanently erased.
                  </p>
                  <label className="flex items-start gap-3 text-xs text-foreground cursor-pointer font-medium pt-1 min-h-[36px]">
                    <input
                      type="checkbox"
                      required
                      checked={agreedToSanitization}
                      onChange={(e) => setAgreedToSanitization(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-border text-primary-600 focus:ring-primary-500 shrink-0"
                    />
                    <span>I understand and authorize complete data sanitization of this hardware.</span>
                  </label>
                </div>

                <div className="pt-3 flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-surfaceSubtle text-foreground text-xs sm:text-sm font-medium hover:bg-surfaceHover transition-colors touch-target"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedToSanitization}
                    className="min-h-[44px] px-6 py-2.5 rounded-lg bg-foreground hover:bg-foreground/90 text-surface font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 disabled:opacity-50 shadow-subtle touch-target"
                  >
                    {isSubmitting ? 'Registering Device...' : 'Submit device'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      )}

    </div>
  );
}
