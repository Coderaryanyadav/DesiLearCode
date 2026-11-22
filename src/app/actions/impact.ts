'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function publishImpactReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'ngo')) {
    return { error: 'Forbidden. Admin or NGO representative credentials required.' };
  }

  const projectId = formData.get('projectId') as string;
  const period = formData.get('period') as string;
  const headline = formData.get('headline') as string;
  const summary = formData.get('summary') as string;
  const beforeState = formData.get('beforeState') as string;
  const afterState = formData.get('afterState') as string;
  const computersProvided = Number(formData.get('computersProvided') || 0);
  const studentsTrained = Number(formData.get('studentsTrained') || 0);
  const volunteerHours = Number(formData.get('volunteerHours') || 0);
  const workshopsConducted = Number(formData.get('workshopsConducted') || 0);

  if (!projectId || !period || !headline || !summary) {
    return { error: 'Please provide all required impact report fields.' };
  }

  // Child Safeguarding Text Check
  const combined = (headline + ' ' + summary + ' ' + beforeState + ' ' + afterState).toLowerCase();
  if (/\b(grade \d|age \d{1,2}|phone|minor|child name:)\b/i.test(combined)) {
    return { error: 'Safeguarding Alert: Individual child PII detected. Ensure reports strictly aggregate cohort data.' };
  }

  const { data: report, error } = await supabase
    .from('impact_reports')
    .insert({
      project_id: projectId,
      organization_id: profile.organization_id || null,
      period,
      headline,
      summary,
      before_state: beforeState,
      after_state: afterState,
      computers_provided: computersProvided,
      students_trained: studentsTrained,
      volunteer_hours: volunteerHours,
      workshops_conducted: workshopsConducted,
      verified_by_admin: profile.role === 'admin',
    })
    .select()
    .single();

  if (error || !report) return { error: error?.message || 'Failed to submit impact report.' };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'IMPACT_REPORT_PUBLISHED',
    targetType: 'project',
    targetId: projectId,
    details: `Impact report "${headline}" (${period}) created. Admin verified: ${profile.role === 'admin'}`,
  });

  revalidatePath('/impact');
  revalidatePath('/ngo/impact');
  return { success: true, report };
}

export async function verifyImpactReport(reportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden. Administrator credentials required to verify impact reports.' };
  }

  const { data: existing, error: fetchErr } = await supabase
    .from('impact_reports')
    .select('id, headline, period, project_id')
    .eq('id', reportId)
    .single();

  if (fetchErr || !existing) {
    return { error: 'Impact report record not found.' };
  }

  const { error: updateErr } = await supabase
    .from('impact_reports')
    .update({ verified_by_admin: true })
    .eq('id', reportId);

  if (updateErr) return { error: updateErr.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'IMPACT_REPORT_VERIFIED',
    targetType: 'project',
    targetId: existing.project_id,
    details: `Field impact report "${existing.headline}" verified by platform administrator. Now authoritative for public telemetry.`,
  });

  revalidatePath('/impact');
  revalidatePath('/projects');
  return { success: true };
}
