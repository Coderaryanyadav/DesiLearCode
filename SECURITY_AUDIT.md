# DesiLearCode — 2026 Production Security Forensic Audit & Hardening Report

**Audit Date**: September 2026\
**Scope**: Full Stack (Next.js 15.5.25 App Router, TypeScript 5.9, Supabase
PostgreSQL RLS, Server Actions, Cryptographic Primitives, Rate Limiting, HTTP
Security Headers, Zero-PII Public DTOs)\
**Verification Suite**: 38 automated test cases (`tests/*.test.ts`),
`npx tsc --noEmit` (0 errors), `next lint` (0 errors), `next build` (39 routes
compiled).

---

## 1. Executive Security Summary

This forensic audit report details the vulnerabilities discovered in the
repository, the exact risk vectors, the code modifications deployed to eliminate
them, and verifiable test evidence.

| Audit Domain                         | Prior State                                                  | Hardened Production State                                                                                   | Gate Status |
| :----------------------------------- | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :---------: |
| **Credential Storage**               | `.env.local.backup` tracked with live Supabase service keys  | Untracked, deleted from Git, `.gitignore` updated with backup masks, secret rotation flagged                |  **PASS**   |
| **Environment Fallbacks**            | Silent fallbacks to `placeholder-project.supabase.co`        | Strict Zod validation layer in `lib/env.ts`; fails fast without valid keys                                  |  **PASS**   |
| **Tenant Isolation**                 | NGOs could mutate other organizations' projects/needs        | Ownership checks in `app/actions/projects.ts` & `organizations.ts` matching session `organization_id`       |  **PASS**   |
| **Anonymous Device Ingestion**       | Public `INSERT` with `WITH CHECK (TRUE)` on all columns      | Server action sanitization & database RLS restricting anonymous inserts to intake columns only              |  **PASS**   |
| **Device Lifecycle & State Machine** | Arbitrary status switching without validation                | Strict state machine in `lib/device-lifecycle.ts` enforcing valid transitions; invalid transitions rejected |  **PASS**   |
| **Public Telemetry & PII**           | Potential leakage of donor contact info & technician notes   | `PublicDeviceTracking` DTO in `lib/dtos/index.ts` stripping all donor PII and technician internal notes     |  **PASS**   |
| **Donation Accounting**              | Donation pledge immediately added to project confirmed funds | Pledges decoupled (`projects.current_value` NOT incremented); explicit `pledged` status                     |  **PASS**   |
| **Payment Gateway Architecture**     | Client simulated payment success                             | Pluggable payment provider abstraction in `lib/payments/` returning `NOT_CONFIGURED` until live             |  **PASS**   |
| **Cryptographic Identifiers**        | Insecure `Math.random()` for tracking and receipts           | Cryptographically secure CSPRNG (`crypto.randomBytes`) in `lib/crypto-id.ts`                                |  **PASS**   |
| **Denial of Service / Abuse**        | No rate limiting on public form mutations                    | In-memory sliding-window token bucket rate limiter in `lib/rate-limit.ts`                                   |  **PASS**   |
| **HTTP Security Headers**            | Default Next.js headers                                      | Strict CSP, HSTS (`63072000`), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`)                 |  **PASS**   |
| **Audit Log Immutability**           | `audit_logs` had no table-level UPDATE/DELETE prevention     | Migration `20260101000000_production_hardening.sql` revoking UPDATE/DELETE from public/authenticated        |  **PASS**   |

---

## 2. Detailed Findings & Forensic Remediations

### Finding ID: SEC-ENV-01 — Exposure of Tracked Supabase Credentials in Backup File

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: Repository root contained tracked file `.env.local.backup`
  containing live `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  and `SUPABASE_SERVICE_ROLE_KEY`.
- **RISK**: Any entity with read access to the git repository or ZIP archive
  gains full administrative access to Supabase database, bypassing all Row Level
  Security policies via the service-role key.
- **FIX**:
  1. Untracked file via `git rm --cached .env.local.backup` and permanently
     deleted the file.
  2. Added `.env*.backup` and `*.backup` to `.gitignore`.
  3. Cleaned `.env.example` of any proprietary legacy tokens.
  4. **CRITICAL OPERATIONAL NOTICE**: The previously exposed service-role key
     must be rotated in the Supabase Dashboard
     (`Project Settings -> API -> Regenerate Secret`).
- **VERIFICATION**: `git status` verifies `.env.local.backup` is deleted and
  untracked.

---

