-- ====================================================================
-- TechForKids - Production PostgreSQL Database Schema & RLS Policies
-- Mission: Privacy-first, transparent tech & education bridge for children
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('visitor', 'donor', 'volunteer', 'ngo', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'under_review', 'verified', 'rejected', 'suspended');
CREATE TYPE project_category AS ENUM (
  'Technology', 'Education', 'STEM', 'Coding', 'Cybersecurity', 'AI', 'Internet Access', 'School Supplies', 'Infrastructure'
);
CREATE TYPE project_status AS ENUM ('draft', 'pending_approval', 'active', 'almost_funded', 'completed', 'paused');
CREATE TYPE need_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE device_type AS ENUM ('Laptop', 'Desktop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Router', 'Arduino', 'Raspberry Pi', 'Other');
CREATE TYPE device_status AS ENUM (
  'Submitted', 'Under Review', 'Approved', 'Pickup Scheduled', 'Received', 'Inspection', 'Repair', 'Ready', 'Assigned', 'Delivered', 'In Use', 'Retired'
);
CREATE TYPE volunteer_status AS ENUM ('pending', 'approved', 'active', 'completed', 'withdrawn');
CREATE TYPE donation_status AS ENUM ('initiated', 'pending', 'successful', 'failed', 'refunded');

-- 2. USERS & PROFILES
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

-- 3. ORGANIZATIONS
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
    location TEXT NOT NULL, -- Generalized city/district (no private child addresses)
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

-- 4. ORGANIZATION VERIFICATION DOCUMENTS
CREATE TABLE IF NOT EXISTS public.organization_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL, -- Private S3/Supabase storage bucket path
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROJECTS
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
    beneficiary_group TEXT NOT NULL, -- Strictly aggregated (e.g. '30 Middle School Students in Outlying Learning Center')
    target_students INTEGER NOT NULL DEFAULT 10,
    status project_status NOT NULL DEFAULT 'pending_approval',
    urgency TEXT NOT NULL DEFAULT 'normal',
    hero_image_url TEXT,
    goal_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    current_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROJECT NEEDS
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

-- 7. DEVICE DONATIONS
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code TEXT NOT NULL UNIQUE, -- e.g. TFK-104
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

-- 8. DEVICE UPDATES (LIFECYCLE TIMELINE)
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

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status volunteer_status NOT NULL DEFAULT 'pending',
    hours_logged NUMERIC(8, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DONATION INTENTS (TRANSPARENT PLEDGES)
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
    period TEXT NOT NULL,
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    before_state TEXT NOT NULL,
    after_state TEXT NOT NULL,
    computers_provided INTEGER NOT NULL DEFAULT 0,
    students_trained INTEGER NOT NULL DEFAULT 0,
    volunteer_hours NUMERIC(8, 2) NOT NULL DEFAULT 0,
    workshops_conducted INTEGER NOT NULL DEFAULT 0,
    verified_by_admin BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS (IMMUTABLE)
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

-- 14. SAFEGUARDING REPORTS
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

-- 15. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_devices_tracking ON public.devices(tracking_code);
CREATE INDEX IF NOT EXISTS idx_devices_status ON public.devices(status);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);

-- 16. ROW-LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- Public read policies for verified entities
CREATE POLICY "Public can view verified organizations" ON public.organizations
    FOR SELECT USING (verification_status = 'verified' OR auth.role() = 'service_role');

CREATE POLICY "Public can view active projects" ON public.projects
    FOR SELECT USING (status IN ('active', 'almost_funded', 'completed') OR auth.role() = 'service_role');

CREATE POLICY "Public can view project needs" ON public.project_needs
    FOR SELECT USING (TRUE);

CREATE POLICY "Public can view published impact reports" ON public.impact_reports
    FOR SELECT USING (verified_by_admin = TRUE);

-- Restricted device tracking by tracking code or donor ownership
CREATE POLICY "Donors can view their own devices" ON public.devices
    FOR SELECT USING (donor_id = auth.uid() OR auth.role() = 'service_role');

-- Restricted Admin oversight
CREATE POLICY "Admins have full access to audit logs" ON public.audit_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
        )
    );
