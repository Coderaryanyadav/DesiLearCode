import { createClient } from '@/lib/supabase/server';
import { VolunteerOpportunity, VolunteerProfile } from '@/lib/types';

export async function getActiveVolunteerOpportunities(): Promise<VolunteerOpportunity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('volunteer_opportunities')
    .select(`
      *,
      projects:project_id (title),
      organizations:organization_id (name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    projectId: row.project_id,
    projectTitle: row.projects?.title || 'Education Project',
    organizationName: row.organizations?.name || 'Partner NGO',
    roleTitle: row.role_title,
    skillsRequired: row.skills_required || [],
    hoursPerWeek: row.hours_per_week,
    durationWeeks: row.duration_weeks,
    mode: row.mode,
    region: row.region,
    description: row.description,
    openings: row.openings,
    urgency: row.urgency,
  }));
}

export async function getVolunteerProfileForUser(userId: string): Promise<VolunteerProfile | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('user_id', userId)
    .single();

  if (!profile) return null;

  const { data: volunteer, error } = await supabase
    .from('volunteers')
    .select(`
      *,
      volunteer_applications (
        id,
        opportunity_id,
        status,
        hours_logged,
        created_at,
        projects:project_id (
          title,
          organizations:organization_id (name)
        )
      )
    `)
    .eq('user_id', profile.id)
    .single();

  if (error || !volunteer) {
    return null;
  }

  const applications = (volunteer.volunteer_applications || []).map((app: any) => ({
    id: app.id,
    opportunityId: app.opportunity_id || '',
    projectTitle: app.projects?.title || 'Project',
    organizationName: app.projects?.organizations?.name || 'NGO',
    status: app.status,
    appliedAt: app.created_at,
    hoursLogged: Number(app.hours_logged || 0),
  }));

  return {
    id: volunteer.id,
    userId: profile.id,
    name: profile.full_name,
    email: profile.email,
    skills: volunteer.skills || [],
    experienceYears: volunteer.experience_years,
    availabilityHoursPerWeek: volunteer.availability_hours_per_week,
    preferredMode: volunteer.preferred_mode,
    preferredSubjects: volunteer.preferred_subjects || [],
    preferredAgeGroup: volunteer.preferred_age_group || '11–16 years',
    location: volunteer.location,
    languages: volunteer.languages || [],
    bio: volunteer.bio,
    safeguardingConsent: volunteer.safeguarding_consent,
    hoursVolunteered: Number(volunteer.hours_volunteered || 0),
    workshopsCompleted: Number(volunteer.workshops_completed || 0),
    studentsReached: Number(volunteer.students_reached || 0),
    applications,
  };
}

export async function getAllVolunteersForAdmin(): Promise<VolunteerProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('volunteers')
    .select(`
      *,
      profiles:user_id (id, full_name, email),
      volunteer_applications (
        id,
        opportunity_id,
        status,
        hours_logged,
        created_at,
        projects:project_id (
          title,
          organizations:organization_id (name)
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((volunteer: any) => {
    const applications = (volunteer.volunteer_applications || []).map((app: any) => ({
      id: app.id,
      opportunityId: app.opportunity_id || '',
      projectTitle: app.projects?.title || 'Project',
      organizationName: app.projects?.organizations?.name || 'NGO',
      status: app.status,
      appliedAt: app.created_at,
      hoursLogged: Number(app.hours_logged || 0),
    }));

    return {
      id: volunteer.id,
      userId: volunteer.profiles?.id || '',
      name: volunteer.profiles?.full_name || 'Volunteer',
      email: volunteer.profiles?.email || '',
      skills: volunteer.skills || [],
      experienceYears: volunteer.experience_years,
      availabilityHoursPerWeek: volunteer.availability_hours_per_week,
      preferredMode: volunteer.preferred_mode,
      preferredSubjects: volunteer.preferred_subjects || [],
      preferredAgeGroup: volunteer.preferred_age_group || '11–16 years',
      location: volunteer.location,
      languages: volunteer.languages || [],
      bio: volunteer.bio,
      safeguardingConsent: volunteer.safeguarding_consent,
      hoursVolunteered: Number(volunteer.hours_volunteered || 0),
      workshopsCompleted: Number(volunteer.workshops_completed || 0),
      studentsReached: Number(volunteer.students_reached || 0),
      applications,
    };
  });
}
