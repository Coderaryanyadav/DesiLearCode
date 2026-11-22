import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/lib/types';

interface AuditLogParams {
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: 'organization' | 'project' | 'device' | 'volunteer' | 'donation' | 'safeguarding_report' | 'system';
  targetId: string;
  details: string;
}

export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from('audit_logs').insert({
      actor_name: params.actorName,
      actor_email: params.actorEmail,
      actor_role: params.actorRole,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId,
      details: params.details,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
