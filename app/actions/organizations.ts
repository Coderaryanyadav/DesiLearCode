'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { OrganizationVerificationStatus } from '@/lib/types';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function registerOrganization(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized. Please create an account or sign in first.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return { error: 'Profile not found.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const tagline = (formData.get('tagline') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const registrationNumber = (formData.get('registrationNumber') as string)?.trim();
  const website = (formData.get('website') as string)?.trim();
  const contactPerson = (formData.get('contactPerson') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();

  if (!name || !registrationNumber || !contactPerson || !email || !location) {
    return { error: 'Please provide all required organization registration details.' };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({
      slug,
      name,
      tagline: tagline || 'Dedicated to children digital empowerment',
      description: description || 'Child care and education organization.',
      registration_number: registrationNumber,
      website,
      contact_person: contactPerson,
      email,
      phone,
      location,
      verification_status: 'pending' as OrganizationVerificationStatus,
    })
    .select()
    .single();

  if (error || !org) {
    return { error: error?.message || 'Failed to register organization.' };
  }

  // Bind profile to organization and assign role 'ngo'
  await supabase
    .from('profiles')
    .update({ organization_id: org.id, role: 'ngo' })
    .eq('id', profile.id);

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: 'ngo',
    action: 'ORGANIZATION_REGISTERED',
    targetType: 'organization',
    targetId: org.id,
    details: `Organization "${org.name}" submitted registration (Reg: ${registrationNumber}). Initial status: pending verification.`,
  });

  revalidatePath('/organizations');
  revalidatePath('/ngo/dashboard');
  return { success: true, organization: org };
}

export async function updateOrganizationStatus(orgId: string, status: OrganizationVerificationStatus, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden. Admin credentials required to modify verification status.' };
  }

  const updatePayload: any = {
    verification_status: status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'verified') {
    updatePayload.verified_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('organizations')
    .update(updatePayload)
    .eq('id', orgId);

  if (error) {
    return { error: error.message };
  }

  await logAuditEvent({
    actorName: profile.full_name,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: 'ORGANIZATION_STATUS_UPDATED',
    targetType: 'organization',
    targetId: orgId,
    details: `Organization status set to ${status}.${notes ? ` Notes: ${notes}` : ''}`,
  });

  revalidatePath('/admin/organizations');
  revalidatePath('/organizations');
  return { success: true };
}
