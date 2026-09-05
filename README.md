# DesiLearCode — Technology. Education. Opportunity.

**DesiLearCode** is a production-hardened educational technology and hardware redistribution platform designed to bridge the digital divide for underserved student learning labs across India. It connects device donors, verified child-welfare/educational NGOs, and volunteer mentors through a zero-trust, privacy-first infrastructure.

---

## 🌟 Core Platform Capabilities

1. **Projects & Real-Time Needs Marketplace**
   - Verified grassroots initiatives with itemized, tangible requirements (e.g. *Refurbished Laptops*, *Python Mentors*, *Lab Connectivity*).
   - Dynamic progress tracking, priority indicators, and cohort aggregate beneficiary metrics (zero individual child PII).
2. **Verifiable Device Donation Logistics Flow**
   - 5-step diagnostic intake wizard (specs, physical condition, pickup/drop-off, data sanitization pledge, confirmation).
   - High-entropy cryptographic tracking codes (`#DLC-XXXX-XXXX`) generated via CSPRNG.
   - Public tracking endpoint powered by a zero-PII Data Transfer Object (`PublicDeviceTracking`), completely stripping donor contact info and private technician remarks.
   - Strict 7-step lifecycle state machine (`Submitted` ➔ `Approved` ➔ `Received` ➔ `Repair` ➔ `Ready` ➔ `Assigned` ➔ `In Use`).
   - Data sanitization process aligned with **NIST SP 800-88** guidelines (overwriting, cryptographic erase, technician verification).
3. **Volunteer Mentorship Portal**
   - Onboarding with technical skills taxonomy (Scratch, Python, Web Dev, Cyber Safety).
   - Mandatory child safeguarding consent and background verification agreements.
   - Session scheduling and verified service hours tracking via auditable records.
4. **NGO Institutional Console**
   - Statutory credential management (12A/80G filings, registration numbers).
   - Project drafting with platform moderation workflows (`draft` ➔ `pending_review` ➔ `published`).
   - Field updates and verified quarterly impact reporting.
   - Strict multi-tenant isolation preventing cross-organization access.
5. **Platform Administrator Command Center**
   - Action-oriented operational queues: NGO Verification Queue, Hardware Intake Assessment, Volunteer Background Checks, and Safeguarding Incident Triage.
   - Append-only `audit_logs` tracking actor identity, role, action, target, and timestamp.
6. **Child Safeguarding & Zero-PII Guarantee**
   - No individual child profiles, contact information, or identifying imagery.
   - Strict aggregated cohort reporting only (`targetStudents: number`, `beneficiaryGroup: string`).
   - Automated PII detection scanners on submitted updates.
   - Confidential escalation queue routed exclusively to safety administrators.
7. **Transparent Financial Intent Architecture**
   - Support vouchers record explicit intent with status `pledged`. Pledges do NOT artificially inflate confirmed project treasury balances.
   - Clear disclosures regarding 80G tax exemption eligibility based on recipient statutory verification.
   - Payment provider abstraction layer (`lib/payments/`) ready for Razorpay/Stripe HMAC webhook integration; defaults safely to `NOT_CONFIGURED`.

---

## 🚀 Architecture & Tech Stack

- **Framework**: Next.js 15.5.25 (App Router, React 19)
- **Language**: TypeScript 5.9 (Strict mode, zero `any` leaks in DTO boundary)
- **Styling**: Tailwind CSS with CSS variable tokens (editorial aesthetic, zero AI templates)
- **Database & Auth**: PostgreSQL via Supabase with Row Level Security (RLS) and HttpOnly SSR cookie sessions
- **Validation**: Zod schema validation across all Server Actions
- **Rate Limiting**: Sliding-window token bucket limiter (`lib/rate-limit.ts`) protecting public intake endpoints
- **Security Headers**: HSTS (`63072000`), Content-Security-Policy, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`)
- **Testing**: Vitest automated suite (38 test cases covering authorization, IDOR, device state machine, DTO sanitization)

---

## 📁 Repository Structure

```
.
├── app/
│   ├── actions/                   # Validated Server Actions (auth, devices, donations, impact, orgs, projects, safeguarding, volunteers)
│   ├── globals.css                # Semantic CSS tokens & typography
│   ├── layout.tsx                 # Root layout with Safeguarding banner & Navbar
│   ├── page.tsx                   # Editorial product landing page & protocol diagram
│   ├── projects/                  # Project discovery marketplace & project dossiers
│   ├── donate-device/page.tsx     # 5-step hardware intake & public tracking query
│   ├── needs/page.tsx             # Hardware & volunteer needs directory
│   ├── organizations/page.tsx     # Directory of verified NGO partners
│   ├── volunteer/                 # Volunteer portal & onboarding wizard
│   ├── safeguarding/page.tsx      # Child protection policy & confidential reporting
│   ├── how-it-works/page.tsx      # Refurbishment & deployment explainer
│   ├── impact/page.tsx            # Aggregate verified impact metrics
│   ├── dashboard/                 # Authenticated donor & volunteer portal
│   ├── ngo/                       # NGO operational management portal
│   └── admin/                     # Administrative command center & audit logs
├── components/                    # Accessible UI components (cards, modals, timelines, nav)
├── lib/
│   ├── crypto-id.ts               # High-entropy CSPRNG identifiers
│   ├── device-lifecycle.ts        # Validated hardware state machine
│   ├── dtos/                      # Zero-PII public Data Transfer Objects
│   ├── env.ts                     # Strict Zod environment validation layer
│   ├── payments/                  # Payment gateway abstraction (Razorpay/Stripe)
│   ├── rate-limit.ts              # Sliding-window token bucket rate limiter
│   ├── validations.ts             # Zod input schemas
│   ├── types.ts                   # Domain type definitions
│   └── supabase/                  # Server and client Supabase SSR instances
├── supabase/
│   └── migrations/                # PostgreSQL schema & production hardening RLS migrations
└── tests/                         # Vitest test suite (38/38 passing)
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in genuine Supabase credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SAFEGUARDING_EMAIL=safeguarding@desilearncode.org
```
*Note: `lib/env.ts` actively rejects dummy `placeholder-project` values.*

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Typecheck & Lint
```bash
npx tsc --noEmit
npm run lint
```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 7. Compile Production Build
```bash
npm run build
```

---

## 🔒 Security & Data Ethics Standard

- [x] **No Hardcoded Secrets**: Zero tracked secrets in repository; `.env.local.backup` removed.
- [x] **Zero Beneficiary PII**: No minor names, contact info, or identifying imagery stored.
- [x] **NIST SP 800-88 Guidance**: Hardware data sanitization follows NIST guidance.
- [x] **Pledges Separated From Settled Funds**: Pledges do not increment `projects.current_value`.
- [x] **High-Entropy Tokens**: Cryptographic random generation for tracking and receipts.
- [x] **Immutable Audit Trails**: `audit_logs` protected against `UPDATE` and `DELETE` at the database level.
- [x] **Tenant Isolation**: NGO users cannot mutate projects or data belonging to another NGO.
- [x] **Sliding-Window Rate Limiting**: Abuse protection on public intake endpoints.
