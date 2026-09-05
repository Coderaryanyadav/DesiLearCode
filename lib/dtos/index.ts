import { DeviceStatus, DeviceType, ProjectCategory, ProjectStatus, NeedPriority, NeedType } from '../types';

/**
 * Public Device Tracking DTO
 * STRICT PRIVACY GUARANTEE:
 * - NO donor name, email, phone, or address
 * - NO donor private notes
 * - NO technician private notes
 * Exposes ONLY non-identifiable telemetry for public verification.
 */
export interface PublicDeviceTrackingEvent {
  status: DeviceStatus;
  timestamp: string;
  publicSummary: string;
}

export interface PublicDeviceTracking {
  trackingCode: string;
  deviceType: DeviceType;
  manufacturer: string;
  model: string;
  approximateAgeYears: number;
  condition: string;
  status: DeviceStatus;
  assignedOrgName?: string;
  assignedProjectName?: string;
  timeline: PublicDeviceTrackingEvent[];
  lastUpdated: string;
}

export function toPublicDeviceTracking(row: any): PublicDeviceTracking {
  const rawUpdates = row.device_updates || [];
  
  const timeline: PublicDeviceTrackingEvent[] = rawUpdates.map((u: any) => ({
    status: u.status,
    timestamp: u.created_at,
    publicSummary: sanitizeTechnicianNoteForPublic(u.status, u.technician_note),
  }));

  if (timeline.length === 0) {
    timeline.push({
      status: row.status,
      timestamp: row.created_at,
      publicSummary: 'Hardware donation assessment received and queued for intake.',
    });
  }

  return {
    trackingCode: row.tracking_code,
    deviceType: row.device_type,
    manufacturer: row.manufacturer,
    model: row.model,
    approximateAgeYears: row.approximate_age_years || 0,
    condition: row.condition,
    status: row.status,
    assignedOrgName: row.assigned_organization?.name || undefined,
    assignedProjectName: row.assigned_project?.title || undefined,
    timeline,
    lastUpdated: row.updated_at || row.created_at,
  };
}

function sanitizeTechnicianNoteForPublic(status: DeviceStatus, note?: string): string {
  // Return safe sanitized public status descriptions
  switch (status) {
    case 'Submitted':
      return 'Donation intake registered in ledger.';
    case 'Under Review':
      return 'Technical specifications being evaluated for curriculum compatibility.';
    case 'Approved':
      return 'Intake approved. Logistics handover scheduled.';
    case 'Pickup Scheduled':
      return 'Logistics courier dispatched for secure custody handover.';
    case 'Received':
      return 'Hardware received at central refurbishment lab.';
    case 'Inspection':
      return 'Hardware bench testing, battery diagnostic, and component check in progress.';
    case 'Repair':
      return 'Hardware maintenance: thermal optimization and storage upgrade.';
    case 'Ready':
      return 'Cryptographic drive wipe completed; child-safe educational Linux deployed.';
    case 'Assigned':
      return 'Hardware allocated to verified learning center partner.';
    case 'Delivered':
      return 'Hardware delivered and installed in classroom computer lab.';
    case 'In Use':
      return 'Active in student coding lab under mentor supervision.';
    case 'Retired':
      return 'Hardware decommissioned responsibly at end-of-life.';
    default:
      return 'Lifecycle update recorded.';
  }
}

/**
 * Public Project DTO
 * Strips internal administrative flags, donor details, or sensitive metadata.
 */
export interface PublicNeedItemDTO {
  id: string;
  title: string;
  type: NeedType;
  category: string;
  quantityRequired: number;
  quantityFulfilled: number;
  unit: string;
  priority: NeedPriority;
  purpose: string;
  fulfilled: boolean;
}

export interface PublicProjectDTO {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  whatSupportProvides: string;
  organizationId: string;
  organizationName: string;
  organizationVerified: boolean;
  category: ProjectCategory;
  region: string;
  beneficiaryGroup: string;
  targetStudents: number;
  status: ProjectStatus;
  urgency: string;
  heroImageUrl: string;
  goalValue: number;
  currentValue: number;
  progressPercentage: number;
  needs: PublicNeedItemDTO[];
  milestones: {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    completed: boolean;
    completedAt?: string;
  }[];
  updates: {
    id: string;
    title: string;
    content: string;
    postedAt: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}

export function toPublicProject(row: any): PublicProjectDTO {
  const needs: PublicNeedItemDTO[] = (row.project_needs || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    type: n.need_type,
    category: n.category,
    quantityRequired: Number(n.quantity_required),
    quantityFulfilled: Number(n.quantity_fulfilled || 0),
    unit: n.unit,
    priority: n.priority,
    purpose: n.purpose,
    fulfilled: Boolean(n.is_fulfilled),
  }));

  const milestones = (row.project_milestones || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    targetDate: m.target_date,
    completed: Boolean(m.is_completed),
    completedAt: m.completed_at,
  }));

  const updates = (row.project_updates || []).map((u: any) => ({
    id: u.id,
    title: u.title,
    content: u.content,
    postedAt: u.created_at,
  }));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline || '',
    description: row.description,
    whyItMatters: row.why_it_matters || '',
    whatSupportProvides: row.what_support_provides || '',
    organizationId: row.organization_id,
    organizationName: row.organizations?.name || 'Verified Partner',
    organizationVerified: row.organizations?.verification_status === 'verified',
    category: row.category,
    region: row.region || 'General Region',
    beneficiaryGroup: row.beneficiary_group || 'Aggregated Cohort',
    targetStudents: Number(row.target_students || 0),
    status: row.status,
    urgency: row.urgency || 'normal',
    heroImageUrl: row.hero_image_url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    goalValue: Number(row.goal_value || 0),
    currentValue: Number(row.current_value || 0),
    progressPercentage: Number(row.progress_percentage || 0),
    needs,
    milestones,
    updates,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
