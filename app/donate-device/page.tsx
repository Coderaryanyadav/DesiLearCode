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
  ArrowRight, 
  Search, 
  Lock,
  Cpu,
  AlertCircle,
  HardDrive,
  Check,
  ChevronRight,
  RefreshCw,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function DonateDevicePage() {
  const { currentUser } = useAuth();

  // Multi-step Wizard State (1: Specs, 2: Condition, 3: Logistics, 4: Sanitization Pledge, 5: Review & Submit)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-surfaceSubtle border border-border text-[11px] font-mono text-muted">
          <span>HARDWARE INTAKE & LOGISTICS PIPELINE</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground tracking-tight">
          Pledge Hardware. Track Lab Allocation.
        </h1>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Pre-owned computers undergo multi-pass cryptographic disk sanitization, diagnostics, and educational OS deployment before routing to verified community learning labs.
        </p>
      </div>

      {/* TRACKING LOOKUP CONSOLE */}
      <div className="bg-[#090c10] rounded-xl p-6 sm:p-8 border border-[#21262d] text-[#8b949e] font-mono text-xs shadow-panel">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Chain of Custody Tracking</span>
            </div>
            <span className="text-[11px] text-[#576071]">FORMAT: DL-XXXX OR DLC-XXXX</span>
          </div>

          <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchTrackingCode}
              onChange={(e) => setSearchTrackingCode(e.target.value.toUpperCase())}
              placeholder="Enter Hardware Tracking Code (e.g. DL-1049)"
              className="flex-1 px-4 py-2.5 rounded bg-[#0d1117] border border-[#30363d] text-white placeholder:text-[#576071] focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />
            <button
              type="submit"
              disabled={isTracking}
              className="px-5 py-2.5 rounded bg-white text-black font-bold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isTracking ? 'Inspecting Registry...' : 'Track Asset'}
            </button>
          </form>

          {trackingError && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {trackedDevice && (
            <div className="mt-4 p-4 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-[#21262d]">
                <span className="font-bold text-white text-sm">ASSET ID: #{trackedDevice.trackingCode}</span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                  STATE: {trackedDevice.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-[#161b22] rounded">
                  <div className="text-[10px] text-[#576071]">TYPE</div>
                  <div className="text-white font-bold">{trackedDevice.deviceType}</div>
                </div>
                <div className="p-2 bg-[#161b22] rounded">
                  <div className="text-[10px] text-[#576071]">MODEL</div>
                  <div className="text-white font-bold">{trackedDevice.manufacturer} {trackedDevice.model}</div>
                </div>
                <div className="p-2 bg-[#161b22] rounded">
                  <div className="text-[10px] text-[#576071]">SPECS</div>
                  <div className="text-white font-bold">{trackedDevice.ram} / {trackedDevice.storage}</div>
                </div>
                <div className="p-2 bg-[#161b22] rounded">
                  <div className="text-[10px] text-[#576071]">DESTINATION</div>
                  <div className="text-indigo-400 font-bold truncate">{trackedDevice.assignedOrgName || 'Queueing'}</div>
                </div>
              </div>
              <div className="pt-2">
                <DeviceTimeline device={trackedDevice} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUBMISSION WORKFLOW OR RECEIPT */}
      {submittedCode ? (
        <div className="bg-surface rounded-xl p-8 sm:p-12 border border-border max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95">
          <div className="w-12 h-12 bg-success-50 text-success-600 rounded-md flex items-center justify-center mx-auto border border-success-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded border border-primary-200">
              TRACKING ID: #{submittedCode}
            </span>
            <h2 className="text-xl font-display font-bold text-foreground">
              Hardware Intake Recorded
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Your device assessment has been logged in the national ledger. Our regional hub technician will contact you to coordinate handover.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSubmittedCode(null);
                setSearchTrackingCode('');
                setCurrentStep(1);
              }}
              className="px-6 py-2.5 rounded-md bg-foreground text-surface hover:bg-foreground/90 font-medium text-xs transition-colors"
            >
              Intake Another Asset
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Stepped Form */}
          <div className="lg:col-span-8 bg-surface p-6 sm:p-8 rounded-xl border border-border space-y-6">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-primary-600 uppercase">
                  STEP {currentStep} OF 4
                </span>
                <h2 className="text-base font-bold text-foreground">
                  {currentStep === 1 && '1. Hardware Specifications'}
                  {currentStep === 2 && '2. Functional Diagnostics'}
                  {currentStep === 3 && '3. Handover & Logistics Method'}
                  {currentStep === 4 && '4. Sanitization Agreement & Review'}
                </h2>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCurrentStep(s)}
                    className={`w-6 h-6 rounded text-[11px] font-mono font-bold transition-colors ${
                      currentStep === s 
                        ? 'bg-foreground text-surface' 
                        : currentStep > s 
                        ? 'bg-success-50 text-success-700 border border-success-200' 
                        : 'bg-surfaceSubtle text-muted'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: SPECS */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Asset Category</label>
                      <select
                        value={deviceType}
                        onChange={(e: any) => setDeviceType(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      >
                        <option value="Laptop">Laptop Computer</option>
                        <option value="Desktop">Desktop Tower & Peripherals</option>
                        <option value="Tablet">Tablet Device</option>
                        <option value="Monitor">External Display / Monitor</option>
                        <option value="Raspberry Pi">Raspberry Pi / STEM Board</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Manufacturer</label>
                      <input
                        type="text"
                        required
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        placeholder="e.g. Lenovo, Dell, HP, Apple"
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Model Name / Series</label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. ThinkPad T480 / Latitude 5490"
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
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
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Drive Storage Capacity</label>
                      <input
                        type="text"
                        required
                        value={storage}
                        onChange={(e) => setStorage(e.target.value)}
                        placeholder="e.g. 256GB NVMe SSD"
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Approximate Age (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={approximateAgeYears}
                        onChange={(e) => setApproximateAgeYears(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 rounded-md bg-foreground text-surface text-xs font-medium hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
                    >
                      <span>Proceed to Diagnostics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CONDITION & DIAGNOSTICS */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-surfaceSubtle rounded-md border border-border space-y-3">
                    <div className="text-xs font-bold text-foreground">Hardware Operational Status</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={powersOn}
                          onChange={(e) => setPowersOn(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                        />
                        <span>Device turns on & reaches BIOS / OS</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={hasCharger}
                          onChange={(e) => setHasCharger(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                        />
                        <span>Power adapter / cable included</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Cosmetic Condition</label>
                      <select
                        value={condition}
                        onChange={(e: any) => setCondition(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      >
                        <option value="like_new">Excellent (Flawless screen/body)</option>
                        <option value="good">Good (Minor cosmetic scratches)</option>
                        <option value="fair">Fair (Noticeable casing wear)</option>
                        <option value="needs_repair">Needs Part / Minor Repair</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Battery Health</label>
                      <select
                        value={batteryCondition}
                        onChange={(e: any) => setBatteryCondition(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      >
                        <option value="excellent">Holds charge &gt; 3 hours</option>
                        <option value="good">Holds charge 1 - 3 hours</option>
                        <option value="fair">Holds charge &lt; 1 hour</option>
                        <option value="dead_or_missing">Must be plugged into wall</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 rounded-md bg-surfaceSubtle text-foreground text-xs font-medium hover:bg-surfaceHover transition-colors"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 rounded-md bg-foreground text-surface text-xs font-medium hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
                    >
                      <span>Proceed to Handover</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: LOGISTICS & DONOR CONTACT */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Handover Method</label>
                    <select
                      value={pickupPreference}
                      onChange={(e: any) => setPickupPreference(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    >
                      <option value="courier_pickup">Schedule Courier Pickup at Address</option>
                      <option value="dropoff">Direct Drop-off at Verified Regional Hub</option>
                      <option value="self_ship">Self-Ship via Tracked Courier</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Donor Name / Org</label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Vikramaditya Sen"
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Email for Chain of Custody</label>
                      <input
                        type="email"
                        required
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="vikram@domain.com"
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Logistics Notes / Special Instructions</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional notes regarding pickup time, gate security, or packaging..."
                      className="w-full px-3 py-2 text-xs rounded-md border border-border bg-surfaceSubtle focus:bg-surface focus:outline-none focus:border-primary-500 font-medium"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 rounded-md bg-surfaceSubtle text-foreground text-xs font-medium hover:bg-surfaceHover transition-colors"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 rounded-md bg-foreground text-surface text-xs font-medium hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
                    >
                      <span>Review & Pledge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SANITIZATION AGREEMENT & SUBMIT */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-surfaceSubtle rounded-md border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Lock className="w-4 h-4 text-primary-500" />
                      <span>NIST 800-88 Data Sanitization Protocol</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      All donated hardware drives are reformatted using a multi-pass cryptographic overwrite before OS provisioning. By submitting, you acknowledge that existing data will be permanently wiped.
                    </p>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer font-medium pt-1">
                      <input
                        type="checkbox"
                        required
                        checked={agreedToSanitization}
                        onChange={(e) => setAgreedToSanitization(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                      />
                      <span>I authorize DesiLearCode to wipe and configure this device for educational labs.</span>
                    </label>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 bg-surfaceSubtle rounded-md border border-border text-xs font-mono space-y-1">
                    <div className="text-muted">ASSET: <span className="text-foreground font-bold">{manufacturer} {model} ({deviceType})</span></div>
                    <div className="text-muted">SPECS: <span className="text-foreground">{ram} RAM • {storage} • {condition.toUpperCase()}</span></div>
                    <div className="text-muted">DONOR: <span className="text-foreground">{donorName} ({donorEmail})</span></div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 rounded-md bg-surfaceSubtle text-foreground text-xs font-medium hover:bg-surfaceHover transition-colors"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !agreedToSanitization}
                      className="px-6 py-2.5 rounded-md bg-foreground hover:bg-foreground/90 text-surface font-medium text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Registering Asset...' : 'Generate Tracking Code & Submit'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Right Sidebar Standards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#090c10] text-[#8b949e] rounded-xl p-5 border border-[#21262d] space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verification Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Hardware assigned strictly to audited grassroots NGO learning centers. Zero-PII child safeguarding rules enforced.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-[#21262d] text-[11px]">
                <div className="flex items-center gap-2 text-white">✓ Drive wiped to NIST standards</div>
                <div className="flex items-center gap-2 text-white">✓ Offline STEM bundle installed</div>
                <div className="flex items-center gap-2 text-white">✓ Tamper-evident barcode asset tag</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
