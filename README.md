# DesiLearCode — Complete System Guide & Onboarding Manual

> **Technology. Education. Opportunity.**  
> An open, zero-trust infrastructure connecting refurbished hardware, engineering mentors, and verified grassroots educational labs across India.

---

## Table of Contents

1. [Platform Philosophy & The Core Flow](#1-platform-philosophy--the-core-flow)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Quick Start: 5-Minute Local Setup](#3-quick-start-5-minute-local-setup)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [Database Setup, Migrations & Seed Data](#5-database-setup-migrations--seed-data)
6. [Complete Role-by-Role User Journeys](#6-complete-role-by-role-user-journeys)
   - [A. Public Visitor / Supporter](#a-public-visitor--supporter)
   - [B. Hardware / Device Donor](#b-hardware--device-donor)
   - [C. Financial Pledge Supporter](#c-financial-pledge-supporter)
   - [D. Volunteer Mentor](#d-volunteer-mentor)
   - [E. Grassroots NGO Partner](#e-grassroots-ngo-partner)
   - [F. Platform Safety Administrator](#f-platform-safety-administrator)
7. [Security, Privacy & Data Integrity Principles](#7-security-privacy--data-integrity-principles)
   - [Zero-PII Child Safeguarding](#zero-pii-child-safeguarding)
   - [Hardware State Machine & NIST Guidance](#hardware-state-machine--nist-guidance)
   - [Financial Decoupling: Pledge vs. Settled Funds](#financial-decoupling-pledge-vs-settled-funds)
   - [Deterministic Need Calculations](#deterministic-need-calculations)
   - [Tenant Isolation & Role Level Security (RLS)](#tenant-isolation--role-level-security-rls)
   - [Append-Only Audit Trails](#append-only-audit-trails)
8. [Payment Gateway Integration Guide](#8-payment-gateway-integration-guide)
9. [Verification, Testing & Quality Gates](#9-verification-testing--quality-gates)
10. [Deploying to Production (Vercel + Supabase)](#10-deploying-to-production-vercel--supabase)
11. [Troubleshooting & Common Questions](#11-troubleshooting--common-questions)

---

## 1. Platform Philosophy & The Core Flow

DesiLearCode is **not** a generic charity portal, an e-commerce storefront, or an AI mockup. It is a verifiable logistics and accountability platform built on a deterministic resource pipeline:

```
┌───────────────────────────┐
│     DONATED RESOURCES     │
│ (Laptops, Funds, Mentors) │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   VERIFICATION ENGINE     │
│ (NIST Wipe, Statutory NGO │
│  Audit, Volunteer Vetting)│
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  ACTIVE LEARNING LABS     │
│ (Itemized Needs, Roadmap  │
│  Milestones, Zero-PII)    │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│    VERIFIED IMPACT        │
│ (Field Audit Reports, Lab │
│  Telemetry, Public Ledger)│
└───────────────────────────┘
```

### Core Tenets:
- **No Fabricated Data**: If an impact report has not been physically audited by an administrator, the platform displays `0` verified students trained with an explicit target goal, rather than guessing.
- **Zero-PII for Minors**: Children's names, faces, grades, personal phone numbers, or residential addresses are strictly prohibited across all database tables and public endpoints.
- **Milestone-Gated Accountability**: Hardware and funds are allocated to specific, itemized requirements (e.g. *20 Refurbished ThinkPads for Raspberry Pi Lab*), never to ambiguous administrative pools.

---

## 2. Architecture & Technology Stack

```
DesiLearCode Stack
├── Frontend Presentation: Next.js 15.5 (App Router, React 19)
├── Styling & Design: Vanilla Tailwind CSS (Custom Design Tokens, Zero Templates)
├── Type Safety: TypeScript 5.9 (Strict, 0 type errors)
├── Backend Logic: Next.js Server Actions with Zod Schemas
├── Database: PostgreSQL 15+ hosted on Supabase
├── Row Level Security: 25+ Granular PostgreSQL RLS Policies
├── Session & Auth: Supabase SSR Cookie Exchange (HttpOnly, SameSite=Lax)
├── Rate Limiting: In-Memory Sliding-Window Token Bucket
├── Testing Framework: Vitest (54 Unit, Integration & Security Tests)
└── Deployment Target: Vercel (Edge Middleware + Node.js Runtime)
```

### File System Directory Map:
```
.
├── app/
│   ├── actions/                   # Validated Server Actions (auth, devices, donations, impact, orgs, projects, safeguarding, volunteers)
│   ├── admin/                     # Platform administrator control center & audit queues
│   ├── dashboard/                 # Donor & volunteer self-service account dashboard
│   ├── donate-device/page.tsx     # 5-step hardware intake wizard & public tracking lookup
│   ├── impact/page.tsx            # Live PostgreSQL platform metrics & verified field reports
│   ├── needs/page.tsx             # Real-time equipment & mentorship directory
│   ├── ngo/                       # Multi-tenant grassroots partner operating portal
│   ├── organizations/page.tsx     # Directory of statutory-verified NGOs
│   ├── projects/                  # Case-file initiatives dossier & support modal
│   ├── safeguarding/page.tsx      # Child protection charter & confidential whistleblower intake
│   ├── volunteer/page.tsx         # Engineering mentor onboarding & opportunities
│   ├── layout.tsx                 # Root layout with Safeguarding banner & navigation
│   ├── error.tsx                  # Controlled service communication error boundary
│   └── not-found.tsx              # Clean 404 ledger lookup page
├── components/                    # Reusable, accessible UI components (cards, badges, modals, timelines)
├── lib/
│   ├── crypto-id.ts               # CSPRNG tracking IDs (#DLC-XXXX-XXXX) and receipt numbers
│   ├── device-lifecycle.ts        # Finite state machine (12 discrete device states)
│   ├── dtos/                      # Zero-PII safe public DTO sanitization layer
│   ├── env.ts                     # Robust Zod environment validation with auto-protocol cleanup
│   ├── payments/                  # Payment gateway abstraction (defaults to NOT_CONFIGURED)
│   ├── rate-limit.ts              # Sliding-window token bucket abuse protection
│   ├── validations.ts             # Strict Zod schemas for all forms
│   └── supabase/                  # Server and browser client initialization
├── supabase/
│   ├── migrations/                # Database schemas & production hardening RLS migrations
│   │   ├── 20240101000000_initial_schema.sql
│   │   ├── 20260101000000_production_hardening.sql
│   │   └── 20260101000001_project_subtables_rls.sql
│   └── seed.sql                   # Realistic initial initiatives, needs, and hardware data
└── tests/                         # Automated test suite (54/54 passing tests)
```

---

## 3. Quick Start: 5-Minute Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Coderaryanyadav/DesiLearCode.git
cd DesiLearCode
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Set Up Your Local Environment File
Create `.env.local` by copying the template:
```bash
cp .env.example .env.local
```
Add your Supabase project credentials (see [Section 4](#4-environment-variables-reference) below).

### Step 4: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Run the Automated Verification Suite
```bash
npm test
```
All 54 security and business logic tests will pass in under 400ms.

---

## 4. Environment Variables Reference

Configure these in `.env.local` for local development or in **Vercel Project Settings ➔ Environment Variables** for production:

| Variable Name | Required? | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `https://your-project.supabase.co` | Your Supabase project REST endpoint. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | `eyJhbGciOi...` | Public anonymous key for client-side queries (RLS protected). |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `eyJhbGciOi...` | Secret key used only by backend cron scripts or root migrations. |
| `NEXT_PUBLIC_APP_URL` | Optional | `http://localhost:3000` | Canonical URL of the platform. Automatically prepends `https://` if omitted. |
| `NEXT_PUBLIC_SAFEGUARDING_EMAIL` | Optional | `safeguarding@desilearncode.org` | Dedicated email address displayed in safety and whistleblower notices. |

> **Pro-Tip on Build Resilience**: In [`lib/env.ts`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/env.ts), our environment parser automatically sanitizes URLs (handling missing `https://`), trims whitespace, and supplies safe fallbacks during static page prerendering (`next build`) so builds never fail due to blank optional variables.

---

## 5. Database Setup, Migrations & Seed Data

The database schema is managed through pure SQL migrations in `supabase/migrations/`.

### How to Apply to a Fresh Supabase Project:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** tab.
3. Run the migration files in this exact order:

#### File 1: Base Schema
Open [`supabase/migrations/20240101000000_initial_schema.sql`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/supabase/migrations/20240101000000_initial_schema.sql), paste into SQL Editor, and click **Run**.  
*Sets up ENUMs, tables (`profiles`, `organizations`, `projects`, `project_needs`, `devices`, etc.), indexes, and triggers.*

#### File 2: Production Hardening
Open [`supabase/migrations/20260101000000_production_hardening.sql`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/supabase/migrations/20260101000000_production_hardening.sql), paste into SQL Editor, and click **Run**.  
*Locks down `audit_logs` (revoking UPDATE/DELETE), restricts device submission states, hardens profile update policies to prevent role escalation, and enforces confidential safeguarding.*

#### File 3: Subtables Tenant Isolation
Open [`supabase/migrations/20260101000001_project_subtables_rls.sql`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/supabase/migrations/20260101000001_project_subtables_rls.sql), paste into SQL Editor, and click **Run**.  
*Applies explicit RLS policies for `project_milestones` and `project_updates` guaranteeing cross-tenant isolation between NGOs.*

#### File 4 (Optional): Seed Data for Development
Open [`supabase/seed.sql`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/supabase/seed.sql), paste into SQL Editor, and click **Run**.  
*Populates realistic initiatives in Delhi, Bengaluru, and Pune, with realistic hardware allocations and itemized needs.*

---

## 6. Complete Role-by-Role User Journeys

DesiLearCode supports 6 distinct personas with specific workflows:

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   DONOR     │     │  VOLUNTEER   │     │     NGO      │
│  (Devices/  │     │   (Mentor)   │     │ (Grassroots) │
│   Pledges)  │     │              │     │              │
└──────┬──────┘     └──────┬───────┘     └──────┬───────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌───────────────────────────────────────────────────────┐
│              SERVER ACTIONS & RLS MATRIX              │
│       Rate Limiting • Role Check • Audit Logger       │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │    PLATFORM ADMIN       │
              │  (Review & Verification)│
              └─────────────────────────┘
```

---

### A. Public Visitor / Supporter
- **Explore**: Browse verified initiatives at [`/projects`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/projects/page.tsx) with real-time filters for urgency, category, and regional requirements.
- **Track Hardware**: Enter any tracking code (`DLC-XXXX-XXXX`) at [`/donate-device`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/donate-device/page.tsx) to inspect lifecycle history on an auditable timeline without revealing donor identity.
- **Read Field Reports**: View quarterly verified classroom outcomes at [`/impact`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/impact/page.tsx).

---

### B. Hardware / Device Donor
1. **Intake Flow**: Navigate to [`/donate-device`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/donate-device/page.tsx) and complete the 5-step diagnostic wizard:
   - *Step 1*: Device specifications (Laptop, Desktop, Tablet, Manufacturer, Model, Specs).
   - *Step 2*: Physical & electrical condition (Powers on, battery health, charger included).
   - *Step 3*: Logistics preference (Lab drop-off or doorstep courier dispatch).
   - *Step 4*: Data sanitization consent aligned with **NIST SP 800-88 guidance**.
   - *Step 5*: Instant cryptographic tracking code issuance (e.g. `DLC-8F2A-4C1B`).
2. **Server Enforcement**:
   - Initial device record created strictly with `status = 'Submitted'`.
   - `assigned_organization_id` and `assigned_project_id` are locked to `NULL` to prevent donor manipulation.
3. **Public Ledger**:
   - The donor monitors refurbishment, drive sanitization, and lab installation via [`toPublicDeviceTracking`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/dtos/index.ts#L31).

---

### C. Financial Pledge Supporter
1. **Pledge Submission**: On any project dossier (e.g. `/projects/rural-coding-lab`), click **Support This Project**.
2. **Support Intent Recording**:
   - Select an amount (e.g. ₹2,500, ₹5,000, or custom).
   - Submit intent via [`submitDonationIntent`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/actions/donations.ts#L10).
3. **Pledge vs. Settled Distinction**:
   - The status is explicitly recorded as `PLEDGED (UNSETTLED INTENT)`.
   - **Crucial Rule**: The pledge does **NOT** increment `projects.current_value`. Confirmed funds increase only upon statutory payment gateway settlement.
   - The modal displays an honest disclaimer regarding 80G tax receipt issuance.

---

### D. Volunteer Mentor
1. **Application**: Navigate to [`/volunteer/apply`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/volunteer/apply/page.tsx).
2. **Skills Taxonomy**: Select technical domains (Scratch, Python, Web Development, Offline Linux, Robotics).
3. **Safeguarding Undertaking**: Mandatory child safeguarding code of conduct acceptance before application submission.
4. **Dashboard**: Track opportunities, active center assignments, and logged mentor hours at `/dashboard/volunteering`.

---

### E. Grassroots NGO Partner
1. **Registration**: Apply at `/register` as an organization representative.
2. **Pending State**:
   - Organization is inserted with `verification_status = 'pending'`.
   - The user profile role remains `'donor'` — **no instant privilege escalation**.
3. **Administrative Audit**:
   - An administrator inspects statutory registration, trust deed, and field credibility.
   - Upon administrative approval, the organization becomes `verified` and the lead user is elevated to `role = 'ngo'`.
4. **Project Lifecycle**:
   - Create a project at `/ngo/projects/new`. Initial status is `pending_approval`.
   - Add itemized needs via [`addProjectNeed`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/actions/projects.ts#L263) (fulfillment starts at 0, client cannot tamper).
   - Post roadmap milestones and field updates (scanned automatically for child PII).
   - Once reviewed and activated by an admin, the project appears in the public national directory.

---

### F. Platform Safety Administrator
1. **Command Center**: Accessible at [`/admin`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/admin/page.tsx) for users with `role = 'admin'`.
2. **Core Administrative Queues**:
   - **Organization Verification**: Review pending NGO applications and promote to verified status.
   - **Project Moderation**: Approve draft initiatives to `active` status.
   - **Hardware Intake**: Process physical device receipts, assign lab refurbishment batches, and transition devices to `Ready` or `Assigned`.
   - **Impact Verification**: Review submitted field impact reports and execute [`verifyImpactReport`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/actions/impact.ts#L80) so metrics flow into public telemetry.
   - **Safeguarding Escalations**: Inspect confidential whistleblower incident reports at `/admin/reports`.
   - **Immutable Audit Log**: Inspect the append-only ledger at [`/admin/audit`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/app/admin/audit/page.tsx).

---

## 7. Security, Privacy & Data Integrity Principles

### Zero-PII Child Safeguarding
- **No Individual Minor Records**: The database schema contains no tables for students, minors, birthdates, or identifying imagery.
- **Aggregate Beneficiary Scope**: Educational initiatives record only aggregate cohort numbers (e.g. `target_students: 60`, `beneficiary_group: "Students aged 11–15 in Pune rural district"`).
- **Automated Text Scanners**: All project updates and impact summaries are checked server-side for child PII strings (`grade \d`, `age \d`, `phone`, `minor`) before insertion.
- **Confidential Triage**: Reports filed at `/safeguarding` are accessible exclusively to platform safety administrators (`role = 'admin'`).

### Hardware State Machine & NIST Guidance
- State transitions follow a strict directed graph in [`lib/device-lifecycle.ts`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/device-lifecycle.ts):
  ```
  Submitted ➔ Under Review ➔ Approved ➔ Pickup Scheduled ➔ Received
      ➔ Inspection ➔ Repair ➔ Ready ➔ Assigned ➔ Delivered ➔ In Use ➔ Retired
  ```
- **Illegal Jumps Blocked**: Jumping directly from `Submitted` to `In Use` is rejected server-side.
- **NIST SP 800-88 Alignment**: Every sanitized drive undergoes multi-pass cryptographic wipe and bad-sector scanning. Copy explicitly states *"aligned with NIST SP 800-88 guidance"* — we never make uncertified compliance claims.

### Financial Decoupling: Pledge vs. Settled Funds
- **Intent vs. Treasury**: `donation_intents` records intentions with `status = 'pledged'`.
- Pledges do **not** increment `projects.current_value`. Confirmed funds are increased only when settled banking webhooks execute.
- Race conditions during concurrent donations are eliminated because public totals are derived from settled database states rather than client arithmetic.

### Deterministic Need Calculations
- Formula:
  $$\text{Remaining Gap} = \max(\text{Quantity Required} - \text{Quantity Fulfilled}, 0)$$
- Client requests attempting to inject `quantityFulfilled = 999999` are rejected; initial needs always start with server-enforced `quantity_fulfilled: 0`.

### Tenant Isolation & Role Level Security (RLS)
- NGO representatives can manage only projects, milestones, needs, and hardware where:
  $$\text{record.organization\_id} = \text{user.organization\_id}$$
- RLS policies prevent cross-tenant mutations even if a malicious client crafts direct database requests.

### Append-Only Audit Trails
- Table `public.audit_logs` records: `actor_name`, `actor_email`, `actor_role`, `action`, `target_type`, `target_id`, `details`, and `timestamp`.
- Database-level revocation:
  ```sql
  REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon, public;
  ```
  Nobody—not even authenticated admins—can modify or delete historical audit entries.

---

## 8. Payment Gateway Integration Guide

Currently, DesiLearCode uses [`UnconfiguredPaymentProvider`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/payments/index.ts#L23), which safely records pledges without simulated payments.

### When you are ready to activate Razorpay:

1. Obtain your live API keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Add these to `.env.local` / Vercel:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Implement `RazorpayPaymentProvider` adhering to the [`PaymentProvider`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/payments/types.ts#L61) interface in `lib/payments/types.ts`:
   - `createPayment(params)`: Calls `razorpay.orders.create()`.
   - `verifyPayment(params)`: Validates HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`.
   - `handleWebhook(event)`: Validates `x-razorpay-signature` and atomically transitions `donation_intents.status` to `'settled'`.
4. Update the singleton in [`lib/payments/index.ts`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/payments/index.ts#L68) to export your new live provider.

---

## 9. Verification, Testing & Quality Gates

Run our complete quality suite locally before committing:

```bash
# 1. Run full Vitest test suite (54 test cases across 7 files)
npm test

# 2. Strict TypeScript type check (0 errors)
npx tsc --noEmit

# 3. Next.js ESLint validation (0 errors, 0 warnings)
npm run lint

# 4. Optimized production build (compiles all 39 static & dynamic routes)
npm run build
```

### Automated Test Coverage Breakdown:
- `backend_verification.test.ts`: Financial decoupling, deterministic progress, 5-role device transitions, zero-PII DTOs, cross-tenant isolation, verified impact aggregation.
- `security_expanded.test.ts`: Role escalation rejection, rate-limiting simulation, safeguarding text scanners, CSPRNG token collision resistance.
- `device_lifecycle.test.ts`: Permitted state progression & terminal state rules.
- `dtos.test.ts`: Data transfer object sanitization.
- `validation.test.ts`: Zod input schemas.

---

## 10. Deploying to Production (Vercel + Supabase)

### Deploy in 3 Steps:

1. **Push to GitHub**:
   Ensure your code is pushed to your remote repository:
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**:
   - Open [Vercel Dashboard](https://vercel.com/new).
   - Import your `DesiLearCode` repository.
   - Framework Preset: **Next.js**.
   - Build Command: `npm run build`.

3. **Configure Environment Variables in Vercel**:
   In **Project Settings ➔ Environment Variables**, add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOi...
   NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
   NEXT_PUBLIC_SAFEGUARDING_EMAIL = safeguarding@desilearncode.org
   ```

4. **Deploy**:
   Click **Deploy**. Next.js will compile all 39 routes and deploy globally with edge caching and zero warnings.

---

## 11. Troubleshooting & Common Questions

### Q: Why did Vercel give an `[ENV ERROR]` during `_not-found` prerendering?
**A**: This occurs if `NEXT_PUBLIC_APP_URL` or `NEXT_PUBLIC_SAFEGUARDING_EMAIL` are set as blank strings in Vercel settings. We implemented auto-sanitization and build-time fallbacks in [`lib/env.ts`](file:///Users/aryanyadav/Desktop/PROJECTS/Orphan/lib/env.ts) to guarantee static prerendering never crashes even if optional variables are empty.

### Q: Why does an initiative show 0 students reached even though target students is 60?
**A**: Because DesiLearCode adheres to authentic field auditing. `targetStudents: 60` is the initiative's **goal**. `studentsReached` reflects genuine students trained from **audited and verified quarterly reports** (`verified_by_admin = true`). When no field reports have been verified yet, the platform truthfully shows `0 (Goal: 60)` rather than fabricating success.

### Q: How do I create the first platform administrator?
**A**: 
1. Sign up for an account via `/register` (e.g. `admin@desilearncode.org`).
2. Go to your **Supabase Dashboard ➔ Table Editor ➔ `profiles`**.
3. Locate your user row and change `role` from `'donor'` to `'admin'`.
4. Because our PostgreSQL RLS policies check `public.is_admin()`, you will immediately receive full administrative privileges across `/admin`.

---

## License & Compliance

Developed under standard open-infrastructure principles for educational non-profits. Data sanitization workflows align with **NIST SP 800-88 Revision 1** guidelines. Beneficiary privacy conforms to global child digital protection standards.
