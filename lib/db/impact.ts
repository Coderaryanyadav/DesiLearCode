import { createClient } from '@/lib/supabase/server';
import { ImpactReport } from '@/lib/types';

export async function getVerifiedImpactReports(): Promise<ImpactReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impact_reports')
    .select(`
      *,
      projects:project_id (title),
      organizations:organization_id (name)
    `)
    .eq('verified_by_admin', true)
    .order('published_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    projectId: row.project_id,
    projectTitle: row.projects?.title || 'Education Project',
    organizationName: row.organizations?.name || 'Verified NGO',
    period: row.period,
    headline: row.headline,
    summary: row.summary,
    beforeState: row.before_state,
    afterState: row.after_state,
    computersProvided: Number(row.computers_provided || 0),
    studentsTrained: Number(row.students_trained || 0),
    volunteerHours: Number(row.volunteer_hours || 0),
    workshopsConducted: Number(row.workshops_conducted || 0),
    verifiedByAdmin: row.verified_by_admin,
    publishedAt: row.published_at || row.created_at,
  }));
}

export async function getPlatformImpactMetrics() {
  const supabase = await createClient();

  // Compute live aggregates directly from PostgreSQL tables
  const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true });
  const { count: totalOrgs } = await supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified');
  const { count: totalDevices } = await supabase.from('devices').select('*', { count: 'exact', head: true });
  const { count: totalVolunteers } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });

  const { data: projectsData } = await supabase.from('projects').select('target_students');
  const totalStudents = (projectsData || []).reduce((acc: number, curr: any) => acc + (Number(curr.target_students) || 0), 0);

  // Compute verified aggregates from admin-verified impact reports
  const { data: verifiedReports } = await supabase
    .from('impact_reports')
    .select('students_trained, volunteer_hours, workshops_conducted, computers_provided')
    .eq('verified_by_admin', true);

  const verifiedStudents = (verifiedReports || []).reduce((acc: number, curr: any) => acc + (Number(curr.students_trained) || 0), 0);
  const verifiedVolunteerHours = (verifiedReports || []).reduce((acc: number, curr: any) => acc + (Number(curr.volunteer_hours) || 0), 0);
  const verifiedWorkshops = (verifiedReports || []).reduce((acc: number, curr: any) => acc + (Number(curr.workshops_conducted) || 0), 0);

  return {
    verifiedOrgsCount: totalOrgs || 0,
    activeProjectsCount: totalProjects || 0,
    devicesReceivedCount: totalDevices || 0,
    volunteersCount: totalVolunteers || 0,
    studentsReachedEstimate: totalStudents || 0,
    verifiedStudentsTrained: verifiedStudents,
    verifiedVolunteerHours,
    verifiedWorkshops,
  };
}
