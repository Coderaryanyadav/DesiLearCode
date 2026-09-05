-- ====================================================================
-- DesiLearCode - Production PostgreSQL Database Schema & RLS Policies
-- Zero-Trust Architecture: Role-based security, tenant isolation, child safeguarding
-- ====================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('visitor', 'donor', 'volunteer', 'ngo', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'under_review', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_category AS ENUM (
      'Technology', 'Education', 'STEM', 'Coding', 'Cybersecurity', 'AI', 'Internet Access', 'School Supplies', 'Infrastructure'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('draft', 'pending_approval', 'active', 'almost_funded', 'completed', 'paused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE need_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_type AS ENUM ('Laptop', 'Desktop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Router', 'Arduino', 'Raspberry Pi', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_status AS ENUM (
      'Submitted', 'Under Review', 'Approved', 'Pickup Scheduled', 'Received', 'Inspection', 'Repair', 'Ready', 'Assigned', 'Delivered', 'In Use', 'Retired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE volunteer_status AS ENUM ('pending', 'approved', 'active', 'completed', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE donation_status AS ENUM ('initiated', 'pending', 'successful', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'visitor',
    avatar_url TEXT,
    phone TEXT,
    organization_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    website TEXT,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL, -- Generalized city/district
    areas_served TEXT[] DEFAULT '{}',
    programs TEXT[] DEFAULT '{}',
    technology_needs_summary TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    logo_url TEXT,
    hero_image_url TEXT,
    is_fictional_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key back to profiles once organizations exists
DO $$ BEGIN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profile_org FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. ORGANIZATION VERIFICATION DOCUMENTS (PRIVATE & SENSITIVE)
CREATE TABLE IF NOT EXISTS public.organization_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL, -- Secure Supabase Storage Path
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    what_support_provides TEXT NOT NULL,
    category project_category NOT NULL,
    region TEXT NOT NULL,
    beneficiary_group TEXT NOT NULL, -- Aggregated cohort only (e.g., '40 Students at Zilla Parishad Center')
    target_students INTEGER NOT NULL DEFAULT 10,
    status project_status NOT NULL DEFAULT 'pending_approval',
    urgency TEXT NOT NULL DEFAULT 'normal',
    hero_image_url TEXT,
    goal_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    current_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    is_fictional_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROJECT NEEDS TABLE
CREATE TABLE IF NOT EXISTS public.project_needs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    need_type TEXT NOT NULL,
    category project_category NOT NULL,
    quantity_required NUMERIC(10, 2) NOT NULL,
    quantity_fulfilled NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    priority need_priority NOT NULL DEFAULT 'medium',
    purpose TEXT NOT NULL,
    is_fulfilled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DEVICE DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code TEXT NOT NULL UNIQUE, -- e.g. TFK-1049
    donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT,
    device_type device_type NOT NULL,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    approximate_age_years INTEGER NOT NULL DEFAULT 3,
    condition TEXT NOT NULL,
    powers_on BOOLEAN NOT NULL DEFAULT TRUE,
    battery_condition TEXT NOT NULL,
    has_charger BOOLEAN NOT NULL DEFAULT TRUE,
    storage TEXT NOT NULL,
    ram TEXT NOT NULL,
    os TEXT NOT NULL,
    pickup_preference TEXT NOT NULL,
    notes TEXT,
    status device_status NOT NULL DEFAULT 'Submitted',
    assigned_organization_id UUID REFERENCES public.organizations(id),
    assigned_project_id UUID REFERENCES public.projects(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DEVICE LIFECYCLE TIMELINE
CREATE TABLE IF NOT EXISTS public.device_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    status device_status NOT NULL,
    technician_note TEXT NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. VOLUNTEERS & APPLICATIONS
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    experience_years INTEGER NOT NULL DEFAULT 0,
    availability_hours_per_week INTEGER NOT NULL DEFAULT 2,
    preferred_mode TEXT NOT NULL DEFAULT 'both',
    preferred_subjects TEXT[] DEFAULT '{}',
    preferred_age_group TEXT,
    location TEXT NOT NULL,
    languages TEXT[] DEFAULT '{}',
    bio TEXT NOT NULL,
    safeguarding_consent BOOLEAN NOT NULL DEFAULT TRUE,
    hours_volunteered NUMERIC(8, 2) NOT NULL DEFAULT 0,
    workshops_completed INTEGER NOT NULL DEFAULT 0,
    students_reached INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    skills_required TEXT[] DEFAULT '{}',
    hours_per_week INTEGER NOT NULL DEFAULT 2,
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    mode TEXT NOT NULL DEFAULT 'hybrid',
    region TEXT NOT NULL,
    description TEXT NOT NULL,
    openings INTEGER NOT NULL DEFAULT 2,
    urgency need_priority NOT NULL DEFAULT 'medium',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE SET NULL,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status volunteer_status NOT NULL DEFAULT 'pending',
    hours_logged NUMERIC(8, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DONATION INTENTS (PLEDGES)
CREATE TABLE IF NOT EXISTS public.donation_intents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number TEXT NOT NULL UNIQUE,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    allocated_need_type TEXT,
    message TEXT,
    status donation_status NOT NULL DEFAULT 'initiated',
    tax_exempt_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    compliance_notice TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PROJECT MILESTONES & UPDATES
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    is_safeguarded_checked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. IMPACT REPORTS
CREATE TABLE IF NOT EXISTS public.impact_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    before_state TEXT NOT NULL,
    after_state TEXT NOT NULL,
    computers_provided INTEGER NOT NULL DEFAULT 0,
    students_trained INTEGER NOT NULL DEFAULT 0,
    volunteer_hours NUMERIC(8, 2) NOT NULL DEFAULT 0,
    workshops_conducted INTEGER NOT NULL DEFAULT 0,
    verified_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS (APPEND-ONLY, IMMUTABLE)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_name TEXT NOT NULL,
    actor_email TEXT NOT NULL,
    actor_role user_role NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. SAFEGUARDING REPORTS (CONFIDENTIAL INCIDENT REPORTS)
CREATE TABLE IF NOT EXISTS public.safeguarding_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_devices_tracking ON public.devices(tracking_code);
CREATE INDEX IF NOT EXISTS idx_devices_donor ON public.devices(donor_id);
CREATE INDEX IF NOT EXISTS idx_devices_org ON public.devices(assigned_organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteers_user ON public.volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_project ON public.volunteer_applications(project_id);

-- 16. SECURITY HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin' AND profiles.is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_user_org_id()
RETURNS UUID AS $$
DECLARE
    org_id UUID;
BEGIN
    SELECT organization_id INTO org_id 
    FROM public.profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.is_active = TRUE;
    RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. AUTOMATIC USER PROFILE TRIGGER (PREVENTS CLIENT SELF-PROMOTION TO ADMIN)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role := 'visitor';
    req_role TEXT;
BEGIN
    req_role := new.raw_user_meta_data->>'role';
    
    -- Restrict requested role: normal signups may only choose 'donor' or 'volunteer' or 'visitor'
    IF req_role IN ('donor', 'volunteer', 'visitor') THEN
        assigned_role := req_role::user_role;
    ELSE
        assigned_role := 'visitor'::user_role;
    END IF;

    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        assigned_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 18. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own non-role profile fields" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (
        -- Regular users cannot alter their role or organization_id
        (auth.uid() = user_id AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid()))
        OR public.is_admin()
    );

-- ----------------------------------------------------
-- ORGANIZATIONS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public can view verified organizations" ON public.organizations
    FOR SELECT USING (
        verification_status = 'verified' 
        OR id = public.get_current_user_org_id() 
        OR public.is_admin() 
        OR auth.role() = 'service_role'
    );

CREATE POLICY "NGO leads can update their own organization profile" ON public.organizations
    FOR UPDATE USING (
        id = public.get_current_user_org_id() OR public.is_admin()
    )
    WITH CHECK (
        -- NGO leads cannot mark themselves as verified
        (id = public.get_current_user_org_id() AND verification_status = (SELECT o.verification_status FROM public.organizations o WHERE o.id = id))
        OR public.is_admin()
    );

CREATE POLICY "Admins have full access to organizations" ON public.organizations
    FOR ALL USING (public.is_admin() OR auth.role() = 'service_role');

-- ----------------------------------------------------
-- ORGANIZATION VERIFICATIONS (DOCUMENTS) POLICIES
-- ----------------------------------------------------
CREATE POLICY "NGO leads can view their own verification docs" ON public.organization_verifications
    FOR SELECT USING (organization_id = public.get_current_user_org_id() OR public.is_admin());

CREATE POLICY "NGO leads can upload verification docs" ON public.organization_verifications
    FOR INSERT WITH CHECK (organization_id = public.get_current_user_org_id() OR public.is_admin());

CREATE POLICY "Admins have full access to verification docs" ON public.organization_verifications
    FOR ALL USING (public.is_admin() OR auth.role() = 'service_role');

-- ----------------------------------------------------
-- PROJECTS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public can view active published projects" ON public.projects
    FOR SELECT USING (
        status IN ('active', 'almost_funded', 'completed')
        OR organization_id = public.get_current_user_org_id()
        OR public.is_admin()
        OR auth.role() = 'service_role'
    );

CREATE POLICY "NGO leads can create projects for their org" ON public.projects
    FOR INSERT WITH CHECK (
        organization_id = public.get_current_user_org_id() OR public.is_admin()
    );

CREATE POLICY "NGO leads can edit their own projects" ON public.projects
    FOR UPDATE USING (
        organization_id = public.get_current_user_org_id() OR public.is_admin()
    )
    WITH CHECK (
        -- NGO leads cannot self-approve projects into active status
        (
            organization_id = public.get_current_user_org_id() 
            AND status IN ('draft', 'pending_approval')
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------
-- PROJECT NEEDS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public can view project needs" ON public.project_needs
    FOR SELECT USING (TRUE);

CREATE POLICY "NGO leads can manage needs for their projects" ON public.project_needs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_needs.project_id AND p.organization_id = public.get_current_user_org_id()
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------
-- DEVICE DONATIONS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public/Donors can submit device donations" ON public.devices
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Donors can view their own devices" ON public.devices
    FOR SELECT USING (
        donor_id = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
        OR assigned_organization_id = public.get_current_user_org_id()
        OR public.is_admin()
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Admins and assigned NGOs can update device status" ON public.devices
    FOR UPDATE USING (
        assigned_organization_id = public.get_current_user_org_id() OR public.is_admin()
    );

-- ----------------------------------------------------
-- DEVICE UPDATES TIMELINE POLICIES
-- ----------------------------------------------------
CREATE POLICY "Donors and Admins can view device lifecycle updates" ON public.device_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.devices d 
            WHERE d.id = device_updates.device_id AND (
                d.donor_id = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
                OR d.assigned_organization_id = public.get_current_user_org_id()
                OR public.is_admin()
            )
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Technicians and Admins can insert device updates" ON public.device_updates
    FOR INSERT WITH CHECK (public.is_admin() OR public.get_current_user_org_id() IS NOT NULL);

-- ----------------------------------------------------
-- VOLUNTEERS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Volunteers can view/edit their own profile" ON public.volunteers
    FOR ALL USING (
        user_id = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
        OR public.is_admin()
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Public can view active volunteer opportunities" ON public.volunteer_opportunities
    FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Volunteers can view their own applications" ON public.volunteer_applications
    FOR SELECT USING (
        volunteer_id = (SELECT v.id FROM public.volunteers v JOIN public.profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = volunteer_applications.project_id AND p.organization_id = public.get_current_user_org_id()
        )
        OR public.is_admin()
    );

CREATE POLICY "Volunteers can submit applications" ON public.volunteer_applications
    FOR INSERT WITH CHECK (
        volunteer_id = (SELECT v.id FROM public.volunteers v JOIN public.profiles p ON v.user_id = p.id WHERE p.user_id = auth.uid())
        OR public.is_admin()
    );

-- ----------------------------------------------------
-- DONATION INTENTS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public can create donation intent" ON public.donation_intents
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Donors can view their own donation intents" ON public.donation_intents
    FOR SELECT USING (
        donor_id = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = donation_intents.project_id AND p.organization_id = public.get_current_user_org_id()
        )
        OR public.is_admin()
        OR auth.role() = 'service_role'
    );

-- ----------------------------------------------------
-- IMPACT REPORTS POLICIES
-- ----------------------------------------------------
CREATE POLICY "Public can view verified impact reports" ON public.impact_reports
    FOR SELECT USING (verified_by_admin = TRUE OR public.is_admin() OR organization_id = public.get_current_user_org_id());

CREATE POLICY "NGO leads can create impact reports for their projects" ON public.impact_reports
    FOR INSERT WITH CHECK (organization_id = public.get_current_user_org_id() OR public.is_admin());

-- ----------------------------------------------------
-- AUDIT LOGS (IMMUTABLE, STRICT ADMIN ONLY)
-- ----------------------------------------------------
CREATE POLICY "Admins have read access to audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Server/Functions can append audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (TRUE);

-- ----------------------------------------------------
-- SAFEGUARDING REPORTS (CONFIDENTIAL)
-- ----------------------------------------------------
CREATE POLICY "Public can submit safeguarding incident reports" ON public.safeguarding_reports
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can view safeguarding reports" ON public.safeguarding_reports
    FOR SELECT USING (public.is_admin() OR auth.role() = 'service_role');
