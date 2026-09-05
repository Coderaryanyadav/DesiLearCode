import { createClient } from '@/lib/supabase/server';
import { AuditLogEntry } from '@/lib/types';

export async function getAuditLogsForAdmin(): Promise<AuditLogEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    actorName: row.actor_name,
    actorEmail: row.actor_email,
    actorRole: row.actor_role,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    details: row.details,
    timestamp: row.created_at,
  }));
}
