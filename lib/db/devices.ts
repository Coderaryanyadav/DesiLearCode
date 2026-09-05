import { createClient } from '@/lib/supabase/server';
import { DeviceDonation } from '@/lib/types';

export async function getDeviceByTrackingCode(trackingCode: string): Promise<DeviceDonation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devices')
    .select(`
      *,
      assigned_organization:assigned_organization_id (name),
      assigned_project:assigned_project_id (title),
      device_updates (*)
    `)
    .eq('tracking_code', trackingCode.toUpperCase())
    .single();

  if (error || !data) {
    return null;
  }

  return mapDeviceRow(data);
}

export async function getDevicesForDonor(donorProfileId: string): Promise<DeviceDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devices')
    .select(`
      *,
      assigned_organization:assigned_organization_id (name),
      assigned_project:assigned_project_id (title),
      device_updates (*)
    `)
    .eq('donor_id', donorProfileId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapDeviceRow(row));
}

export async function getDevicesForOrg(orgId: string): Promise<DeviceDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devices')
    .select(`
      *,
      assigned_organization:assigned_organization_id (name),
      assigned_project:assigned_project_id (title),
      device_updates (*)
    `)
    .eq('assigned_organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapDeviceRow(row));
}

export async function getAllDevicesForAdmin(): Promise<DeviceDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devices')
    .select(`
      *,
      assigned_organization:assigned_organization_id (name),
      assigned_project:assigned_project_id (title),
      device_updates (*)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapDeviceRow(row));
}

function mapDeviceRow(row: any): DeviceDonation {
  const history = (row.device_updates || []).map((u: any) => ({
    status: u.status,
    timestamp: u.created_at,
    note: u.technician_note,
  }));

  // Ensure initial status is at top of history if empty
  if (history.length === 0) {
    history.push({
      status: row.status,
      timestamp: row.created_at,
      note: 'Initial device assessment submitted by donor.',
    });
  }

  return {
    id: row.id,
    trackingCode: row.tracking_code,
    donorName: row.donor_name,
    donorEmail: row.donor_email,
    donorPhone: row.donor_phone,
    deviceType: row.device_type,
    manufacturer: row.manufacturer,
    model: row.model,
    approximateAgeYears: row.approximate_age_years,
    condition: row.condition,
    powersOn: row.powers_on,
    batteryCondition: row.battery_condition,
    hasCharger: row.has_charger,
    storage: row.storage,
    ram: row.ram,
    os: row.os,
    pickupPreference: row.pickup_preference,
    notes: row.notes,
    status: row.status,
    statusHistory: history,
    assignedOrgName: row.assigned_organization?.name,
    assignedProjectName: row.assigned_project?.title,
    createdAt: row.created_at,
  };
}
