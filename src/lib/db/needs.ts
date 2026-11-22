import { createClient } from '@/lib/supabase/server';
import { NeedItem } from '@/lib/types';

export async function getOpenNeeds(): Promise<NeedItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_needs')
    .select(`
      *,
      projects:project_id (
        id,
        title,
        status,
        organization_id,
        organizations:organization_id (
          name
        )
      )
    `)
    .order('priority', { ascending: false });

  if (error || !data) {
    return [];
  }

  // Filter only needs belonging to active projects
  return data
    .filter((row: any) => row.projects && (row.projects.status === 'active' || row.projects.status === 'almost_funded'))
    .map((row: any) => ({
      id: row.id,
      projectId: row.project_id,
      projectTitle: row.projects?.title || 'Tech Education Project',
      organizationId: row.projects?.organization_id || '',
      organizationName: row.projects?.organizations?.name || 'Partner Organization',
      title: row.title,
      type: row.need_type,
      category: row.category,
      quantityRequired: Number(row.quantity_required),
      quantityFulfilled: Number(row.quantity_fulfilled || 0),
      unit: row.unit,
      priority: row.priority,
      purpose: row.purpose,
      fulfilled: row.is_fulfilled,
    }));
}
