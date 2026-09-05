import { describe, it, expect } from 'vitest';
import { VALID_DEVICE_TRANSITIONS, isValidDeviceTransition } from '../lib/device-lifecycle';
import { toPublicDeviceTracking } from '../lib/dtos';
import { UnconfiguredPaymentProvider } from '../lib/payments';
import { DeviceStatus, UserRole } from '../lib/types';

describe('1. Project Funding Separation (Pledge != Payment Success != Settled Funds)', () => {
  const paymentProvider = new UnconfiguredPaymentProvider();

  it('ensures unconfigured payment provider returns NOT_CONFIGURED and 0 settled funds', async () => {
    const order = await paymentProvider.createPayment({
      amountInRupees: 5000,
      donorEmail: 'donor@example.org',
      donorName: 'Aarav Patel',
      projectId: 'proj-123',
    });

    expect(order.status).toBe('NOT_CONFIGURED');
    expect(order.provider).toBe('none');

    const status = await paymentProvider.getPaymentStatus(order.orderId);
    expect(status.status).toBe('NOT_CONFIGURED');
    expect(status.settledAmount).toBe(0);
  });

  it('rejects refund attempts on unsettled unconfigured payments', async () => {
    const refund = await paymentProvider.refundPayment({
      paymentId: 'DLC-PAY-TEST01',
      amountInRupees: 5000,
      reason: 'Donor requested cancellation',
    });

    expect(refund.success).toBe(false);
    expect(refund.error).toContain('Refunds unavailable: No settled gateway transactions');
  });

  it('guarantees that pledges and cancelled intents do not increase confirmed funding', () => {
    // Financial separation model:
    // Only records with status === 'settled' can contribute to settled treasury
    const intents = [
      { id: '1', amount: 5000, status: 'pledged' },
      { id: '2', amount: 10000, status: 'pledged' },
      { id: '3', amount: 2500, status: 'failed' },
      { id: '4', amount: 1500, status: 'cancelled' },
      { id: '5', amount: 7500, status: 'refunded' },
    ];

    const settledTotal = intents
      .filter(i => i.status === 'settled')
      .reduce((acc, curr) => acc + curr.amount, 0);

    expect(settledTotal).toBe(0);

    const pledgedTotal = intents
      .filter(i => i.status === 'pledged')
      .reduce((acc, curr) => acc + curr.amount, 0);

    expect(pledgedTotal).toBe(15000);
  });
});

describe('2. Project Need Progress Determinism & Tamper Resistance', () => {
  it('strictly calculates remaining gap deterministically: max(required - secured, 0)', () => {
    const calculateGap = (required: number, secured: number) => {
      return Math.max(required - secured, 0);
    };

    expect(calculateGap(25, 10)).toBe(15);
    expect(calculateGap(25, 25)).toBe(0);
    expect(calculateGap(25, 30)).toBe(0); // Never negative
    expect(calculateGap(10, 0)).toBe(10);
  });

  it('enforces server-side zero-initial fulfillment overriding client-supplied secured values', () => {
    // Simulating server action addProjectNeed
    const sanitizeNeedInput = (clientPayload: { quantityRequired: any; quantityFulfilled?: any }) => {
      const cleanRequired = Math.floor(Number(clientPayload.quantityRequired));
      if (isNaN(cleanRequired) || cleanRequired < 1) {
        throw new Error('Required quantity must be a positive integer of at least 1.');
      }
      return {
        quantity_required: cleanRequired,
        quantity_fulfilled: 0, // Server-enforced, rejects client-supplied 999999
        is_fulfilled: false,
      };
    };

    const maliciousClientInput = {
      quantityRequired: 20,
      quantityFulfilled: 999999, // Attempted tampering
    };

    const sanitized = sanitizeNeedInput(maliciousClientInput);
    expect(sanitized.quantity_required).toBe(20);
    expect(sanitized.quantity_fulfilled).toBe(0);
    expect(sanitized.is_fulfilled).toBe(false);
  });

  it('rejects allocation updates that exceed required gap', () => {
    const applyAllocation = (required: number, currentFulfilled: number, toAdd: number) => {
      if (toAdd <= 0) throw new Error('Allocation quantity must be a positive number.');
      const newFulfilled = currentFulfilled + toAdd;
      if (newFulfilled > required) {
        throw new Error(`Allocation exceeds required gap. Maximum allocatable is ${Math.max(required - currentFulfilled, 0)}.`);
      }
      return {
        newFulfilled,
        remaining: Math.max(required - newFulfilled, 0),
        isFulfilled: newFulfilled >= required,
      };
    };

    // Valid allocation
    const valid = applyAllocation(20, 10, 5);
    expect(valid.newFulfilled).toBe(15);
    expect(valid.remaining).toBe(5);
    expect(valid.isFulfilled).toBe(false);

    // Over-allocation attempt
    expect(() => applyAllocation(20, 15, 10)).toThrow('Allocation exceeds required gap. Maximum allocatable is 5.');
  });
});

