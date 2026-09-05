import { describe, it, expect } from 'vitest';
import { generateDeviceTrackingCode, generateDonationReceiptNumber, generateSecureSlugSuffix } from '../lib/crypto-id';
import { checkRateLimit, resetRateLimit } from '../lib/rate-limit';
import { paymentService } from '../lib/payments';
import { getValidatedEnv, isSupabaseConfigured } from '../lib/env';

describe('Expanded Security & Integrity Test Suite', () => {
  describe('Cryptographic Identifiers & Entropy', () => {
    it('generates high-entropy device tracking codes with DLC-XXXX-XXXX format', () => {
      const code = generateDeviceTrackingCode();
      expect(code).toMatch(/^DLC-[A-F0-9]{4}-[A-F0-9]{4}$/);
    });

    it('guarantees zero collisions across batch identifier generation', () => {
      const set = new Set<string>();
      for (let i = 0; i < 500; i++) {
        const code = generateDeviceTrackingCode();
        expect(set.has(code)).toBe(false);
        set.add(code);
      }
    });

    it('generates collision-resistant donation receipt numbers with current date prefix', () => {
      const receipt = generateDonationReceiptNumber();
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      expect(receipt.startsWith(`DLC-REC-${today}-`)).toBe(true);
      expect(receipt).toMatch(/^DLC-REC-\d{8}-[A-F0-9]{6}$/);
    });

    it('generates secure hexadecimal slug suffixes', () => {
      const slugSuffix = generateSecureSlugSuffix();
      expect(slugSuffix).toMatch(/^[a-f0-9]{6}$/);
    });
  });

  describe('Rate Limiting & Abuse Prevention', () => {
    const testIdentifier = 'test-ip-192.168.1.100';

    it('allows requests within specified rate limit threshold', () => {
      resetRateLimit(testIdentifier);
      const res1 = checkRateLimit({ identifier: testIdentifier, limit: 3, windowMs: 5000 });
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(2);

      const res2 = checkRateLimit({ identifier: testIdentifier, limit: 3, windowMs: 5000 });
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(1);

      const res3 = checkRateLimit({ identifier: testIdentifier, limit: 3, windowMs: 5000 });
      expect(res3.allowed).toBe(true);
      expect(res3.remaining).toBe(0);
    });

    it('strictly blocks requests once threshold is exceeded', () => {
      const blocked = checkRateLimit({ identifier: testIdentifier, limit: 3, windowMs: 5000 });
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });
  });

  describe('Payment Gateway Abstraction & Financial Truthfulness', () => {
    it('returns NOT_CONFIGURED and rejects fake settlement when live gateway is unconfigured', async () => {
      const order = await paymentService.createPayment({
        amountInRupees: 5000,
        projectId: 'proj-123',
        donorEmail: 'donor@example.org',
      });

      expect(order.status).toBe('NOT_CONFIGURED');
      expect(order.provider).toBe('none');
      expect(order.message).toContain('awaiting statutory merchant approval');
    });

    it('refuses to verify fake payment signatures without merchant credentials', async () => {
      const verification = await paymentService.verifyPayment({
        orderId: 'fake-order',
        paymentId: 'fake-payment',
        signature: 'fake-signature',
      });

      expect(verification.verified).toBe(false);
      expect(verification.status).toBe('FAILED');
    });
  });

  describe('Strict Environment Validation', () => {
    it('successfully loads validated env under test harness', () => {
      const env = getValidatedEnv();
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
      expect(isSupabaseConfigured()).toBe(true);
    });
  });

  describe('Tenant Isolation Logic Simulation', () => {
    function canModifyProject(userRole: string, userOrgId: string | null, projectOrgId: string): boolean {
      if (userRole === 'admin') return true;
      if (userRole === 'ngo' && userOrgId && userOrgId === projectOrgId) return true;
      return false;
    }

    it('allows administrators to manage any project', () => {
      expect(canModifyProject('admin', null, 'org-any')).toBe(true);
    });

    it('allows NGO lead to modify projects belonging to their own organization', () => {
      expect(canModifyProject('ngo', 'org-123', 'org-123')).toBe(true);
    });

    it('strictly denies cross-tenant modification between different NGOs', () => {
      // NGO A attempting to modify NGO B's project
      expect(canModifyProject('ngo', 'org-A', 'org-B')).toBe(false);
    });

    it('denies unassigned donors, volunteers, or visitors from modifying projects', () => {
      expect(canModifyProject('donor', null, 'org-A')).toBe(false);
      expect(canModifyProject('volunteer', null, 'org-A')).toBe(false);
      expect(canModifyProject('visitor', null, 'org-A')).toBe(false);
    });
  });
});
