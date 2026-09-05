# DESILEARCODE — PRODUCTION BACKEND SECURITY MATRIX & REALITY AUDIT

**Date**: September 5, 2026  
**Auditor**: Antigravity Autonomous Security Verification Engine  
**Platform**: DesiLearCode Core Platform  
**Target Environment**: Production / Staging  

---

## 1. COMPREHENSIVE SECURITY MATRIX

| Area | Expected | Implementation | Test | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication Enforcement** | All private mutations require authenticated Supabase session | `createClient().auth.getUser()` asserted at entry in all 8 Server Actions in `app/actions/` | `tests/security.test.ts` (unauthenticated rejected) | **PASS** |
| **Role Escalation Prevention** | Users cannot self-assign `role = 'admin'` or `role = 'ngo'` | RLS `WITH CHECK` on `public.profiles` prevents `role`, `organization_id`, and `is_active` mutation | `tests/security_expanded.test.ts`, `tests/backend_verification.test.ts` | **PASS** |
| **NGO Application Gate** | Registering an NGO must NOT elevate user to `ngo` role until admin approval | `app/actions/organizations.ts`: `verification_status = 'pending'`, user role remains `'donor'` | `tests/backend_verification.test.ts` ("Organization Verification") | **PASS** |
| **Cross-Tenant NGO Isolation** | NGO A cannot mutate NGO B's projects, needs, milestones, or updates | Server Actions assert `project.organization_id === profile.organization_id` & RLS checks `get_current_user_org_id()` | `tests/security_expanded.test.ts`, `tests/backend_verification.test.ts` | **PASS** |
| **Device Lifecycle State Machine** | Disallow illegal transitions (e.g. `Submitted` -> `In Use` direct jump) | `lib/device-lifecycle.ts` (`VALID_DEVICE_TRANSITIONS`) and `app/actions/devices.ts` | `tests/backend_verification.test.ts`, `tests/device_lifecycle.test.ts` | **PASS** |
| **Device Role Authorization** | Only admins or assigned NGOs can modify hardware state | `app/actions/devices.ts` checks role and verifies `device.assigned_organization_id === profile.organization_id` | `tests/backend_verification.test.ts` ("Device Lifecycle State Machine") | **PASS** |
| **Device Tracking Zero-PII** | Public tracking code reveals NO donor name, email, phone, or internal notes | `lib/dtos/index.ts` (`toPublicDeviceTracking`) filters out all PII and replaces private staff notes with safe summaries | `tests/dtos.test.ts`, `tests/backend_verification.test.ts` | **PASS** |
| **Pledge vs Settled Separation** | Pledges must NEVER increase `projects.current_value` or issue fake settled receipts | `app/actions/donations.ts`: status forced to `'pledged'`, `current_value` NOT incremented; `lib/payments/` returns `NOT_CONFIGURED` | `tests/backend_verification.test.ts` ("Project Funding Separation") | **PASS** |
| **Need Progress Determinism** | Progress formula `remaining = max(required - secured, 0)` is strictly deterministic | `app/actions/projects.ts` (`addProjectNeed`, `recordNeedAllocation`) rejects browser-supplied fulfillment | `tests/backend_verification.test.ts` ("Project Need Progress") | **PASS** |
| **Child Safeguarding Privacy** | Zero individual child records in DB; reports accessible exclusively to safety admins | Aggregate cohort metrics only (`target_students`, `beneficiary_group`). `safeguarding_reports` restricted to `admin` | `tests/security_expanded.test.ts`, `tests/backend_verification.test.ts` | **PASS** |
| **NIST SP 800-88 Copy Integrity** | No unverified claims of "NIST certified"; strictly "aligned with guidance" | Entire repository searched and cleaned (`Footer.tsx`, `HomeView.tsx`, `donate-device/page.tsx`) | Repo-wide ripgrep: 0 unverified claims | **PASS** |
| **Identifier Entropy** | Eliminate pseudo-random generators (`Math.random()`, `Date.now()` IDs) | Cryptographically secure CSPRNG (`crypto.randomBytes`) in `lib/crypto-id.ts` | `tests/dtos.test.ts`, `tests/backend_verification.test.ts` | **PASS** |
| **Audit Log Immutability** | Audit logs are strictly append-only; no modification or deletion permitted | `REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon, public;` | Migration `20260101000000_production_hardening.sql` | **PASS** |
| **Controlled Error Boundaries** | Database failures trigger controlled fallback states rather than silent empty arrays | `app/error.tsx` and `app/not-found.tsx` deployed for controlled error presentation | Manual verification & build trace inspection | **PASS** |

---

## 2. TABLE-BY-TABLE ROW LEVEL SECURITY (RLS) MATRIX

Every table in the PostgreSQL database has Row Level Security explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

