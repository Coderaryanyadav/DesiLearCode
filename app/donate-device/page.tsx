'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DeviceDonation, DeviceType } from '@/lib/types';
import { DeviceTimeline } from '@/components/DeviceTimeline';
import { submitDeviceDonation, trackDeviceCode } from '@/app/actions/devices';
import { 
  Laptop, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Info, 
  Lock,
  Cpu,
  AlertCircle
} from 'lucide-react';

export default function DonateDevicePage() {
  const { currentUser } = useAuth();

  // Form State
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [deviceType, setDeviceType] = useState<DeviceType>('Laptop');
  const [manufacturer, setManufacturer] = useState('Lenovo');
  const [model, setModel] = useState('ThinkPad E14');
  const [approximateAgeYears, setApproximateAgeYears] = useState(3);
  const [condition, setCondition] = useState<'like_new' | 'good' | 'fair' | 'needs_repair'>('good');
  const [powersOn, setPowersOn] = useState(true);
  const [batteryCondition, setBatteryCondition] = useState<'excellent' | 'good' | 'fair' | 'dead_or_missing'>('good');
  const [hasCharger, setHasCharger] = useState(true);
  const [storage, setStorage] = useState('256GB SSD');
  const [ram, setRam] = useState('8GB DDR4');
  const [os, setOs] = useState('Windows 10 / Ubuntu');
  const [pickupPreference, setPickupPreference] = useState<'courier_pickup' | 'dropoff' | 'self_ship'>('courier_pickup');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search Tracking
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [trackedDevice, setTrackedDevice] = useState<DeviceDonation | null>(null);
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
      setTrackingError('Failed to lookup tracking code.');
      setTrackedDevice(null);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-success-700 bg-success-50 px-3.5 py-1.5 rounded-full border border-success-200">
          Hardware Refurbishment & Rehoming
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-foreground tracking-tight">
          Donate a Device. Track Its Impact.
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
          We turn your pre-loved laptops, tablets, and computers into secure educational workstations for children in verified learning centers.
        </p>
      </div>

      {/* TRACKING LOOKUP BAR */}
      <div className="bg-foreground rounded-[2.5rem] p-8 sm:p-12 text-surface shadow-card relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-display font-bold text-surface">Track an Existing Device Donation</h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground/80 font-bold bg-surface/10 px-2.5 py-1 rounded-full">Format: DLC-XXXX</span>
          </div>

          <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchTrackingCode}
              onChange={(e) => setSearchTrackingCode(e.target.value.toUpperCase())}
              placeholder="Enter your Tracking ID (e.g. DLC-1049)"
              className="flex-1 px-5 py-4 rounded-2xl bg-surface/10 border border-surface/20 text-surface placeholder:text-surface/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-sm font-mono transition-all backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={isTracking}
              className="px-8 py-4 rounded-2xl bg-primary-500 hover:bg-primary-400 text-surface font-extrabold text-sm transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isTracking ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                  Searching...
                </span>
              ) : 'Track Device'}
            </button>
          </form>

          {trackingError && (
            <div className="p-4 bg-error-500/20 border border-error-500/40 text-error-200 rounded-2xl text-sm font-medium backdrop-blur-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {trackedDevice && (
            <div className="mt-6 p-6 sm:p-8 bg-surface/10 rounded-3xl border border-surface/20 space-y-6 text-sm animate-in fade-in backdrop-blur-md">
              <div className="flex justify-between items-center pb-4 border-b border-surface/10">
                <span className="font-mono font-bold text-primary-300 text-base">#{trackedDevice.trackingCode}</span>
                <span className="bg-success-500/20 text-success-300 border border-success-500/30 font-bold px-3 py-1.5 rounded-full text-xs">
                  {trackedDevice.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-surface/80">
                <div className="p-4 bg-surface/5 rounded-2xl border border-surface/5">
                  <div className="text-xs font-bold text-surface/50 mb-1">Device</div>
                  <strong className="text-surface text-base">{trackedDevice.manufacturer} {trackedDevice.model}</strong>
                </div>
                <div className="p-4 bg-surface/5 rounded-2xl border border-surface/5">
                  <div className="text-xs font-bold text-surface/50 mb-1">Specs</div>
                  <strong className="text-surface text-base">{trackedDevice.storage} / {trackedDevice.ram}</strong>
                </div>
              </div>
              <div className="pt-4">
                <DeviceTimeline device={trackedDevice} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUBMISSION FORM OR CONFIRMATION */}
      {submittedCode ? (
        <div className="bg-surface rounded-3xl p-8 sm:p-14 border border-border shadow-card max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-success-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono font-bold bg-success-50 text-success-700 px-3 py-1.5 rounded-full border border-success-200">
              Tracking Code: #{submittedCode}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground mt-2 tracking-tight">
              Device Assessment Recorded!
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed">
              Your hardware intake assessment has been saved to the secure registry. Our technician will coordinate pickup or dropoff.
            </p>
          </div>

          <div className="pt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedCode(null);
                setSearchTrackingCode('');
              }}
              className="px-8 py-3.5 rounded-2xl bg-foreground hover:bg-foreground/90 text-surface font-bold text-sm transition-all shadow-card"
            >
              Donate Another Device
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form */}
          <div className="lg:col-span-8 bg-surface p-6 sm:p-10 rounded-3xl border border-border shadow-soft space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Step 1 of 2</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Hardware Technical Assessment</h2>
              <p className="text-sm text-muted">Please specify the model, condition, and specs so we can allocate educational OS images.</p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Device Type</label>
                  <select
                    value={deviceType}
                    onChange={(e: any) => setDeviceType(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop PC</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Raspberry Pi">Raspberry Pi / Single Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Dell, HP, Lenovo, Apple"
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Model Name / Number</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Latitude 5490 / ThinkPad E14"
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Approximate Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={approximateAgeYears}
                    onChange={(e) => setApproximateAgeYears(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Estimated RAM</label>
                  <input
                    type="text"
                    required
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="e.g. 8GB DDR4"
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Storage Type & Size</label>
                  <input
                    type="text"
                    required
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="e.g. 256GB SSD / 500GB HDD"
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                  />
                </div>
              </div>

              {/* Physical Condition Toggles */}
              <div className="p-6 bg-surfaceHover rounded-3xl border border-border space-y-4">
                <div className="text-base font-display font-bold text-foreground">Functional Condition Checks</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={powersOn}
                        onChange={(e) => setPowersOn(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-border rounded-md bg-surface checked:bg-primary-600 checked:border-primary-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
                      />
                      <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary-600 transition-colors">Device successfully powers on</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={hasCharger}
                        onChange={(e) => setHasCharger(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-border rounded-md bg-surface checked:bg-primary-600 checked:border-primary-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
                      />
                      <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary-600 transition-colors">Includes power adapter / charger</span>
                  </label>
                </div>
              </div>

              {/* Donor Contact */}
              <div className="space-y-4 pt-4">
                <div className="text-base font-display font-bold text-foreground">Donor Notification Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Email for Tracking</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-surfaceHover focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-muted font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-foreground hover:bg-foreground/90 text-surface font-bold text-sm transition-all shadow-card disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                      Submitting Assessment...
                    </span>
                  ) : 'Submit Device Assessment & Generate Tracking Code'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar Checklist */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-foreground text-surface rounded-3xl p-8 space-y-5 shadow-card relative overflow-hidden">
              {/* Abstract decorative shape */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-surface/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2.5 text-xs font-bold text-success-400 uppercase tracking-wider">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Our Privacy & Refurbish Charter</span>
                </div>
                <h3 className="text-lg font-display font-bold text-surface">Zero Data Left Behind</h3>
                <p className="text-sm text-surface/80 leading-relaxed">
                  Before any device reaches a classroom, our technical team performs a multi-pass NIST-compliant disk wipe and installs a sanitized Linux/Scratch educational OS.
                </p>
                <div className="space-y-3 pt-4 text-sm font-medium text-surface/70 border-t border-surface/10">
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-success-400" /> Physical hardware diagnostic</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-success-400" /> Child-safe internet filtering configured</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-success-400" /> #DLC tamper-evident asset tag attached</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
