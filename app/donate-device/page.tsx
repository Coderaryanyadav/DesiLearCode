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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          Hardware Refurbishment & Rehoming
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Donate a Device. Track Its Impact.
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          We turn your pre-loved laptops, tablets, and computers into secure educational workstations for children in verified learning centers.
        </p>
      </div>

      {/* TRACKING LOOKUP BAR */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Track an Existing Device Donation</h3>
            </div>
            <span className="text-xs font-mono text-indigo-300">Format: TFK-XXXX</span>
          </div>

          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTrackingCode}
              onChange={(e) => setSearchTrackingCode(e.target.value.toUpperCase())}
              placeholder="Enter your Tracking ID (e.g. TFK-1049)"
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs sm:text-sm font-mono"
            />
            <button
              type="submit"
              disabled={isTracking}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition disabled:opacity-60"
            >
              {isTracking ? 'Searching...' : 'Track Device'}
            </button>
          </form>

          {trackingError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-xl text-xs">
              {trackingError}
            </div>
          )}

          {trackedDevice && (
            <div className="mt-4 p-5 bg-white/10 rounded-2xl border border-white/20 space-y-4 text-xs animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="font-mono font-bold text-emerald-400 text-sm">#{trackedDevice.trackingCode}</span>
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full text-[11px]">
                  {trackedDevice.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Device: <strong className="text-white">{trackedDevice.manufacturer} {trackedDevice.model}</strong></div>
                <div>Storage/RAM: <strong className="text-white">{trackedDevice.storage} / {trackedDevice.ram}</strong></div>
              </div>
              <div className="pt-2">
                <DeviceTimeline device={trackedDevice} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUBMISSION FORM OR CONFIRMATION */}
      {submittedCode ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Tracking Code: #{submittedCode}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Device Assessment Recorded!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your hardware intake assessment has been saved to the PostgreSQL registry. Our technician will coordinate pickup or dropoff.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedCode(null);
                setSearchTrackingCode('');
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Donate Another Device
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 1 of 2</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Hardware Technical Assessment</h2>
              <p className="text-xs text-slate-500 mt-0.5">Please specify the model, condition, and specs so we can allocate educational OS images.</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Device Type</label>
                  <select
                    value={deviceType}
                    onChange={(e: any) => setDeviceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop PC</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Raspberry Pi">Raspberry Pi / Single Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Dell, HP, Lenovo, Apple"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name / Number</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Latitude 5490 / ThinkPad E14"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approximate Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={approximateAgeYears}
                    onChange={(e) => setApproximateAgeYears(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated RAM</label>
                  <input
                    type="text"
                    required
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="e.g. 8GB DDR4"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Type & Size</label>
                  <input
                    type="text"
                    required
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="e.g. 256GB SSD / 500GB HDD"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Physical Condition Toggles */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                <div className="font-bold text-slate-900">Functional Condition Checks</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={powersOn}
                      onChange={(e) => setPowersOn(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Device successfully powers on</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasCharger}
                      onChange={(e) => setHasCharger(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Includes power adapter / charger</span>
                  </label>
                </div>
              </div>

              {/* Donor Contact */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-slate-900 text-xs">Donor Notification Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email for Tracking</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting Assessment...' : 'Submit Device Assessment & Generate Tracking Code'}
              </button>
            </form>
          </div>

          {/* Right Sidebar Checklist */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Our Privacy & Refurbish Charter</span>
              </div>
              <h3 className="text-sm font-bold text-white">Zero Data Left Behind</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before any device reaches a classroom, our technical team performs a multi-pass NIST-compliant disk wipe and installs a sanitized Linux/Scratch educational OS.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">✓ Physical hardware diagnostic</div>
                <div className="flex items-center gap-2">✓ Child-safe internet filtering configured</div>
                <div className="flex items-center gap-2">✓ #TFK tamper-evident asset tag attached</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