| Table Name | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
| :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | `auth.uid() = user_id OR public.is_admin()` | Trigger `on_auth_user_created` (DB trigger) | `auth.uid() = user_id` WITH CHECK (`role`, `org_id`, `is_active` immutable) OR `is_admin()` | Admin only |
| **`organizations`** | Public: `verification_status = 'verified'`; Admins & Member NGOs: all | Public/Authenticated (`status = 'pending'`) | Assigned NGO (profile fields only) OR `is_admin()` | Admin only |
| **`organization_verifications`** | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` | Admin only | Admin only |
| **`projects`** | Public: `status IN ('active', 'almost_funded', 'completed')`; Admin & Owning NGO: all | Owning NGO OR `is_admin()` (`status = 'pending_approval'`) | Owning NGO (draft/pending only) OR `is_admin()` | Admin only |
| **`project_needs`** | Public: if parent project is published; Admin & Owning NGO: all | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` |
| **`project_milestones`** | Public: if parent project is published; Admin & Owning NGO: all | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` |
| **`project_updates`** | Public: if parent project is published; Admin & Owning NGO: all | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` |
| **`devices`** | Donors: own devices; Admins & Assigned NGOs: all | `status = 'Submitted'` AND `assigned_organization_id IS NULL` AND `assigned_project_id IS NULL` | Assigned NGO OR `is_admin()` (state-machine gated) | Admin only |
| **`device_updates`** | Donors: own devices; Admins & Assigned NGOs: all | Technicians / Admins | Disabled (Append-only) | Admin only |
| **`volunteers`** | Volunteer: own record OR `is_admin()` | Authenticated user (`user_id = auth.uid()`) | Volunteer: own record OR `is_admin()` | Admin only |
| **`volunteer_opportunities`** | Public: `status = 'open'`; Admin: all | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` | Owning NGO OR `is_admin()` |
| **`volunteer_applications`** | Volunteer: own record; Admin & Target NGO: all | Authenticated volunteer | Target NGO OR `is_admin()` | Admin only |
| **`donation_intents`** | Donors: own records; Admin & Beneficiary NGO: all | `status IN ('pledged', 'pending', 'initiated')` | Service role / Admin only | Admin only |
| **`impact_reports`** | Public: `verified_by_admin = TRUE`; Admin & Owning NGO: all | Owning NGO (`verified = FALSE`) OR `is_admin()` | Admin only (`verified_by_admin = TRUE`) | Admin only |
| **`audit_logs`** | Admins & Service Role only | `WITH CHECK (TRUE)` (Append-only) | **REVOKED** (`REVOKE UPDATE`) | **REVOKED** (`REVOKE DELETE`) |
| **`safeguarding_reports`** | Admins & Service Role only | `WITH CHECK (TRUE)` (Whistleblower intake) | Admin only | **REVOKED** (`REVOKE DELETE`) |

---

## 3. FORENSIC JUSTIFICATION OF `USING (TRUE)`, `WITH CHECK (TRUE)`, AND `FOR ALL`

Every occurrence in the migration scripts was forensically audited:

### A. `WITH CHECK (TRUE)`
1. **`audit_logs` INSERT (`WITH CHECK (TRUE)`)**:
   - **Justification**: System functions and Server Actions need to append audit log events across all actors (visitors, donors, volunteers, NGOs, admins) without blocking security auditing due to user session context.
   - **Safeguard**: Table-level `REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon, public;` guarantees records cannot be altered or removed once created.
2. **`safeguarding_reports` INSERT (`WITH CHECK (TRUE)`)**:
   - **Justification**: Whistleblowers, parents, volunteers, or victims must be able to file confidential safety incident reports without creating an account or authenticating first.
   - **Safeguard**: SELECT is strictly restricted to platform administrators (`public.is_admin() OR auth.role() = 'service_role'`). UPDATE and DELETE are revoked.

### B. `FOR ALL`
1. **`organizations` (`FOR ALL USING (public.is_admin() OR auth.role() = 'service_role')`)**:
   - **Justification**: Platform administrators require full moderation authority to verify, suspend, or manage organizations.
2. **`organization_verifications` (`FOR ALL USING (public.is_admin() OR auth.role() = 'service_role')`)**:
   - **Justification**: Verification review queue requires administrative processing.
3. **`project_needs` (`FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE ...))`)**:
   - **Justification**: Grants CRUD capabilities on needs strictly scoped to the NGO that owns the parent project.
4. **`project_milestones` & `project_updates` (`FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE ...))`)**:
   - **Justification**: NGO leads can manage roadmap milestones and field progress updates strictly scoped to their own projects.
5. **`volunteers` (`FOR ALL USING (auth.uid() = user_id OR public.is_admin())`)**:
   - **Justification**: Volunteers can manage their own profile and skills data.

---

## 4. AUDIT & TRACE OF EVERY NUMBER DISPLAYED IN THE UI

| Metric | UI Location | Server Action / Function | DB Query / Aggregation | Table & Column | Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Devices Received** | `HomeView.tsx` (L623) | `getPlatformImpactMetrics()` | `select('*', { count: 'exact', head: true })` | `devices` (row count) | **REAL DATABASE VALUE** |
| **Active Projects** | `HomeView.tsx` (L631) | `getPlatformImpactMetrics()` | `select('*', { count: 'exact', head: true })` | `projects` (row count) | **REAL DATABASE VALUE** |
| **Verified Organizations** | `HomeView.tsx` (L639) | `getPlatformImpactMetrics()` | `select('*', { count: 'exact', head: true }).eq('verification_status', 'verified')` | `organizations.verification_status` | **REAL DATABASE VALUE** |
| **Registered Mentors** | `HomeView.tsx` (L647) | `getPlatformImpactMetrics()` | `select('*', { count: 'exact', head: true })` | `volunteers` (row count) | **REAL DATABASE VALUE** |
| **Laptops Needed** | `ProjectDetailView.tsx` (L207) | `getProjectBySlug()` | `select(*, project_needs(*))` | `project_needs.quantity_required` | **REAL DATABASE VALUE** |
| **Laptops Secured** | `ProjectDetailView.tsx` (L208) | `getProjectBySlug()` | `select(*, project_needs(*))` | `project_needs.quantity_fulfilled` | **DERIVED DATABASE VALUE** |
| **Remaining Gap** | `ProjectDetailView.tsx` (L209) | `ProjectDetailView` | `max(quantity_required - quantity_fulfilled, 0)` | `project_needs` | **DERIVED DATABASE VALUE** |
| **Fulfillment %** | `ProjectDetailView.tsx` (L214) | `ProjectDetailView` | `round((quantity_fulfilled / quantity_required) * 100)` | `project_needs` | **DERIVED DATABASE VALUE** |
| **Target Students** | `ProjectDetailView.tsx` (L185) | `getProjectBySlug()` | `select(target_students)` | `projects.target_students` | **REAL DATABASE VALUE** |
| **Pledged Amount** | `ProjectDetailView.tsx` (L365) | `getProjectBySlug()` | `select(current_value, goal_value)` | `projects.current_value` | **REAL DATABASE VALUE** |
| **Students Reached** | `ProjectDetailView.tsx` (L332) | `getProjectBySlug()` | `SUM(students_trained)` WHERE `verified_by_admin = true` | `impact_reports.students_trained` | **REAL DATABASE VALUE** (Verified) |
| **Active Laptops** | `ProjectDetailView.tsx` (L336) | `getProjectBySlug()` | `SUM(quantity_fulfilled)` from hardware needs | `project_needs.quantity_fulfilled` | **DERIVED DATABASE VALUE** |
| **Mentor Hours** | `ProjectDetailView.tsx` (L340) | `getProjectBySlug()` | `SUM(volunteer_hours)` WHERE `verified_by_admin = true` | `impact_reports.volunteer_hours` | **REAL DATABASE VALUE** (Verified) |
| **Workshops Held** | `ProjectDetailView.tsx` (L344) | `getProjectBySlug()` | `SUM(workshops_conducted)` WHERE `verified_by_admin = true` | `impact_reports.workshops_conducted` | **REAL DATABASE VALUE** (Verified) |
| **Project Progress** | `ProjectDetailView.tsx` (L372) | `getProjectBySlug()` | `select(progress_percentage)` | `projects.progress_percentage` | **DERIVED DATABASE VALUE** |

---

## 5. TEST EVIDENCE & SUITE EXECUTION

Executed via `vitest run`:
```
Test Files  7 passed (7)
     Tests  54 passed (54)
  Duration  300ms
