# DesiLearCode — Production Architecture Specification (2026)

**Architecture Version**: 2.0.0 (Production Hardened)  
**Execution Environment**: Next.js 15.5.25 App Router, TypeScript 5.9, Supabase PostgreSQL, Edge-ready Node.js runtime  

---

## 1. High-Level Architectural Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Client Layer (Browser / Mobile)                    │
│   • Server Components (Default)     • Lightweight Client Interactive   │
│   • Semantic HTML5 & WCAG 2.2 AA    • No Client-Side Role Authority     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / HTTP2 / TLS 1.3
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 Edge / Middleware & Ingress Protection                 │
│   • Strict HTTP Headers (CSP, HSTS 63072000, X-Frame-Options DENY)      │
│   • Sliding-Window Rate Limiting (lib/rate-limit.ts)                   │
│   • Strict Environment Validator (lib/env.ts)                          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│             Next.js 15 App Router & Server Actions Layer                │
│   • Session Validation via HttpOnly SameSite Cookies (Supabase SSR)     │
│   • Multi-tier RBAC Gatekeepers (requireUser, requireAdmin, requireNGO)│
│   • Input Sanitization & Zod Schemas                                   │
│   • Tenant Isolation Verification (Project org_id == Session org_id)    │
│   • Device Lifecycle State Machine (lib/device-lifecycle.ts)          │
│   • Cryptographic Identifier Generation (lib/crypto-id.ts)             │
│   • Payment Gateway Abstraction (lib/payments/)                        │
└──────────────────┬──────────────────────────────────┬───────────────────┘
                   │                                  │
                   ▼ (Public Query Boundary)          ▼ (Privileged Admin/DB)
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│       Public DTO Sanitization        │  │     Database Execution        │
│   • lib/dtos/index.ts                │  │  • PostgreSQL with Full RLS   │
│   • Strips Donor & Child PII         │  │  • Append-Only audit_logs     │
│   • PublicDeviceTracking             │  │  • Transactional Triggers     │
│   • PublicProject / PublicNeed       │  │  • Safe Ingestion Policies    │
└──────────────────────────────────────┘  └───────────────────────────────┘
```

---

## 2. Core Subsystems

### 2.1. Environment & Configuration Security (`lib/env.ts`)
The platform forbids silent fallbacks to fake infrastructure. At startup and request handling, `validateEnv()` runs a strict Zod validator:
- Rejects placeholder domains (`placeholder-project.supabase.co`) and fake keys (`placeholder-anon-key`).
- Ensures `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are genuine and structurally valid.
- Fails fast with clear operational error messaging if misconfigured.

### 2.2. Denial of Service & Abuse Mitigation (`lib/rate-limit.ts`)
Publicly accessible forms and mutation actions are shielded by an in-memory sliding-window token bucket algorithm:
- Public tracking code queries: 20 calls/minute per IP.
- Device submissions & donation pledges: 5 calls/5 minutes per IP.
- Exceeded thresholds return structured HTTP 429 errors without executing backend queries.

### 2.3. Identity, Roles & Session Architecture
- **Session Handling**: Supabase SSR securely parses and sets HttpOnly, SameSite cookies.
- **Role Authority**: The user role (`visitor`, `donor`, `volunteer`, `ngo`, `admin`) is read strictly from `public.profiles` via authenticated server sessions. Client-side role switching is architecturally impossible.
- **Tenant Isolation**: When an NGO user mutates project milestones, updates, or needs, the server action validates that `project.organization_id === user.organization_id`. Any cross-organization manipulation attempt is rejected.
- **NGO Application Gate**: Registering a new organization records an unverified application; the user is NOT elevated to `role = 'ngo'` until platform administrators verify the organization.

### 2.4. Financial & Payment Abstraction (`lib/payments/`)
- **Pledge vs. Settled Funding**: Donations record an intent with state `pledged`. Pledges do NOT increment `projects.current_value`.
- **Payment Provider Contract**:
  ```ts
  interface PaymentProvider {
    createPayment(intent: PaymentIntentRequest): Promise<PaymentCreationResult>;
    verifyPayment(payload: PaymentVerificationPayload): Promise<PaymentVerificationResult>;
    handleWebhook(rawBody: string, signature: string): Promise<WebhookHandlingResult>;
  }
  ```
- **Live Status**: Defaults to `UnconfiguredPaymentProvider`, returning status `NOT_CONFIGURED` until live Razorpay or Stripe credentials and HMAC webhook verification keys are provided.

### 2.5. Device Logistics State Machine (`lib/device-lifecycle.ts`)
Device donations transition strictly through authorized paths:
`Submitted` ➔ `Approved` ➔ `Received` ➔ `Repair` ➔ `Ready` ➔ `Assigned` ➔ `In Use` (or `Decommissioned` / `Rejected`).
- Any illegal jump (e.g. `Submitted` directly to `In Use`) is rejected by `validateDeviceTransition()`.
- Every transition appends an entry to `device_updates` and records an immutable entry in `audit_logs`.

### 2.6. Zero-PII Public Data Transfer Objects (`lib/dtos/`)
To protect donors and child beneficiaries from data exposure:
- Raw database rows are never returned directly to public endpoints.
- `toPublicDeviceTracking()`: Strips donor name, donor phone, donor email, donor address, and technician diagnostic internal notes. Only non-identifiable telemetry (type, brand, model, approximate age, public timeline) is exposed.
- `toPublicProject()`: Strips internal operational comments.
- Beneficiary data is restricted to cohort aggregates (`targetStudents: number`, `beneficiaryGroup: string`).

### 2.7. High-Entropy Cryptographic Identifiers (`lib/crypto-id.ts`)
Insecure pseudo-random number generators (`Math.random()`) have been eliminated:
- `generateTrackingCode()`: Uses Node.js `crypto.randomBytes(6)` to generate collision-resistant `DLC-XXXX-XXXX` tokens.
- `generateReceiptNumber()`: Uses UTC timestamp and CSPRNG hex bytes to generate `DLC-REC-YYYYMMDD-XXXX`.
- `generateSecureSlug()`: Formats URL-safe strings with CSPRNG hex suffixes.

---

## 3. Database Security & Row Level Security (RLS)

- **`profiles`**: Users can update only display name and phone. Changing `role` or `organization_id` is prevented by RLS and database triggers.
- **`organizations`**: Public can read verified organizations. NGOs can update only their own profile details. Verification state is admin-only.
- **`projects`**: Public can view published projects. NGOs can insert/update only projects belonging to their verified `organization_id`.
- **`devices`**: Anonymous visitors can insert intake records with status forced to `Submitted` and no pre-assigned organization. Updates require authenticated technician or admin role.
- **`audit_logs`**: Append-only log. `UPDATE` and `DELETE` privileges are completely revoked for `anon` and `authenticated`.
- **`safeguarding_reports`**: Confidential queue. Access is restricted exclusively to platform safety administrators (`role = 'admin'`).

---

## 4. Verification & Testing Standards

All code modifications are verified against:
1. **Automated Vitest Suite**: 38 tests spanning authorization, IDOR, device lifecycle, public DTO sanitization, and cryptographic identifiers.
2. **TypeScript 5.9 Compiler**: Strict type checking with 0 errors via `npx tsc --noEmit`.
3. **Next.js Production Compilation**: Full static and dynamic page generation (39 routes) with zero build errors.
