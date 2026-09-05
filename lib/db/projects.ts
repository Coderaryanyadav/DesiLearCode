import { createClient } from '@/lib/supabase/server';
import { Project, NeedItem, ProjectMilestone, ProjectUpdate } from '@/lib/types';

export async function getPublicProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organizations:organization_id (
        id,
        name,
        verification_status
      ),
      project_needs (*),
      project_milestones (*),
      project_updates (*)
    `)
    .in('status', ['active', 'almost_funded', 'completed'])
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapProjectRow(row));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organizations:organization_id (
        id,
        name,
        verification_status
      ),
      project_needs (*),
      project_milestones (*),
      project_updates (*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapProjectRow(data);
}

export async function getProjectsForOrg(orgId: string): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organizations:organization_id (
        id,
        name,
        verification_status
      ),
      project_needs (*),
      project_milestones (*),
      project_updates (*)
    `)
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapProjectRow(row));
}

export async function getAllProjectsForAdmin(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      organizations:organization_id (
        id,
        name,
        verification_status
      ),
      project_needs (*),
      project_milestones (*),
      project_updates (*)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapProjectRow(row));
}

function mapProjectRow(row: any): Project {
  const needs: NeedItem[] = (row.project_needs || []).map((n: any) => ({
    id: n.id,
    projectId: n.project_id,
    projectTitle: row.title,
    organizationId: row.organization_id,
    organizationName: row.organizations?.name || 'Partner Organization',
    title: n.title,
    type: n.need_type,
    category: n.category,
    quantityRequired: Number(n.quantity_required),
    quantityFulfilled: Number(n.quantity_fulfilled || 0),
    unit: n.unit,
    priority: n.priority,
    purpose: n.purpose,
    fulfilled: n.is_fulfilled,
  }));

  const milestones: ProjectMilestone[] = (row.project_milestones || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    targetDate: m.target_date,
    completed: m.is_completed,
    completedAt: m.completed_at,
  }));

  const updates: ProjectUpdate[] = (row.project_updates || []).map((u: any) => ({
    id: u.id,
    projectId: u.project_id,
    title: u.title,
    content: u.content,
    postedAt: u.created_at,
    authorName: 'Project Lead',
    isSafeguardedChecked: u.is_safeguarded_checked,
  }));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline || '',
    description: row.description,
    whyItMatters: row.why_it_matters || '',
    whatSupportProvides: row.what_support_provides || '',
    organizationId: row.organization_id,
    organizationName: row.organizations?.name || 'Partner Organization',
    organizationVerified: row.organizations?.verification_status === 'verified',
    category: row.category,
    region: row.region || 'General Region',
    beneficiaryGroup: row.beneficiary_group || 'Aggregated cohort of students',
    targetStudents: Number(row.target_students || 0),
    status: row.status,
    urgency: row.urgency || 'normal',
    heroImageUrl: row.hero_image_url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    goalValue: Number(row.goal_value || 0),
    currentValue: Number(row.current_value || 0),
    progressPercentage: Number(row.progress_percentage || 0),
    needs,
    milestones,
    updates,
    impactSummary: {
      studentsReached: Number(row.target_students || 0),
      computersInstalled: needs.filter(n => n.type === 'laptop' || n.type === 'desktop').reduce((acc, curr) => acc + curr.quantityFulfilled, 0),
      volunteerHoursLogged: 0,
      workshopsConducted: milestones.filter(m => m.completed).length,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isFictionalDemo: row.is_fictional_demo || false,
  };
}
