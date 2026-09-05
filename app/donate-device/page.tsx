'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { DeviceDonation, DeviceType, DeviceStatus } from '@/lib/types';
import { DeviceTimeline } from '@/components/DeviceTimeline';
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
  Cpu
} from 'lucide-react';

export default function DonateDevicePage() {
  const { devices, submitDeviceDonation } = useStore();
  const { currentUser } = useAuth();

  // Form State
  const [donorName, setDonorName] = useState(currentUser.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser.email || '');
  const [donorPhone, setDonorPhone] = useState(currentUser.phone || '');
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
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [trackedDevice, setTrackedDevice] = useState<DeviceDonation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = submitDeviceDonation({
      donorName,
      donorEmail,
      donorPhone,
      deviceType,
      manufacturer,
      model,
      approximateAgeYears,
      condition,
      powersOn,
      batteryCondition,
      hasCharger,
      storage,
      ram,
      os,
      pickupPreference,
      notes,
    });

    setSubmittedCode(code);
    const found = devices.find(d => d.trackingCode === code);
    if (found) setTrackedDevice(found);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTrackingCode.trim().toUpperCase().replace('#', '');
    const found = devices.find(d => d.trackingCode === clean || d.trackingCode === `TFK-${clean}`);
    if (found) {
      setTrackedDevice(found);
    } else {
      alert(`No device record found for code "${searchTrackingCode}". Try TFK-104 or TFK-108.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Hardware Donation Portal
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Your Old Device Could Open a New Door
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We securely wipe, repair, refurbish, and deploy laptops, computers, and tablets directly into verified children&apos;s learning classrooms with end-to-end transparent tracking.
        </p>
      </div>

      {/* Tracker Lookup Bar */}
      <div className="bg-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Track Any Device In Real-Time
            </h3>
            <p className="text-xs text-slate-300">
              Enter your tracking code (e.g. <strong className="text-white cursor-pointer underline" onClick={() => setSearchTrackingCode('TFK-104')}>TFK-104</strong> or <strong className="text-white cursor-pointer underline" onClick={() => setSearchTrackingCode('TFK-108')}>TFK-108</strong>) to view live refurbishment steps.
            </p>
          </div>

          <div className="md:col-span-6">
            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TFK-104"
                value={searchTrackingCode}
                onChange={(e) => setSearchTrackingCode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs text-slate-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Active Tracked Device Result */}
      {trackedDevice && (
        <div className="max-w-4xl mx-auto space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Tracking Result</h3>
            <button 
              onClick={() => setTrackedDevice(null)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Close Tracker
            </button>
          </div>
          <DeviceTimeline device={trackedDevice} />
        </div>
      )}

      {/* Submission Success Box */}
      {submittedCode && (
        <div className="max-w-2xl mx-auto p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4 shadow-sm animate-in zoom-in-95">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold bg-emerald-200 text-emerald-950 px-3 py-1 rounded-full">
              #{submittedCode}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              Donation Intake Registered Successfully!
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Our technical refurbishment team will review the specs within 24 hours. You can track this device anytime using code <strong>{submittedCode}</strong>.
            </p>
          </div>
          <button
            onClick={() => {
              const d = devices.find(x => x.trackingCode === submittedCode);
              if (d) setTrackedDevice(d);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
          >
            View Live Tracker Timeline
          </button>
        </div>
      )}

      {/* Donation Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Device Intake & Diagnostic Assessment</h2>
          <p className="text-xs text-slate-500 mt-1">
            Please provide accurate details so our technicians can prepare appropriate refurbishment components.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Donor Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md w-fit">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email for Updates *</label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Hardware Specs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md w-fit">
              2. Device Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Device Type *</label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {['Laptop', 'Desktop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Router', 'Arduino', 'Raspberry Pi', 'Other'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer *</label>
                <input
                  type="text"
                  required
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Dell, Lenovo, HP, Apple"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name / Number *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Latitude 5490, ThinkPad T480"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">RAM Capacity</label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="e.g. 8GB DDR4"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Type & Size</label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="e.g. 256GB SSD or 500GB HDD"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Approx. Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={approximateAgeYears}
                  onChange={(e) => setApproximateAgeYears(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Diagnostic Condition */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md w-fit">
              3. Condition & Health
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="like_new">Like New (No scratches, perfect screen)</option>
                  <option value="good">Good (Light cosmetic wear, fully working)</option>
                  <option value="fair">Fair (Visible scuffs, operational)</option>
                  <option value="needs_repair">Needs Repair (Broken key, battery issue)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Battery Health</label>
                <select
                  value={batteryCondition}
                  onChange={(e) => setBatteryCondition(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="excellent">Excellent (Holds charge for 3+ hours)</option>
                  <option value="good">Good (Holds charge for 1.5 - 3 hours)</option>
                  <option value="fair">Fair (Works for &lt; 1 hour unplugged)</option>
                  <option value="dead_or_missing">Must be plugged in / No battery</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="powerCheck"
                  checked={powersOn}
                  onChange={(e) => setPowersOn(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <label htmlFor="powerCheck" className="text-xs text-slate-700 font-medium">
                  Device successfully powers on and boots
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="chargerCheck"
                  checked={hasCharger}
                  onChange={(e) => setHasCharger(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <label htmlFor="chargerCheck" className="text-xs text-slate-700 font-medium">
                  Original charger/power supply is included
                </label>
              </div>
            </div>
          </div>

          {/* Step 4: Fulfillment Logistics */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md w-fit">
              4. Logistics Preference
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'courier_pickup', label: 'Doorstep Courier Pickup', desc: 'Prepaid shipping label arranged by TechForKids' },
                { id: 'dropoff', label: 'Drop-off at Hub', desc: 'Bring directly to our regional processing facility' },
                { id: 'self_ship', label: 'Self-Ship / Courier', desc: 'Direct shipping with our destination warehouse code' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setPickupPreference(opt.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    pickupPreference === opt.id
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special remarks regarding passwords, missing screws, or packaging details..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Privacy & Wiping Guarantee */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-start gap-3 text-xs">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block font-semibold">DoD 5220.22-M Compliant Data Sanitization</strong>
              <span className="text-slate-300">
                All storage drives undergo automated cryptographic overwriting before educational Linux/Windows imaging. No personal data ever remains on donor devices.
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-lg shadow-emerald-600/20"
          >
            Submit Device Donation & Generate Tracking Code
          </button>
        </form>
      </div>

    </div>
  );
}
