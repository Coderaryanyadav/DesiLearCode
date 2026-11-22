'use server';

import { createClient } from '@/lib/supabase/server';
import { SafeguardingReportSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function submitSafeguardingReport(formData: FormData) {
  const supabase = await createClient();

  const rawPayload = {
    reporterName: (formData.get('reporterName') as string)?.trim() || 'Anonymous Reporter',
    reporterEmail: (formData.get('reporterEmail') as string)?.trim() || '',
    subjectType: formData.get('subjectType') as any,
    subjectId: formData.get('subjectId') as string,
    description: (formData.get('description') as string)?.trim() || '',
  };

  const validation = SafeguardingReportSchema.safeParse(rawPayload);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || 'Invalid incident report.' };
  }

  const { data, error } = await supabase
    .from('safeguarding_reports')
    .insert({
      reporter_name: rawPayload.reporterName,
      reporter_email: rawPayload.reporterEmail,
      subject_type: rawPayload.subjectType,
      subject_id: rawPayload.subjectId,
      description: rawPayload.description,
      status: 'new',
    })
    .select()
    .single();

  if (error || !data) {
    return { error: error?.message || 'Failed to submit report. Please email safeguarding@desilearncode.org directly.' };
  }

  await logAuditEvent({
    actorName: rawPayload.reporterName,
    actorEmail: rawPayload.reporterEmail,
    actorRole: 'visitor',
    action: 'SAFEGUARDING_REPORT_FILED',
    targetType: 'safeguarding_report',
    targetId: data.id,
    details: `Incident report filed for ${rawPayload.subjectType} ${rawPayload.subjectId}.`,
  });

  return { success: true, reportId: data.id };
}

export async function updateSafeguardingReportStatus(reportId: string, status: 'new' | 'under_investigation' | 'resolved' | 'dismissed') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden. Safeguarding officer / administrator credentials required.' };
  }

  const { error } = await supabase
    .from('safeguarding_reports')
    .update({ status })
    .eq('id', reportId);

  if (error) return { error: error.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'SAFEGUARDING_STATUS_UPDATED',
    targetType: 'safeguarding_report',
    targetId: reportId,
    details: `Safeguarding incident status changed to ${status}.`,
  });

  return { success: true };
}