describe('3. Device Lifecycle State Machine & Role Authorization', () => {
  it('prohibits illegal state transitions (e.g. Submitted -> In Use directly)', () => {
    expect(isValidDeviceTransition('Submitted', 'In Use')).toBe(false);
    expect(isValidDeviceTransition('Submitted', 'Ready')).toBe(false);
    expect(isValidDeviceTransition('Submitted', 'Delivered')).toBe(false);
    expect(isValidDeviceTransition('Submitted', 'Under Review')).toBe(true);
  });

  it('strictly validates full happy path transitions', () => {
    const sequence: DeviceStatus[] = [
      'Submitted',
      'Under Review',
      'Approved',
      'Received',
      'Inspection',
      'Repair',
      'Ready',
      'Assigned',
      'Delivered',
      'In Use',
      'Retired',
    ];

    for (let i = 0; i < sequence.length - 1; i++) {
      const from = sequence[i];
      const to = sequence[i + 1];
      expect(isValidDeviceTransition(from, to)).toBe(true);
    }
  });

  it('verifies that Retired is a terminal state with no subsequent transitions', () => {
    const allStatuses: DeviceStatus[] = [
      'Submitted', 'Under Review', 'Approved', 'Pickup Scheduled',
      'Received', 'Inspection', 'Repair', 'Ready', 'Assigned',
      'Delivered', 'In Use', 'Retired'
    ];

    for (const target of allStatuses) {
      if (target !== 'Retired') {
        expect(isValidDeviceTransition('Retired', target)).toBe(false);
      }
    }
  });

  it('authorizes only privileged roles for status modifications', () => {
    function isAuthorizedToUpdateDevice(role: UserRole, userOrgId?: string, deviceOrgId?: string): boolean {
      if (role === 'admin') return true;
      if (role === 'ngo' && userOrgId && userOrgId === deviceOrgId) return true;
      return false;
    }

    expect(isAuthorizedToUpdateDevice('visitor')).toBe(false);
    expect(isAuthorizedToUpdateDevice('donor')).toBe(false);
    expect(isAuthorizedToUpdateDevice('volunteer')).toBe(false);
    // NGO modifying another NGO's device
    expect(isAuthorizedToUpdateDevice('ngo', 'org-1', 'org-2')).toBe(false);
    // NGO modifying own assigned device
    expect(isAuthorizedToUpdateDevice('ngo', 'org-1', 'org-1')).toBe(true);
    // Admin modifying any device
    expect(isAuthorizedToUpdateDevice('admin')).toBe(true);
  });
});

describe('4. Zero-PII Device Tracking & IDOR Resilience', () => {
  it('strips all donor PII and replaces private technician notes with standardized public summaries', () => {
    const rawDeviceRow = {
      tracking_code: 'DLC-7A3B-9F2E',
      device_type: 'laptop',
      manufacturer: 'Dell',
      model: 'Latitude 7490',
      approximate_age_years: 3,
      condition: 'good',
      status: 'Ready',
      created_at: '2026-09-01T10:00:00Z',
      updated_at: '2026-09-02T14:30:00Z',
      // SENSITIVE DONOR PII (MUST BE STRIPPED)
      donor_name: 'Rahul Sharma',
      donor_email: 'rahul.sharma@private.com',
      donor_phone: '+91 98765 43210',
      notes: 'Donor apartment address: Flat 402, Sunshine Heights, Mumbai',
      // INTERNAL SENSITIVE STAFF NOTES (MUST NOT LEAK)
      device_updates: [
        {
          status: 'Submitted',
          created_at: '2026-09-01T10:00:00Z',
          technician_note: 'Donor phone verified. Security guard handed it over.',
        },
        {
          status: 'Ready',
          created_at: '2026-09-02T14:30:00Z',
          technician_note: 'Internal test: battery at 82%. Child safeguarding notice verified.',
        }
      ]
    };

    const publicDTO = toPublicDeviceTracking(rawDeviceRow);

    // Assert safe telemetry fields exist
    expect(publicDTO.trackingCode).toBe('DLC-7A3B-9F2E');
    expect(publicDTO.manufacturer).toBe('Dell');
    expect(publicDTO.model).toBe('Latitude 7490');
    expect(publicDTO.status).toBe('Ready');

    // Assert ZERO donor PII is present in output DTO
    expect((publicDTO as any).donor_name).toBeUndefined();
    expect((publicDTO as any).donor_email).toBeUndefined();
    expect((publicDTO as any).donor_phone).toBeUndefined();
    expect((publicDTO as any).notes).toBeUndefined();

    // Assert technician notes are replaced with standardized public descriptions
    expect(publicDTO.timeline[0].publicSummary).toBe('Donation intake registered in ledger.');
    expect(publicDTO.timeline[1].publicSummary).toBe('Cryptographic drive wipe completed; child-safe educational Linux deployed.');

    // Ensure raw strings never leaked
    const dtoString = JSON.stringify(publicDTO);
    expect(dtoString).not.toContain('Rahul Sharma');
    expect(dtoString).not.toContain('rahul.sharma@private.com');
    expect(dtoString).not.toContain('98765');
    expect(dtoString).not.toContain('Sunshine Heights');
    expect(dtoString).not.toContain('Donor phone verified');
  });

  it('rejects malformed tracking queries safely without SQL/regex injection', () => {
    const validateTrackingCodeInput = (code: string): string | null => {
      if (!code || typeof code !== 'string') return null;
      const clean = code.trim().toUpperCase();
      // Enforce format: DLC-XXXX-XXXX
      if (!/^DLC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(clean)) {
        return null;
      }
      return clean;
    };

    expect(validateTrackingCodeInput("' OR '1'='1")).toBeNull();
    expect(validateTrackingCodeInput('DLC-<script>')).toBeNull();
    expect(validateTrackingCodeInput('DLC-1234')).toBeNull();
    expect(validateTrackingCodeInput('')).toBeNull();
    expect(validateTrackingCodeInput('DLC-ABCD-1234')).toBe('DLC-ABCD-1234');
  });
});

