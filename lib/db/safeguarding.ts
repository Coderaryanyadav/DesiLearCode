import { createClient } from '@/lib/supabase/server';
import { SafeguardingReport } from '@/lib/types';

export async function getSafeguardingReportsForAdmin(): Promise<SafeguardingReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('safeguarding_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    reporterName: row.reporter_name,
    reporterEmail: row.reporter_email,
    subjectType: row.subject_type,
    subjectId: row.subject_id,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  }));
}
