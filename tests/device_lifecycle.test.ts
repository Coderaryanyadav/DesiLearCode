import { describe, it, expect } from 'vitest';
import { isValidDeviceTransition, getPermittedNextStatuses } from '../lib/device-lifecycle';
import { DeviceStatus } from '../lib/types';

describe('Device Lifecycle State Machine', () => {
  it('allows valid sequential forward progression', () => {
    expect(isValidDeviceTransition('Submitted', 'Under Review')).toBe(true);
    expect(isValidDeviceTransition('Under Review', 'Approved')).toBe(true);
    expect(isValidDeviceTransition('Approved', 'Pickup Scheduled')).toBe(true);
    expect(isValidDeviceTransition('Approved', 'Received')).toBe(true);
    expect(isValidDeviceTransition('Received', 'Inspection')).toBe(true);
    expect(isValidDeviceTransition('Inspection', 'Ready')).toBe(true);
    expect(isValidDeviceTransition('Inspection', 'Repair')).toBe(true);
    expect(isValidDeviceTransition('Ready', 'Assigned')).toBe(true);
    expect(isValidDeviceTransition('Assigned', 'Delivered')).toBe(true);
    expect(isValidDeviceTransition('Delivered', 'In Use')).toBe(true);
  });

  it('rejects dangerous or illegal status leaps', () => {
    // Cannot skip intake review and jump directly to In Use or Delivered
    expect(isValidDeviceTransition('Submitted', 'In Use')).toBe(false);
    expect(isValidDeviceTransition('Submitted', 'Delivered')).toBe(false);
    expect(isValidDeviceTransition('Submitted', 'Ready')).toBe(false);

    // Cannot jump from Inspection to Delivered without Ready & Assigned
    expect(isValidDeviceTransition('Inspection', 'Delivered')).toBe(false);

    // Cannot jump from Repair directly to Delivered
    expect(isValidDeviceTransition('Repair', 'Delivered')).toBe(false);
  });

  it('allows decommission / retirement from active states', () => {
    expect(isValidDeviceTransition('Submitted', 'Retired')).toBe(true);
    expect(isValidDeviceTransition('Inspection', 'Retired')).toBe(true);
    expect(isValidDeviceTransition('In Use', 'Retired')).toBe(true);
  });

  it('treats Retired as a strict terminal state', () => {
    const permittedAfterRetired = getPermittedNextStatuses('Retired');
    expect(permittedAfterRetired).toEqual([]);

    expect(isValidDeviceTransition('Retired', 'Submitted')).toBe(false);
    expect(isValidDeviceTransition('Retired', 'In Use')).toBe(false);
    expect(isValidDeviceTransition('Retired', 'Ready')).toBe(false);
  });

  it('allows idempotent transitions to the current state', () => {
    expect(isValidDeviceTransition('Ready', 'Ready')).toBe(true);
    expect(isValidDeviceTransition('Inspection', 'Inspection')).toBe(true);
  });
});
