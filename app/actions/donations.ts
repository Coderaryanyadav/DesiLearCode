'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { DonationIntentSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function submitDonationIntent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let donorProfileId: string | null = null;
  let donorName = (formData.get('donorName') as string)?.trim();
  let donorEmail = (formData.get('donorEmail') as string)?.trim();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      donorProfileId = profile.id;
      if (!donorName) donorName = profile.full_name;
      if (!donorEmail) donorEmail = profile.email;
    }
  }

  const rawPayload = {
    donorName: donorName || 'Supporter',
    donorEmail: donorEmail || 'donor@example.org',
    isAnonymous: formData.get('isAnonymous') === 'true',
    amount: Number(formData.get('amount')),
    projectId: formData.get('projectId') as string,
    allocatedNeedType: (formData.get('allocatedNeedType') as string) || undefined,
    message: (formData.get('message') as string) || undefined,
  };

  const validation = DonationIntentSchema.safeParse(rawPayload);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || 'Invalid pledge details.' };
  }

  const receiptNumber = 'TFK-DON-' + Math.floor(1000 + Math.random() * 9000);

  const { data: donation, error } = await supabase
    .from('donation_intents')
    .insert({
      receipt_number: receiptNumber,
      donor_id: donorProfileId,
      donor_name: rawPayload.donorName,
      donor_email: rawPayload.donorEmail,
      is_anonymous: rawPayload.isAnonymous,
      project_id: rawPayload.projectId,
      amount: rawPayload.amount,
      currency: 'INR',
      allocated_need_type: rawPayload.allocatedNeedType,
      message: rawPayload.message,
      status: 'initiated',
      compliance_notice: 'Direct transparent allocation pledge for educational hardware & supplies.',
    })
    .select()
    .single();

  if (error || !donation) {
    return { error: error?.message || 'Failed to record donation pledge.' };
  }

  // Update project current_value
  const { data: proj } = await supabase.from('projects').select('current_value, goal_value').eq('id', rawPayload.projectId).single();
  if (proj) {
    const newCurrent = Number(proj.current_value || 0) + rawPayload.amount;
    const progress = proj.goal_value > 0 ? Math.min(100, Math.round((newCurrent / proj.goal_value) * 100)) : 0;
    await supabase.from('projects').update({
      current_value: newCurrent,
      progress_percentage: progress,
      status: progress >= 100 ? 'almost_funded' : 'active',
      updated_at: new Date().toISOString(),
    }).eq('id', rawPayload.projectId);
  }

  await logAuditEvent({
    actorName: rawPayload.isAnonymous ? 'Anonymous Donor' : rawPayload.donorName,
    actorEmail: rawPayload.donorEmail,
    actorRole: donorProfileId ? 'donor' : 'visitor',
    action: 'DONATION_INTENT_RECORDED',
    targetType: 'donation',
    targetId: donation.id,
    details: `Pledged ₹${rawPayload.amount.toLocaleString()} for project (Receipt: ${receiptNumber}).`,
  });

  revalidatePath(`/projects`);
  revalidatePath('/dashboard/donations');
  return { success: true, receiptNumber, donation };
}
