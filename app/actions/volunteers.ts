'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { VolunteerStatus } from '@/lib/types';
import { VolunteerApplicationSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function applyForVolunteering(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please sign in or create an account to submit your volunteer application.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'User profile not found.' };

  const rawSkills = formData.getAll('skills') as string[];
  const rawSubjects = formData.getAll('preferredSubjects') as string[];
  const rawLanguages = formData.getAll('languages') as string[];
  const opportunityId = formData.get('opportunityId') as string;
  const projectId = formData.get('projectId') as string;

  const rawPayload = {
    name: profile.full_name,
    email: profile.email,
    phone: formData.get('phone') as string,
    skills: rawSkills.length > 0 ? rawSkills : ['Basic Computer Skills'],
    experienceYears: Number(formData.get('experienceYears') || 0),
    availabilityHoursPerWeek: Number(formData.get('availabilityHoursPerWeek') || 2),
    preferredMode: (formData.get('preferredMode') as any) || 'both',
    preferredSubjects: rawSubjects.length > 0 ? rawSubjects : ['Coding & STEM'],
    preferredAgeGroup: (formData.get('preferredAgeGroup') as string) || '11–16 years',
    location: (formData.get('location') as string) || 'General',
    languages: rawLanguages.length > 0 ? rawLanguages : ['English'],
    bio: (formData.get('bio') as string) || '',
    safeguardingConsent: formData.get('safeguardingConsent') === 'true',
  };

  const validation = VolunteerApplicationSchema.safeParse(rawPayload);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || 'Validation failed.' };
  }

  // Create or update volunteer profile
  const { data: existingVol } = await supabase
    .from('volunteers')
    .select('id')
    .eq('user_id', profile.id)
    .single();

  let volId = existingVol?.id;

  if (!volId) {
    const { data: newVol, error: volErr } = await supabase
      .from('volunteers')
      .insert({
        user_id: profile.id,
        skills: rawPayload.skills,
        experience_years: rawPayload.experienceYears,
        availability_hours_per_week: rawPayload.availabilityHoursPerWeek,
        preferred_mode: rawPayload.preferredMode,
        preferred_subjects: rawPayload.preferredSubjects,
        preferred_age_group: rawPayload.preferredAgeGroup,
        location: rawPayload.location,
        languages: rawPayload.languages,
        bio: rawPayload.bio,
        safeguarding_consent: rawPayload.safeguardingConsent,
      })
      .select('id')
      .single();

    if (volErr || !newVol) return { error: volErr?.message || 'Failed to create volunteer profile.' };
    volId = newVol.id;

    // Update profile role to volunteer if currently visitor
    if (profile.role === 'visitor') {
      await supabase.from('profiles').update({ role: 'volunteer' }).eq('id', profile.id);
    }
  }

  // If applying for specific project
  if (projectId) {
    const { error: appErr } = await supabase
      .from('volunteer_applications')
      .insert({
        volunteer_id: volId,
        opportunity_id: opportunityId || null,
        project_id: projectId,
        status: 'pending' as VolunteerStatus,
      });

    if (appErr) return { error: appErr.message };
  }

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: 'volunteer',
    action: 'VOLUNTEER_APPLICATION_SUBMITTED',
    targetType: 'volunteer',
    targetId: volId,
    details: `Volunteer profile & application submitted with child safeguarding consent.`,
  });

  revalidatePath('/dashboard/volunteering');
  revalidatePath('/volunteer');
  return { success: true };
}

export async function updateVolunteerApplicationStatus(applicationId: string, status: VolunteerStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'ngo')) {
    return { error: 'Forbidden. Admin or NGO coordinator credentials required.' };
  }

  const { error } = await supabase
    .from('volunteer_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId);

  if (error) return { error: error.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'VOLUNTEER_APPLICATION_STATUS_UPDATED',
    targetType: 'volunteer',
    targetId: applicationId,
    details: `Application status moved to ${status}.`,
  });

  revalidatePath('/ngo/volunteers');
  revalidatePath('/admin/volunteers');
  return { success: true };
}

export async function logVolunteerHours(volunteerProfileId: string, hours: number, note: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'ngo')) {
    return { error: 'Forbidden. Only coordinators or admins can formally verify volunteer hours.' };
  }

  if (hours <= 0 || hours > 100) {
    return { error: 'Invalid hours logged.' };
  }

  const { data: vol } = await supabase.from('volunteers').select('hours_volunteered').eq('id', volunteerProfileId).single();
  const newTotal = (Number(vol?.hours_volunteered) || 0) + hours;

  const { error } = await supabase
    .from('volunteers')
    .update({ hours_volunteered: newTotal, updated_at: new Date().toISOString() })
    .eq('id', volunteerProfileId);

  if (error) return { error: error.message };

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'VOLUNTEER_HOURS_LOGGED',
    targetType: 'volunteer',
    targetId: volunteerProfileId,
    details: `Verified ${hours} service hours. Note: ${note}. New total: ${newTotal} hours.`,
  });

  revalidatePath('/admin/volunteers');
  revalidatePath('/dashboard/volunteering');
  return { success: true, newTotal };
}
