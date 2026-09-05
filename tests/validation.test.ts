import { describe, it, expect } from 'vitest';
import { 
  DeviceDonationSchema, 
  VolunteerApplicationSchema, 
  DonationIntentSchema, 
  ProjectCreationSchema 
} from '../lib/validations';

describe('Validation Schemas & Safeguarding Guards', () => {
  it('validates a correct device donation assessment payload', () => {
    const validData = {
      donorName: 'Ananya Sharma',
      donorEmail: 'ananya@example.org',
      donorPhone: '+91 98765 43210',
      deviceType: 'Laptop' as const,
      manufacturer: 'Dell',
      model: 'Latitude 5490',
      approximateAgeYears: 4,
      condition: 'good' as const,
      powersOn: true,
      batteryCondition: 'good' as const,
      hasCharger: true,
      storage: '256GB SSD',
      ram: '8GB DDR4',
      os: 'Ubuntu Linux',
      pickupPreference: 'courier_pickup' as const,
      notes: 'Clean condition, working webcam',
    };

    const result = DeviceDonationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects device donation with invalid email', () => {
    const invalidData = {
      donorName: 'A',
      donorEmail: 'not-an-email',
      deviceType: 'Laptop' as const,
      manufacturer: 'Dell',
      model: 'Latitude',
      approximateAgeYears: 4,
      condition: 'good' as const,
      powersOn: true,
      batteryCondition: 'good' as const,
      hasCharger: true,
      storage: '256GB',
      ram: '8GB',
      os: 'Ubuntu',
      pickupPreference: 'dropoff' as const,
    };

    const result = DeviceDonationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('requires mandatory child safeguarding consent for volunteer onboarding', () => {
    const applicantWithoutConsent = {
      name: 'Rohan Mehra',
      email: 'rohan@example.com',
      phone: '+91 98111 22334',
      skills: ['Python', 'Scratch'],
      experienceYears: 4,
      availabilityHoursPerWeek: 3,
      preferredMode: 'both' as const,
      preferredSubjects: ['Coding'],
      preferredAgeGroup: '11–16 years',
      location: 'Delhi NCR',
      languages: ['English', 'Hindi'],
      bio: 'Experienced developer eager to mentor kids.',
      safeguardingConsent: false, // Must be true!
    };

    const result = VolunteerApplicationSchema.safeParse(applicantWithoutConsent);
    expect(result.success).toBe(false);
  });

  it('validates project support donation intent with minimum threshold', () => {
    const validIntent = {
      donorName: 'Ananya Sharma',
      donorEmail: 'ananya@example.com',
      isAnonymous: false,
      amount: 1500,
      projectId: 'proj_lab_delhi',
      allocatedNeedType: 'laptop',
      message: 'Support for hardware refurbishment',
    };

    const result = DonationIntentSchema.safeParse(validIntent);
    expect(result.success).toBe(true);
  });

  it('rejects negative or zero donation amount', () => {
    const invalidIntent = {
      donorName: 'Ananya Sharma',
      donorEmail: 'ananya@example.com',
      isAnonymous: false,
      amount: -50,
      projectId: 'proj_lab_delhi',
    };

    const result = DonationIntentSchema.safeParse(invalidIntent);
    expect(result.success).toBe(false);
  });
});