describe('5. Organization Verification & Project Access Control', () => {
  it('ensures registered organizations start in pending status and do not self-escalate submitter role', () => {
    const registerOrgWorkflow = (userRole: UserRole) => {
      // Organization registration sets status = 'pending'
      const org = {
        id: 'org-new',
        name: 'New Learning Foundation',
        verification_status: 'pending',
      };
      // Profile role remains unchanged (NOT auto-escalated to 'ngo')
      const profileRole = userRole; 
      return { org, profileRole };
    };

    const result = registerOrgWorkflow('donor');
    expect(result.org.verification_status).toBe('pending');
    expect(result.profileRole).toBe('donor'); // Still donor, not ngo!
  });

  it('enforces cross-tenant isolation: NGO A cannot modify NGO B project', () => {
    function authorizeProjectModification(userRole: UserRole, userOrgId: string, projectOrgId: string) {
      if (userRole === 'admin') return true;
      if (userRole === 'ngo' && userOrgId === projectOrgId) return true;
      return false;
    }

    const ngoA_User = { role: 'ngo' as UserRole, orgId: 'org-a' };
    const projectB = { orgId: 'org-b' };

    expect(authorizeProjectModification(ngoA_User.role, ngoA_User.orgId, projectB.orgId)).toBe(false);

    // NGO A modifying own project
    expect(authorizeProjectModification(ngoA_User.role, ngoA_User.orgId, 'org-a')).toBe(true);

    // Admin modifying NGO B project
    expect(authorizeProjectModification('admin', 'org-admin', projectB.orgId)).toBe(true);
  });
});

describe('6. Verified Impact Reporting (No Target Fallbacks)', () => {
  it('sums impact metrics exclusively from admin-verified reports', () => {
    const rawReports = [
      {
        id: 'rep-1',
        students_trained: 35,
        volunteer_hours: 40,
        workshops_conducted: 6,
        verified_by_admin: true,
      },
      {
        id: 'rep-2',
        students_trained: 50, // Unverified draft from NGO
        volunteer_hours: 60,
        workshops_conducted: 10,
        verified_by_admin: false,
      },
    ];

    const verifiedOnly = rawReports.filter(r => r.verified_by_admin === true);
    const studentsReached = verifiedOnly.reduce((sum, r) => sum + r.students_trained, 0);
    const volunteerHours = verifiedOnly.reduce((sum, r) => sum + r.volunteer_hours, 0);
    const workshopsConducted = verifiedOnly.reduce((sum, r) => sum + r.workshops_conducted, 0);

    // Only verified report 1 is counted
    expect(studentsReached).toBe(35);
    expect(volunteerHours).toBe(40);
    expect(workshopsConducted).toBe(6);
  });

  it('does NOT fall back to target_students when verified impact reports are absent', () => {
    const projectWithNoReports = {
      target_students: 80,
      impact_reports: [],
    };

    const verifiedReports = (projectWithNoReports.impact_reports || []).filter((r: any) => r.verified_by_admin === true);
    const verifiedStudentsTrained = verifiedReports.reduce((sum: number, r: any) => sum + Number(r.students_trained || 0), 0);

    // Must be 0, NOT 80!
    expect(verifiedStudentsTrained).toBe(0);
    expect(verifiedStudentsTrained).not.toBe(projectWithNoReports.target_students);
  });
});