### Finding ID: SEC-ENV-02 — Insecure Fallback to Placeholder Supabase Infrastructure

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: `lib/supabase/client.ts`, `lib/supabase/server.ts`, and
  `middleware.ts` previously had defaults:
  ```ts
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://placeholder-project.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";
  ```
- **RISK**: Applications in staging or production run with silent network
  errors, misleading authentication failures, or could transmit authorization
  headers to unowned dummy endpoints.
- **FIX**: Created `lib/env.ts` with strict Zod validation:
  ```ts
  // Rejects placeholder-project and placeholder-anon-key in non-test environments
  export function validateEnv() { ... }
  ```
  `lib/supabase/client.ts` and `lib/supabase/server.ts` now invoke
  `getValidatedEnv()` and fail immediately with actionable diagnostic errors if
  keys are absent or invalid.
- **VERIFICATION**: Tested in `tests/security_expanded.test.ts` verifying
  rejection of fake domains and missing variables.

---

### Finding ID: SEC-FIN-01 — Premature Funding Recognition on Donation Pledges

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: `app/actions/donations.ts` previously executed:
  ```ts
  await supabaseAdmin.from("projects").update({
    current_value: project.current_value + amount,
  });
  ```
  immediately upon receiving an unverified pledge form submission.
- **RISK**: Malicious or speculative pledges artificially inflate confirmed
  project budgets and public financial indicators without real capital,
  distorting nonprofit transparency and violating accounting standards.
- **FIX**:
  1. Decoupled pledges from `projects.current_value`. A pledge is recorded as
     `pledged` in `donation_intents` and does NOT increment `current_value`.
  2. Updated `components/DonationModal.tsx` to explicitly indicate status
     `PLEDGED (UNSETTLED INTENT)`.
  3. Created `lib/payments/` abstraction where `createPayment()` returns
     `NOT_CONFIGURED` until a real payment gateway (Razorpay/Stripe) is
     connected with verified HMAC webhooks.
- **VERIFICATION**: `tests/lifecycle.test.ts` and
  `tests/security_expanded.test.ts` verify pledge amounts do not modify
  `projects.current_value`.

---

### Finding ID: SEC-ID-01 — Weak Entropy in Tracking and Transaction Identifiers

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: Device tracking codes and receipt numbers were generated via:
  ```ts
  const trackingCode = `TFK-${
    Math.random().toString(36).substring(2, 8).toUpperCase()
  }`;
  ```
- **RISK**: Predictable identifiers generated by `Math.random()` allow attackers
  to enumerate tracking codes and scrape device statuses, or guess receipt IDs
  to forge support correspondence.
- **FIX**: Implemented `lib/crypto-id.ts` using Node.js `crypto.randomBytes`:
  - `generateTrackingCode()`: Produces high-entropy `DLC-XXXX-XXXX` using 6
    cryptographic random bytes formatted into 8 alphanumeric characters.
  - `generateReceiptNumber()`: Produces collision-resistant
    `DLC-REC-YYYYMMDD-XXXX`.
  - `generateSecureSlug()`: Uses CSPRNG hex suffixes.
- **VERIFICATION**: `tests/security_expanded.test.ts` runs entropy and format
  verification across 100 iterations ensuring no collisions and proper `DLC-`
  branding.

---

### Finding ID: SEC-DTO-01 — Donor PII Exposure in Device Telemetry

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: `app/actions/devices.ts` `trackDeviceCode()` previously returned
  database rows including raw technician notes and potential donor associations.
- **RISK**: Public users tracking an asset could inspect private technician
  diagnostic notes, donor names, or intake locations in network payload
  responses.
- **FIX**: Created `lib/dtos/index.ts` with `PublicDeviceTracking` and
  `toPublicDeviceTracking()`. Strips donor names, phone numbers, emails,
  addresses, and internal technician logs, converting technician notes into
  sanitized public event summaries.
- **VERIFICATION**: `tests/dtos.test.ts` verified that donor name, email, phone,
  and private technician comments are completely absent from the returned DTO.

---

### Finding ID: SEC-AUTH-01 — Role Escalation on Organization Application

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: `app/actions/organizations.ts` previously updated the submitting
  user's profile:
  ```ts
  await supabaseAdmin.from("profiles").update({
    organization_id: org.id,
    role: "ngo",
  }).eq("id", user.id);
  ```
  immediately upon submission.
- **RISK**: Any authenticated user submitting an unvetted organization form
  instantly elevated themselves to `role = 'ngo'`, gaining immediate access to
  NGO management features before administrative verification.
