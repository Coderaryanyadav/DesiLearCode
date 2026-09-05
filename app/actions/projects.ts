'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ProjectStatus } from '@/lib/types';
import { ProjectCreationSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  // Look up user profile & org
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'ngo' && profile.role !== 'admin')) {
    return { error: 'Forbidden. Only registered NGO representatives or administrators can create projects.' };
  }

  if (!profile.organization_id && profile.role !== 'admin') {
    return { error: 'User does not belong to an active organization.' };
  }

  const payload = {
    title: formData.get('title') as string,
    tagline: formData.get('tagline') as string,
    description: formData.get('description') as string,
    whyItMatters: formData.get('whyItMatters') as string,
    whatSupportProvides: formData.get('whatSupportProvides') as string,
    category: formData.get('category') as any,
    region: formData.get('region') as string,
    beneficiaryGroup: formData.get('beneficiaryGroup') as string,
    targetStudents: Number(formData.get('targetStudents')),
    goalValue: Number(formData.get('goalValue')),
    heroImageUrl: (formData.get('heroImageUrl') as string) || undefined,
  };

  const validation = ProjectCreationSchema.safeParse(payload);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || 'Validation failed.' };
  }

  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      organization_id: profile.organization_id,
      slug,
      title: payload.title,
      tagline: payload.tagline,
      description: payload.description,
      why_it_matters: payload.whyItMatters,
      what_support_provides: payload.whatSupportProvides,
      category: payload.category,
      region: payload.region,
      beneficiary_group: payload.beneficiaryGroup,
      target_students: payload.targetStudents,
      goal_value: payload.goalValue,
      hero_image_url: payload.heroImageUrl,
      status: 'pending_approval' as ProjectStatus,
    })
    .select()
    .single();

  if (error || !project) {
    return { error: error?.message || 'Failed to create project.' };
  }

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'PROJECT_CREATED',
    targetType: 'project',
    targetId: project.id,
    details: `Project "${project.title}" created and submitted for administrative approval.`,
  });

  revalidatePath('/ngo/projects');
  revalidatePath('/projects');
  return { success: true, project };
}

export async function updateProjectStatus(projectId: string, newStatus: ProjectStatus, reason?: string) {
  const supabase = await createClient();

  // Admin Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden. Administrative privileges required to change project status.' };
  }

  const { error } = await supabase
    .from('projects')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', projectId);

  if (error) {
    return { error: error.message };
  }

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'PROJECT_STATUS_UPDATED',
    targetType: 'project',
    targetId: projectId,
    details: `Project status updated to ${newStatus}.${reason ? ` Reason: ${reason}` : ''}`,
  });

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/ngo/projects');
  return { success: true };
}

export async function addProjectMilestone(projectId: string, title: string, description: string, targetDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found.' };

  const { error } = await supabase
    .from('project_milestones')
    .insert({
      project_id: projectId,
      title,
      description,
      target_date: targetDate,
    });

  if (error) return { error: error.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'PROJECT_MILESTONE_ADDED',
    targetType: 'project',
    targetId: projectId,
    details: `Added milestone: "${title}"`,
  });

  revalidatePath(`/projects`);
  revalidatePath(`/ngo/projects/${projectId}`);
  return { success: true };
}

export async function addProjectUpdate(projectId: string, title: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found.' };

  // Child Safeguarding Check on update text
  const lower = (title + ' ' + content).toLowerCase();
  const suspiciousPii = /\b(grade \d|age \d{1,2}|phone|aadhar|passport|minor|child name:)\b/i;
  if (suspiciousPii.test(lower)) {
    return { error: 'Safeguarding Guard: Content may contain identifiable child details. Please describe aggregate outcomes only.' };
  }

  const { error } = await supabase
    .from('project_updates')
    .insert({
      project_id: projectId,
      title,
      content,
      author_id: profile.id,
      is_safeguarded_checked: true,
    });

  if (error) return { error: error.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'PROJECT_UPDATE_POSTED',
    targetType: 'project',
    targetId: projectId,
    details: `Posted project update: "${title}"`,
  });

  revalidatePath(`/projects`);
  return { success: true };
}
