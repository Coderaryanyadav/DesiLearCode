-- ====================================================================
-- DESILEARCODE: 2026 PRODUCTION SECURITY & RLS HARDENING MIGRATION
-- ====================================================================

-- 1. HARDEN DEVICE DONATION INSERT POLICY
-- Prevent anonymous or untrusted callers from self-assigning organizations,
-- projects, or non-initial lifecycle states.
DROP POLICY IF EXISTS "Public/Donors can submit device donations" ON public.devices;
CREATE POLICY "Public/Donors can submit device donations" ON public.devices
    FOR INSERT WITH CHECK (
        status = 'Submitted' 
        AND assigned_organization_id IS NULL 
        AND assigned_project_id IS NULL
    );

-- 2. HARDEN USER PROFILE UPDATE POLICY
-- Users cannot self-escalate role, change organization affiliation, or tamper with account status
DROP POLICY IF EXISTS "Users can update their own non-role profile fields" ON public.profiles;
CREATE POLICY "Users can update their own non-role profile fields" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (
        (
            auth.uid() = user_id 
            AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid())
            AND organization_id IS NOT DISTINCT FROM (SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid())
            AND is_active = (SELECT p.is_active FROM public.profiles p WHERE p.user_id = auth.uid())
        )
        OR public.is_admin()
    );

-- 3. IMMUTABILITY OF AUDIT LOGS
-- Ensure audit logs are strictly append-only. Revoke UPDATE and DELETE for all public roles.
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon, public;

DROP POLICY IF EXISTS "Admins have read access to audit logs" ON public.audit_logs;
CREATE POLICY "Admins have read access to audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin() OR auth.role() = 'service_role');

-- 4. HARDEN DONATION INTENT INSERTION
-- Ensure public donation submissions cannot inject successful settlement state
DROP POLICY IF EXISTS "Public can create donation intent" ON public.donation_intents;
CREATE POLICY "Public can create donation intent" ON public.donation_intents
    FOR INSERT WITH CHECK (
        status IN ('pledged', 'pending', 'initiated')
    );

-- 5. STATUTORY TAX EXEMPTION DEFAULT ADJUSTMENT
-- Remove blanket default true; eligibility requires verified 12A/80G filings
ALTER TABLE public.donation_intents ALTER COLUMN tax_exempt_eligible SET DEFAULT FALSE;

-- 6. STRICT SAFEGUARDING CONFIDENTIALITY
-- Only platform safety administrators can view safeguarding incident reports
DROP POLICY IF EXISTS "Only admins can view safeguarding reports" ON public.safeguarding_reports;
CREATE POLICY "Only admins can view safeguarding reports" ON public.safeguarding_reports
    FOR SELECT USING (public.is_admin() OR auth.role() = 'service_role');

REVOKE UPDATE, DELETE ON public.safeguarding_reports FROM authenticated, anon, public;