- **FIX**: Modified `app/actions/organizations.ts` to assign `organization_id`
  but preserve the user's role until the organization status is promoted to
  `verified` by a platform administrator.
- **VERIFICATION**: Verified in `app/actions/organizations.ts` code audit and
  `tests/security_expanded.test.ts`.

---

### Finding ID: SEC-ISO-01 — Missing Organization Ownership Enforcement in Project Mutations

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: `app/actions/projects.ts` (`addProjectMilestone`,
  `addProjectUpdate`) checked `profile.role === 'ngo'` or `admin`, but did not
  assert that `project.organization_id === profile.organization_id`.
- **RISK**: A user belonging to NGO A could add milestones or updates to
  projects belonging to NGO B by simply passing NGO B's `projectId`.
- **FIX**: Enforced strict tenant isolation in `addProjectMilestone` and
  `addProjectUpdate`:
  ```ts
  if (userRole !== "admin" && userOrgId !== project.organization_id) {
    return {
      success: false,
      error:
        "Unauthorized: You do not have permission to modify this organization's project.",
    };
  }
  ```
- **VERIFICATION**: Tested in `tests/security_expanded.test.ts` asserting
  cross-tenant rejection.

---

### Finding ID: SEC-DOS-01 — Public Action Abuse / Rate Limiting

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: Public actions (`submitDeviceDonation`, `trackDeviceCode`,
  `recordDonationPledge`) had no request throttling.
- **RISK**: Scripted bots could flood device intake with bogus records or
  brute-force tracking codes.
- **FIX**: Created `lib/rate-limit.ts` providing sliding-window token bucket
  limits per IP:
  - Tracking code queries: 20 per minute.
  - Submissions: 5 per 5 minutes.
- **VERIFICATION**: Tested in `tests/security_expanded.test.ts` simulating burst
  requests exceeding limits.

---

### Finding ID: SEC-HDR-01 — Missing Hardened HTTP Security Headers

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: Next.js configuration lacked strict Content Security Policy,
  HSTS, and frame-ancestors restrictions.
- **RISK**: Exposure to clickjacking, MIME-type sniffing, and cross-site
  scripting vulnerabilities.
- **FIX**: Implemented comprehensive headers in `next.config.ts` and
  `middleware.ts`:
  - `Content-Security-Policy`: Disallows unsafe object/frame embedding;
    restricts scripts and styles.
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`.
  - `X-Frame-Options`: `DENY`.
  - `X-Content-Type-Options`: `nosniff`.
  - `Referrer-Policy`: `strict-origin-when-cross-origin`.
  - `Permissions-Policy`: Disabled geolocation, microphone, and camera.
- **VERIFICATION**: Verified in `next.config.ts` and `middleware.ts`.

---

### Finding ID: SEC-DB-01 — Immutable Audit Logs & Restricted Anonymous Ingestion

- **STATUS**: PASS (Remediated)
- **EVIDENCE**: `audit_logs` table had no explicit revocation of UPDATE/DELETE.
  `devices` table allowed `WITH CHECK (TRUE)` for anonymous submissions across
  all columns.
- **RISK**: Database actors or SQL injection could tamper with audit trail
  records or inject pre-approved devices with false organizations.
- **FIX**: Created migration
  `supabase/migrations/20260101000000_production_hardening.sql`:
  1. Revoked `UPDATE` and `DELETE` on `audit_logs` from `anon` and
     `authenticated`.
  2. Replaced device insert policy to require `status = 'Submitted'` and
     disallow pre-assigned orgs or projects on anonymous intake.
  3. Reset default `tax_exempt_eligible` to `FALSE` on organizations until
     legally verified.
- **VERIFICATION**: Migration script validated and reviewed.

---

## 3. Automated Test Verification Log

Executed via `vitest run` on September 5, 2026:

```
 RUN  v3.2.7 /Users/aryanyadav/Desktop/PROJECTS/Orphan

 ✓ tests/lifecycle.test.ts (8 tests)
 ✓ tests/device_lifecycle.test.ts (5 tests)
 ✓ tests/dtos.test.ts (2 tests)
 ✓ tests/security.test.ts (5 tests)
 ✓ tests/validation.test.ts (5 tests)
 ✓ tests/security_expanded.test.ts (13 tests)

 Test Files  6 passed (6)
      Tests  38 passed (38)
```

**Compilation & Build Validation**:

- `npx tsc --noEmit`: 0 errors.
- `npm run lint`: 0 errors.
- `npm run build`: 39/39 routes compiled successfully.
