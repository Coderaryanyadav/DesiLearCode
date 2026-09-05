import { describe, it, expect } from 'vitest';
import { toPublicDeviceTracking, toPublicProject } from '../lib/dtos';

describe('Public Data Transfer Objects (Zero-PII & Field Minimization)', () => {
  it('strips all donor PII and raw internal notes from public device tracking', () => {
    const rawDatabaseRow = {
      id: 'internal-uuid-device-99',
      tracking_code: 'DLC-7F3A-8C21',
      donor_id: 'internal-user-id-555',
      donor_name: 'Ananya Sharma',
      donor_email: 'ananya.sharma@private-corporate.com',
      donor_phone: '+91 98765 43210',
      device_type: 'Laptop',
      manufacturer: 'Lenovo',
      model: 'ThinkPad T480',
      approximate_age_years: 4,
      condition: 'good',
      storage: '256GB SSD',
      ram: '16GB',
      os: 'Ubuntu 24.04 LTS',
      pickup_preference: 'courier',
      notes: 'Private home pickup address: Flat 402, Green Glen Layout, Bellandur, Bangalore. Gate code 9921.',
      status: 'Ready',
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-08-05T14:30:00Z',
      assigned_organization: {
        name: 'Navodaya Vidya Kendra',
      },
      assigned_project: {
        title: 'Pune Coding Lab & Python Mentorship Program',
      },
      device_updates: [
        {
          status: 'Submitted',
          technician_note: 'Donor address confirmed with courier partner DHL-9281.',
          created_at: '2026-08-01T10:00:00Z',
        },
        {
          status: 'Ready',
          technician_note: 'Storage drive wiped via DoD 3-pass / NIST purge. Replaced thermal paste. Linux deployed.',
          created_at: '2026-08-05T14:30:00Z',
        },
      ],
    };

    const publicDto = toPublicDeviceTracking(rawDatabaseRow);

    // Assert public DTO contains safe fields
    expect(publicDto.trackingCode).toBe('DLC-7F3A-8C21');
    expect(publicDto.deviceType).toBe('Laptop');
    expect(publicDto.manufacturer).toBe('Lenovo');
    expect(publicDto.model).toBe('ThinkPad T480');
    expect(publicDto.status).toBe('Ready');
    expect(publicDto.assignedOrgName).toBe('Navodaya Vidya Kendra');
    expect(publicDto.assignedProjectName).toBe('Pune Coding Lab & Python Mentorship Program');

    // STRICT ZERO-PII CHECKS: Ensure donor private details are NOT present anywhere in the DTO
    const serialized = JSON.stringify(publicDto);
    expect(serialized).not.toContain('Ananya Sharma');
    expect(serialized).not.toContain('ananya.sharma@private-corporate.com');
    expect(serialized).not.toContain('98765');
    expect(serialized).not.toContain('Bellandur');
    expect(serialized).not.toContain('Flat 402');
    expect(serialized).not.toContain('DHL-9281');

    // Verify timeline generated safe summaries rather than raw technician private notes
    expect(publicDto.timeline).toHaveLength(2);
    expect(publicDto.timeline[0].publicSummary).toBe('Donation intake registered in ledger.');
    expect(publicDto.timeline[1].publicSummary).toBe('Cryptographic drive wipe completed; child-safe educational Linux deployed.');
  });

  it('sanitizes public project data into minimal DTO without leaking internal data', () => {
    const rawProjectRow = {
      id: 'proj-404',
      slug: 'delhi-stem-lab',
      title: 'Delhi STEM Center',
      tagline: 'Coding equipment for underprivileged youth',
      description: 'Educational program setup',
      why_it_matters: 'Closing digital gaps',
      what_support_provides: 'Laptops and mentorship',
      organization_id: 'org-100',
      organizations: {
        id: 'org-100',
        name: 'Pratham STEM Trust',
        verification_status: 'verified',
      },
      category: 'STEM',
      region: 'Delhi NCR',
      beneficiary_group: 'Middle school students',
      target_students: 40,
      status: 'active',
      urgency: 'normal',
      goal_value: 150000,
      current_value: 0,
      progress_percentage: 0,
      is_fictional_demo: false,
      created_at: '2026-08-10T12:00:00Z',
      updated_at: '2026-08-15T12:00:00Z',
      project_needs: [
        {
          id: 'need-1',
          project_id: 'proj-404',
          title: 'Refurbished Laptops',
          need_type: 'laptop',
          category: 'Hardware',
          quantity_required: 15,
          quantity_fulfilled: 5,
          unit: 'units',
          priority: 'high',
          purpose: 'Lab terminals',
          is_fulfilled: false,
        },
      ],
      project_milestones: [
        {
          id: 'ms-1',
          project_id: 'proj-404',
          title: 'Wiring & Desk Setup',
          description: 'Power surge strip installation',
          target_date: '2026-09-01',
          is_completed: true,
          completed_at: '2026-08-20T10:00:00Z',
        },
      ],
      project_updates: [
        {
          id: 'up-1',
          project_id: 'proj-404',
          title: 'Desks Installed',
          content: 'Classroom desks and surge protectors are in place.',
          created_at: '2026-08-20T11:00:00Z',
        },
      ],
    };

    const publicProject = toPublicProject(rawProjectRow);

    expect(publicProject.id).toBe('proj-404');
    expect(publicProject.title).toBe('Delhi STEM Center');
    expect(publicProject.organizationName).toBe('Pratham STEM Trust');
    expect(publicProject.organizationVerified).toBe(true);
    expect(publicProject.needs).toHaveLength(1);
    expect(publicProject.needs[0].title).toBe('Refurbished Laptops');
    expect(publicProject.milestones).toHaveLength(1);
    expect(publicProject.milestones[0].completed).toBe(true);
    expect(publicProject.updates).toHaveLength(1);

    // Ensure fictional demo flag or private administrative fields are not present
    expect((publicProject as any).is_fictional_demo).toBeUndefined();
  });
});
