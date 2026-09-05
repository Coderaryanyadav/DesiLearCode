import { describe, it, expect } from 'vitest';
import { ProjectStatus, DeviceStatus, UserRole } from '../lib/types';

describe('Lifecycle State Machine Transitions', () => {
  const allowedProjectTransitions: Record<ProjectStatus, ProjectStatus[]> = {
    draft: ['pending_approval'],
    pending_approval: ['active', 'draft'],
    active: ['almost_funded', 'completed', 'paused'],
    almost_funded: ['completed', 'paused'],
    completed: [],
    paused: ['active'],
  };

  function canTransitionProject(current: ProjectStatus, next: ProjectStatus): boolean {
    return allowedProjectTransitions[current]?.includes(next) ?? false;
  }

  it('permits draft to pending_approval submission', () => {
    expect(canTransitionProject('draft', 'pending_approval')).toBe(true);
  });

  it('permits pending_approval to active on administrative approval', () => {
    expect(canTransitionProject('pending_approval', 'active')).toBe(true);
  });

  it('blocks direct transition from draft to active without administrative review', () => {
    expect(canTransitionProject('draft', 'active')).toBe(false);
  });

  it('blocks transition out of completed status', () => {
    expect(canTransitionProject('completed', 'active')).toBe(false);
  });

  const allowedDeviceTransitions: Record<DeviceStatus, DeviceStatus[]> = {
    Submitted: ['Under Review', 'Retired'],
    'Under Review': ['Approved', 'Retired'],
    Approved: ['Pickup Scheduled', 'Retired'],
    'Pickup Scheduled': ['Received', 'Retired'],
    Received: ['Inspection', 'Repair', 'Ready', 'Retired'],
    Inspection: ['Repair', 'Ready', 'Retired'],
    Repair: ['Ready', 'Retired'],
    Ready: ['Assigned', 'Retired'],
    Assigned: ['Delivered', 'Retired'],
    Delivered: ['In Use', 'Retired'],
    'In Use': ['Retired'],
    Retired: [],
  };

  function canTransitionDevice(current: DeviceStatus, next: DeviceStatus): boolean {
    return allowedDeviceTransitions[current]?.includes(next) ?? false;
  }

  it('permits sequential device status pipeline: Submitted -> Under Review -> Approved -> Pickup Scheduled -> Received -> Ready -> In Use', () => {
    expect(canTransitionDevice('Submitted', 'Under Review')).toBe(true);
    expect(canTransitionDevice('Under Review', 'Approved')).toBe(true);
    expect(canTransitionDevice('Approved', 'Pickup Scheduled')).toBe(true);
    expect(canTransitionDevice('Pickup Scheduled', 'Received')).toBe(true);
    expect(canTransitionDevice('Received', 'Ready')).toBe(true);
    expect(canTransitionDevice('Ready', 'Assigned')).toBe(true);
    expect(canTransitionDevice('Assigned', 'Delivered')).toBe(true);
    expect(canTransitionDevice('Delivered', 'In Use')).toBe(true);
  });

  it('blocks invalid backward transitions', () => {
    expect(canTransitionDevice('In Use', 'Submitted')).toBe(false);
    expect(canTransitionDevice('Retired', 'Ready')).toBe(false);
  });

  // Zero-trust RBAC role check helper
  function canAdminister(role: UserRole): boolean {
    return role === 'admin';
  }

  function canManageNgo(role: UserRole): boolean {
    return role === 'ngo' || canAdminister(role);
  }

  it('correctly isolates admin permissions by role hierarchy', () => {
    expect(canAdminister('visitor')).toBe(false);
    expect(canAdminister('donor')).toBe(false);
    expect(canAdminister('volunteer')).toBe(false);
    expect(canAdminister('ngo')).toBe(false);
    expect(canAdminister('admin')).toBe(true);
  });

  it('correctly grants NGO management to NGO staff and admins only', () => {
    expect(canManageNgo('visitor')).toBe(false);
    expect(canManageNgo('donor')).toBe(false);
    expect(canManageNgo('volunteer')).toBe(false);
    expect(canManageNgo('ngo')).toBe(true);
    expect(canManageNgo('admin')).toBe(true);
  });
});
