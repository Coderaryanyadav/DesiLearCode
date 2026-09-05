'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ProjectStatus } from '@/lib/types';
import { ProjectCreationSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';

import { generateSecureSlugSuffix } from '@/lib/crypto-id';
import { checkRateLimit } from '@/lib/rate-limit';

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized. Please sign in.' };
  }

  // Rate Limiting (max 5 projects created per 10 minutes)
  const rateLimit = checkRateLimit({ identifier: `create_proj:${user.id}`, limit: 5, windowMs: 10 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { error: 'Project creation rate limit reached. Please wait a few minutes before submitting another project.' };
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

  // Cryptographically unique slug
  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + generateSecureSlugSuffix();

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

  // Tenant Isolation: Verify project belongs to user's organization
  const { data: targetProject, error: projErr } = await supabase
    .from('projects')
    .select('id, organization_id')
    .eq('id', projectId)
    .single();

  if (projErr || !targetProject) {
    return { error: 'Target project does not exist.' };
  }

  if (profile.role !== 'admin' && profile.organization_id !== targetProject.organization_id) {
    return { error: 'Forbidden: You do not have permission to manage milestones for this project.' };
  }

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
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found.' };

  // Tenant Isolation: Verify project belongs to user's organization
  const { data: targetProject, error: projErr } = await supabase
    .from('projects')
    .select('id, organization_id')
    .eq('id', projectId)
    .single();

  if (projErr || !targetProject) {
    return { error: 'Target project does not exist.' };
  }

  if (profile.role !== 'admin' && profile.organization_id !== targetProject.organization_id) {
    return { error: 'Forbidden: You do not have permission to publish updates for this project.' };
  }

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

export async function addProjectNeed(params: {
  projectId: string;
  title: string;
  needType: string;
  category: 'hardware' | 'connectivity' | 'infrastructure' | 'mentorship' | 'curriculum';
  quantityRequired: number;
  unit: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  purpose: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found.' };

  // Tenant Isolation: Verify project belongs to user's organization
  const { data: targetProject, error: projErr } = await supabase
    .from('projects')
    .select('id, organization_id')
    .eq('id', params.projectId)
    .single();

  if (projErr || !targetProject) {
    return { error: 'Target project does not exist.' };
  }

  if (profile.role !== 'admin' && profile.organization_id !== targetProject.organization_id) {
    return { error: 'Forbidden: You do not have permission to manage needs for this project.' };
  }

  // Server-side deterministic validation
  if (!params.title || !params.needType || !params.category || !params.unit || !params.purpose) {
    return { error: 'All need specification fields are required.' };
  }

  const cleanRequired = Math.floor(Number(params.quantityRequired));
  if (isNaN(cleanRequired) || cleanRequired < 1) {
    return { error: 'Required quantity must be a positive integer of at least 1.' };
  }

  // Enforce zero-initial fulfillment server-side (prevent client-supplied secured/fulfilled tampering)
  const { data: need, error } = await supabase
    .from('project_needs')
    .insert({
      project_id: params.projectId,
      title: params.title.trim(),
      need_type: params.needType.trim(),
      category: params.category,
      quantity_required: cleanRequired,
      quantity_fulfilled: 0, // FORCED: Cannot be manipulated by client requests
      unit: params.unit.trim(),
      priority: params.priority || 'medium',
      purpose: params.purpose.trim(),
      is_fulfilled: false,
    })
    .select()
    .single();

  if (error || !need) return { error: error?.message || 'Failed to add project need.' };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'PROJECT_NEED_ADDED',
    targetType: 'project',
    targetId: params.projectId,
    details: `Added need "${params.title}" (Required: ${cleanRequired} ${params.unit})`,
  });

  revalidatePath(`/projects`);
  revalidatePath(`/ngo/projects/${params.projectId}`);
  return { success: true, need };
}

export async function recordNeedAllocation(needId: string, quantityAllocated: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'ngo')) {
    return { error: 'Forbidden. Administrative or NGO credentials required.' };
  }

  const { data: existingNeed, error: fetchErr } = await supabase
    .from('project_needs')
    .select('*, projects:project_id(organization_id)')
    .eq('id', needId)
    .single();

  if (fetchErr || !existingNeed) {
    return { error: 'Project need not found.' };
  }

  if (profile.role !== 'admin' && profile.organization_id !== existingNeed.projects?.organization_id) {
    return { error: 'Forbidden: You do not have permission to manage needs for this project.' };
  }

  const cleanAllocated = Math.floor(Number(quantityAllocated));
  if (isNaN(cleanAllocated) || cleanAllocated <= 0) {
    return { error: 'Allocation quantity must be a positive number.' };
  }

  // Deterministic formula: remaining = max(required - secured, 0)
  const newFulfilled = existingNeed.quantity_fulfilled + cleanAllocated;
  if (newFulfilled > existingNeed.quantity_required) {
    return { 
      error: `Allocation exceeds required gap. Maximum allocatable is ${Math.max(existingNeed.quantity_required - existingNeed.quantity_fulfilled, 0)}.` 
    };
  }

  const isFulfilled = newFulfilled >= existingNeed.quantity_required;

  const { error: updateErr } = await supabase
    .from('project_needs')
    .update({
      quantity_fulfilled: newFulfilled,
      is_fulfilled: isFulfilled,
    })
    .eq('id', needId);

  if (updateErr) return { error: updateErr.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'NEED_ALLOCATION_RECORDED',
    targetType: 'project',
    targetId: existingNeed.project_id,
    details: `Allocated ${cleanAllocated} units to "${existingNeed.title}". New progress: ${newFulfilled}/${existingNeed.quantity_required}.`,
  });

  revalidatePath('/projects');
  return { success: true, quantityFulfilled: newFulfilled, isFulfilled };
}
