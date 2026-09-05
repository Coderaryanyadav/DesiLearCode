# TechForKids — Technology. Education. Opportunity.

**TechForKids** is a production-quality, privacy-first, transparent nonprofit technology platform designed to bridge the digital divide for vulnerable and orphaned children. It connects donors, software mentors, and companies with verified child-care institutions, providing refurbished hardware, coding education, robotics kits, and educational supplies.

---

## 🌟 Core Features

1. **Projects & Real-Time Needs Marketplace**
   - Itemized, tangible requirements (e.g. *3 Laptops Needed*, *2 Python Mentors*, *₹8,000 Refurbishment*, *Dual-Band Wi-Fi 6 Router*).
   - Dynamic progress bars, urgency tags, and aggregated target beneficiary metrics.
2. **End-to-End Device Donation Workflow**
   - Multi-step diagnostic intake (power check, RAM/SSD specs, battery health, charger).
   - Generates unique public tracking codes (e.g. `#TFK-104`, `#TFK-108`).
   - Visual 7-step lifecycle timeline (`Submitted` → `Approved` → `Received` → `Refurbished` → `Ready` → `Assigned` → `In Use`).
   - DoD 5220.22-M cryptographic data wiping pledge.
3. **Volunteer Mentorship Portal**
   - Onboarding form with skills taxonomy (Scratch, Python, Web Dev, Cyber Safety, Arduino).
   - Application tracking, session scheduling, and verified service hours logging.
4. **NGO Partner Portal**
   - Statutory credential management (12A/80G tax exemptions, trust deeds).
   - Project publishing wizard with admin moderation status (`pending_approval` → `active`).
   - Field updates & quarterly verified impact report submissions.
5. **Platform Administrator Command Center**
   - Non-profit statutory verification queue.
   - Project moderation & status transitions.
   - Hardware diagnostic review & dispatch updates.
   - Immutable audit log trail capturing actor, role, action, target, and timestamp.
6. **Child Safeguarding & Zero-PII Policy**
   - No individual child profiles or sensitive private records.
   - Strict aggregated statistical reporting (e.g. "30 Middle School Students").
   - Dedicated `/safeguarding` reporting channel.
7. **Transparent Financial Support**
   - Intent-based project support vouchers with instant 80G tax receipt generation.
   - Zero raw credit card or payment credential storage.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables design tokens, Lucide React icons
- **State & Data Layer**: Interactive In-Memory & LocalStorage Client Store (zero backend latency for instant testing) + Full PostgreSQL / Supabase Schema
- **Validation**: Zod Schemas
- **Testing**: Vitest

---

## 📁 Folder Structure

```
.
├── app/
│   ├── globals.css                # Custom theme variables & design tokens
│   ├── layout.tsx                 # Root layout with Safeguarding banner & Navbar
│   ├── page.tsx                   # 9-section high-converting landing page
│   ├── projects/
│   │   ├── page.tsx               # Searchable project marketplace
│   │   └── [slug]/page.tsx        # Comprehensive project detail view
│   ├── needs/page.tsx             # Live Needs Marketplace
│   ├── organizations/page.tsx     # Directory of verified non-profits
│   ├── volunteer/
│   │   ├── page.tsx               # Volunteer landing page
│   │   └── apply/page.tsx         # Volunteer onboarding wizard
│   ├── donate-device/page.tsx     # Hardware donation form & live tracker
│   ├── how-it-works/page.tsx      # Operational & refurbishment explainer
│   ├── impact/page.tsx            # Public impact dashboard & before/after reports
│   ├── safeguarding/page.tsx      # Child protection policy & report intake
│   ├── about/page.tsx             # Mission, vision, core principles
│   ├── contact/page.tsx           # Helpdesk & safeguarding hotline
│   ├── faq/page.tsx               # Frequently asked questions
│   ├── privacy/page.tsx           # Zero-PII privacy policy
│   ├── terms/page.tsx             # Terms & volunteer code of ethics
│   ├── login/page.tsx             # Sign in with 1-click demo personas
│   ├── register/page.tsx          # User registration
│   ├── dashboard/                 # Donor & Volunteer portal
│   ├── ngo/                       # NGO partner portal
│   └── admin/                     # Administrative command center
├── components/                    # Reusable, accessible UI components
├── lib/
│   ├── types.ts                   # Complete TypeScript domain definitions
│   ├── mock-data.ts               # Realistic ethical seed data
│   ├── store.tsx                  # Interactive store with persistence & audit logging
│   ├── auth-context.tsx           # Role switcher (Visitor, Donor, Volunteer, NGO, Admin)
│   └── validations.ts             # Zod validation schemas
├── supabase/
│   └── schema.sql                 # Production PostgreSQL schema, indexes, RLS policies
└── tests/
    └── validation.test.ts         # Vitest unit test suite
```

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🎭 Interactive Demo Personas

When running locally, you can switch perspectives at any moment using the **Role Switcher** in the top navigation bar or the 1-click demo buttons on `/login`:

- **Visitor**: Explore initiatives, view impact metrics, look up tracking codes.
- **Donor**: Pledge project contributions, donate devices, view 80G tax receipts.
- **Volunteer**: View mentor applications, schedule sessions, log teaching hours.
- **NGO Partner**: Create initiatives, publish hardware needs, post field updates.
- **Platform Admin**: Verify non-profit registration deeds, approve projects, transition hardware statuses, and inspect immutable audit logs.

---

## 🔒 Security & Child Safeguarding Checklist

- [x] **Zero-PII Enforcement**: No children's full names, home addresses, or contact information.
- [x] **Consent-Driven Storytelling**: Media requires authorized guardian and organizational consent.
- [x] **DoD Data Sanitization**: Cryptographic overwriting of donated hard drives before imaging.
- [x] **Statutory Vetting**: 80G/12A trust deeds audited before organizations can publish projects.
- [x] **Role-Based Authorization**: Distinct boundaries for donors, volunteers, NGOs, and admins.
- [x] **Immutable Audit Logs**: All state transitions and moderation decisions are logged with timestamps.
- [x] **Compliant Financial Architecture**: Transparent project intent vouchers without storing raw payment credentials.

---

## 🗺️ Future Roadmap

- Payment gateway webhooks (Stripe / Razorpay) for automated settlement reconciliation.
- Multi-lingual UI localization (Hindi, Marathi, Kannada, Tamil, Spanish).
- Direct courier API integration for automated doorstep pickup tracking.
- IoT telemetry for remote classroom computer lab health monitoring.
- Corporate CSR matching portal with customized employee volunteer batching.