```

### Static Analysis & Build Verification:
- **TypeScript**: `npx tsc --noEmit` -> **0 errors**
- **ESLint**: `npm run lint` -> **0 errors**
- **Next.js Production Build**: `npm run build` -> **39/39 routes compiled successfully**

---

## 6. FINAL VERDICT

# **READY FOR STAGING**

### Justification:
1. **Zero-PII Enforcement**: Public tracking endpoint exposes strictly sanitized DTOs (`toPublicDeviceTracking`) with all personal donor information stripped and internal technician notes mapped to standardized public status summaries.
2. **True Financial Separation**: Pledges are explicitly classified as `PLEDGED (UNSETTLED INTENT)` and do NOT increment `projects.current_value`. Payment provider is safely unconfigured (`NOT_CONFIGURED`) with zero fictitious gateway settlement, zero fake tax receipts, and zero premature 80G tax claims.
3. **Deterministic Need Progress**: Need creation rejects client-supplied fulfillment quantities and server-enforces `quantity_fulfilled: 0`. Allocations are deterministic and bounded by `max(required - secured, 0)`.
4. **Authorized State Machine**: Device transitions strictly follow `VALID_DEVICE_TRANSITIONS` with full role authorization across Anonymous, Donor, Volunteer, NGO, and Admin roles.
5. **Verified Impact Ledgers**: Published impact metrics are aggregated strictly from admin-verified `impact_reports` (`verified_by_admin = true`), with complete elimination of unverified target student fallbacks.
6. **Next Step Before Full Production**: Connect live Razorpay / statutory banking gateway merchant keys and execute end-to-end banking settlement verification in the staging environment.
