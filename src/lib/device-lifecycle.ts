import { DeviceStatus } from './types';

/**
 * Valid state transition matrix for donated hardware.
 * Any attempt to make an illegal jump (e.g. from 'Submitted' directly to 'In Use')
 * will be strictly rejected server-side.
 */
export const VALID_DEVICE_TRANSITIONS: Record<DeviceStatus, DeviceStatus[]> = {
  Submitted: ['Under Review', 'Retired'],
  'Under Review': ['Approved', 'Retired', 'Submitted'],
  Approved: ['Pickup Scheduled', 'Received', 'Retired'],
  'Pickup Scheduled': ['Received', 'Under Review', 'Retired'],
  Received: ['Inspection', 'Repair', 'Retired'],
  Inspection: ['Repair', 'Ready', 'Retired'],
  Repair: ['Inspection', 'Ready', 'Retired'],
  Ready: ['Assigned', 'Retired'],
  Assigned: ['Delivered', 'Ready', 'Retired'],
  Delivered: ['In Use', 'Retired'],
  'In Use': ['Retired'],
  Retired: [], // Terminal state
};

export function isValidDeviceTransition(
  currentStatus: DeviceStatus,
  targetStatus: DeviceStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_DEVICE_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(targetStatus));
}

export function getPermittedNextStatuses(currentStatus: DeviceStatus): DeviceStatus[] {
  return VALID_DEVICE_TRANSITIONS[currentStatus] || [];
}
