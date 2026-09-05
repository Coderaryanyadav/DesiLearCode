# DesiLearCode — Final Architecture Report (2026)

**Audit Date**: September 2026

## Core Architectural Flow

```
[ Browser / Client Components ]
          │
          ▼ (React Server Components / Server Actions)
[ Next.js 15 App Router ]
          │
          ▼ (Data Validation & Authorization Layer)
[ Zod Validation + Auth Helpers (requireUser, requireAdmin) ]
          │
          ▼ (Supabase SSR Client / Secure Cookies)
[ PostgreSQL + Row Level Security (RLS) ]
```

## 1. Authentication
- **Mechanism**: Supabase SSR (Server-Side Rendering) with secure, HttpOnly, SameSite cookies.
- **Client State**: UI state reflects session status for UX only (via `AuthProvider`). It never dictates authorization.
- **Role Enforcement**: User roles (`admin`, `ngo`, `volunteer`, `donor`) are strictly managed in the `public.profiles` database table and resolved exclusively via server-side fetches. Client-side role spoofing has been architecturally eliminated.

## 2. Authorization & Tenant Isolation
- **Server Actions**: Every mutation in `app/actions/*.ts` verifies identity via `auth.getUser()`. Dedicated helpers (e.g., `requireAdmin()`, `requireNGO()`) enforce logic gates before any database queries execute.
- **Row Level Security (RLS)**: Deep defense mechanism. `organizations`, `projects`, `devices`, and `volunteer_applications` tables possess explicit RLS policies ensuring an NGO can only `SELECT`, `UPDATE`, or `INSERT` records tied to their verified `organization_id`.
- **IDOR Protection**: Accessing resources by UUID explicitly validates ownership against the session ID or organization boundary at the database level.

## 3. Data Ownership & Audit Logging
- **Audit Trails**: Critical operations (NGO verification, project approval, safeguarding escalation) trigger immutable audit logs in the `audit_logs` table.
- **Integrity**: Audit logs capture `actor_id`, `actor_role`, `action`, `target_id`, and `timestamp`. They are append-only.

## 4. Safeguarding & Privacy
- **Zero-PII**: The database schema actively rejects individual child PII. Beneficiaries are tracked exclusively as statistical aggregates (`targetStudents`).
- **Reporting Queue**: Safeguarding incidents (`app/actions/safeguarding.ts`) bypass standard logging and route directly to a confidential, admin-only queue protected by strict RLS `admin-only` SELECT policies.

## 5. Payment Abstraction
- **Design**: Configured to cleanly integrate with Razorpay/Stripe webhooks in the future.
- **Current State**: Generates secure internal ledger receipts (`DLC-XXXX`) for pledged donations. 
- **Security**: No fake payment success states, no arbitrary client-side "amount funded" increments, and no exposed gateway secrets. Funding updates will rely strictly on server-to-server webhook reconciliation.

## 6. Storage & Deployment
- **Deployment**: Vercel optimized (Next.js Edge network, Server Actions).
- **Environment Management**: Strict fail-closed configuration. Missing Supabase URLs or keys result in immediate build/runtime errors rather than silent fallbacks.

## Summary
The DesiLearCode architecture successfully implements a zero-trust model. The database acts as a hard security boundary, server actions act as the validation gateway, and the frontend purely consumes and strictly displays authorized states.
