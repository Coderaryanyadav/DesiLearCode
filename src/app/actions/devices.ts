'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { DeviceStatus, DeviceType } from '@/lib/types';
import { DeviceDonationSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';
import { getPublicDeviceByTrackingCode } from '@/lib/db/devices';
import { generateDeviceTrackingCode } from '@/lib/crypto-id';
import { isValidDeviceTransition } from '@/lib/device-lifecycle';
import { checkRateLimit } from '@/lib/rate-limit';

export async function submitDeviceDonation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Rate limiting (max 5 submissions per minute)
  const rateLimitKey = user ? `device:${user.id}` : `device:anon:${formData.get('donorEmail') || 'unknown'}`;
  const rateLimit = checkRateLimit({ identifier: rateLimitKey, limit: 5, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return { error: 'Submission rate limit exceeded. Please wait a minute before submitting another device.' };
  }

  let donorProfileId: string | null = null;
  let actorName = (formData.get('donorName') as string)?.trim() || 'Anonymous Donor';
  let actorEmail = (formData.get('donorEmail') as string)?.trim() || '';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      donorProfileId = profile.id;
      actorName = profile.full_name;
      actorEmail = profile.email;
    }
  }

  const rawPayload = {
    donorName: actorName,
    donorEmail: actorEmail,
    donorPhone: (formData.get('donorPhone') as string) || undefined,
    deviceType: formData.get('deviceType') as DeviceType,
    manufacturer: formData.get('manufacturer') as string,
    model: formData.get('model') as string,
    approximateAgeYears: Number(formData.get('approximateAgeYears') || 3),
    condition: formData.get('condition') as any,
    powersOn: formData.get('powersOn') === 'true',
    batteryCondition: formData.get('batteryCondition') as any,
    hasCharger: formData.get('hasCharger') === 'true',
    storage: formData.get('storage') as string,
    ram: formData.get('ram') as string,
    os: formData.get('os') as string,
    pickupPreference: formData.get('pickupPreference') as any,
    notes: (formData.get('notes') as string) || undefined,
  };

  const validation = DeviceDonationSchema.safeParse(rawPayload);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || 'Invalid device assessment.' };
  }

  // Cryptographically secure tracking code with 4.29 billion combinations
  const trackingCode = generateDeviceTrackingCode();

  const { data: device, error } = await supabase
    .from('devices')
    .insert({
      tracking_code: trackingCode,
      donor_id: donorProfileId,
      donor_name: rawPayload.donorName,
      donor_email: rawPayload.donorEmail,
      donor_phone: rawPayload.donorPhone,
      device_type: rawPayload.deviceType,
      manufacturer: rawPayload.manufacturer,
      model: rawPayload.model,
      approximate_age_years: rawPayload.approximateAgeYears,
      condition: rawPayload.condition,
      powers_on: rawPayload.powersOn,
      battery_condition: rawPayload.batteryCondition,
      has_charger: rawPayload.hasCharger,
      storage: rawPayload.storage,
      ram: rawPayload.ram,
      os: rawPayload.os,
      pickup_preference: rawPayload.pickupPreference,
      notes: rawPayload.notes,
      status: 'Submitted' as DeviceStatus,
    })
    .select()
    .single();

  if (error || !device) {
    return { error: error?.message || 'Failed to submit device assessment.' };
  }

  // Insert initial device update lifecycle event
  await supabase.from('device_updates').insert({
    device_id: device.id,
    status: 'Submitted' as DeviceStatus,
    technician_note: 'Initial device assessment submitted by donor. Intake queued for technical review.',
  });

  await logAuditEvent({
    actorName,
    actorEmail,
    actorRole: donorProfileId ? 'donor' : 'visitor',
    action: 'DEVICE_DONATION_SUBMITTED',
    targetType: 'device',
    targetId: device.id,
    details: `Device ${rawPayload.manufacturer} ${rawPayload.model} submitted with tracking code ${trackingCode}.`,
  });

  revalidatePath('/dashboard/devices');
  revalidatePath('/donate-device');
  return { success: true, trackingCode, deviceId: device.id };
}

export async function updateDeviceStatus(deviceId: string, status: DeviceStatus, technicianNote: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'ngo')) {
    return { error: 'Forbidden. Authorized technicians or administrators only.' };
  }

  // Fetch current device to enforce tenant isolation and valid state machine transition
  const { data: existingDevice, error: fetchErr } = await supabase
    .from('devices')
    .select('id, status, assigned_organization_id')
    .eq('id', deviceId)
    .single();

  if (fetchErr || !existingDevice) {
    return { error: 'Device record not found.' };
  }

  // Tenant Isolation: NGO can only update devices assigned to their own organization
  if (profile.role === 'ngo' && existingDevice.assigned_organization_id !== profile.organization_id) {
    return { error: 'Forbidden. You do not have permission to manage hardware assigned to other organizations.' };
  }

  // Lifecycle State Machine validation
  if (!isValidDeviceTransition(existingDevice.status as DeviceStatus, status)) {
    return { 
      error: `Invalid transition: cannot change status from "${existingDevice.status}" directly to "${status}".` 
    };
  }

  const { error: updateErr } = await supabase
    .from('devices')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', deviceId);

  if (updateErr) return { error: updateErr.message };

  await supabase.from('device_updates').insert({
    device_id: deviceId,
    status,
    technician_note: technicianNote || `Status updated to ${status}.`,
    updated_by: profile.id,
  });

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'DEVICE_STATUS_UPDATED',
    targetType: 'device',
    targetId: deviceId,
    details: `Device status moved from ${existingDevice.status} to ${status}. Note: ${technicianNote || 'None'}`,
  });

  revalidatePath('/admin/devices');
  revalidatePath('/dashboard/devices');
  return { success: true };
}

export async function trackDeviceCode(trackingCode: string) {
  if (!trackingCode || trackingCode.trim().length === 0) {
    return { error: 'Please enter a hardware tracking code.' };
  }

  const cleanCode = trackingCode.trim().toUpperCase();
  // Return privacy-preserving PublicDeviceTracking DTO
  const publicDevice = await getPublicDeviceByTrackingCode(cleanCode);
  if (!publicDevice) {
    return { error: 'No hardware records found for tracking identifier ' + cleanCode };
  }

  return { success: true, device: publicDevice };
}
