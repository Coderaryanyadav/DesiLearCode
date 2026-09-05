-- ====================================================================
-- DESILEARCODE: PROJECT SUBTABLES RLS POLICIES MIGRATION
-- ====================================================================

-- 1. POLICIES FOR PROJECT MILESTONES
DROP POLICY IF EXISTS "Public can view project milestones for active projects" ON public.project_milestones;
CREATE POLICY "Public can view project milestones for active projects" ON public.project_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_milestones.project_id 
            AND (p.status IN ('active', 'almost_funded', 'completed') OR public.is_admin() OR p.organization_id = public.get_current_user_org_id())
        )
    );

DROP POLICY IF EXISTS "NGO leads can manage milestones for their projects" ON public.project_milestones;
CREATE POLICY "NGO leads can manage milestones for their projects" ON public.project_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_milestones.project_id 
            AND (p.organization_id = public.get_current_user_org_id() OR public.is_admin())
        )
    );

-- 2. POLICIES FOR PROJECT UPDATES
DROP POLICY IF EXISTS "Public can view project updates for active projects" ON public.project_updates;
CREATE POLICY "Public can view project updates for active projects" ON public.project_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_updates.project_id 
            AND (p.status IN ('active', 'almost_funded', 'completed') OR public.is_admin() OR p.organization_id = public.get_current_user_org_id())
        )
    );

DROP POLICY IF EXISTS "NGO leads can manage updates for their projects" ON public.project_updates;
CREATE POLICY "NGO leads can manage updates for their projects" ON public.project_updates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_updates.project_id 
            AND (p.organization_id = public.get_current_user_org_id() OR public.is_admin())
        )
    );
