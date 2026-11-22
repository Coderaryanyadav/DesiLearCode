'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { DonationIntentSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/db/audit-logger';
import { generateDonationReceiptNumber } from '@/lib/crypto-id';
import { checkRateLimit } from '@/lib/rate-limit';

export async function submitDonationIntent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Rate Limiting Protection (5 pledges per minute per user/client)
  const rateLimitKey = user ? `pledge:${user.id}` : `pledge:anon:${formData.get('donorEmail') || 'unknown'}`;
  const rateLimit = checkRateLimit({ identifier: rateLimitKey, limit: 5, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return { error: 'Rate limit exceeded. Please wait a moment before submitting another pledge.' };
  }

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

  // Cryptographically collision-resistant receipt identifier
  const receiptNumber = generateDonationReceiptNumber();

  // Record donation intent with status 'pledged'
  // CRITICAL: We do NOT increment projects.current_value here.
  // A pledge represents intent, not settled treasury funding.
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
      status: 'pledged',
      tax_exempt_eligible: false, // Default false until recipient NGO 12A/80G status is verified for this transaction
      compliance_notice: 'Support intent recorded. Actual tax exemption documentation depends on recipient NGO statutory registration and regulatory guidelines upon funding settlement.',
    })
    .select()
    .single();

  if (error || !donation) {
    return { error: error?.message || 'Failed to record donation pledge.' };
  }

  await logAuditEvent({
    actorName: rawPayload.isAnonymous ? 'Anonymous Donor' : rawPayload.donorName,
    actorEmail: rawPayload.donorEmail,
    actorRole: donorProfileId ? 'donor' : 'visitor',
    action: 'DONATION_INTENT_RECORDED',
    targetType: 'donation',
    targetId: donation.id,
    details: `Pledge intent of ₹${rawPayload.amount.toLocaleString()} recorded for project (Receipt: ${receiptNumber}). Pending settlement.`,
  });

  revalidatePath(`/projects`);
  revalidatePath('/dashboard/donations');
  return { 
    success: true, 
    receiptNumber, 
    donation,
    isPledgeOnly: true,
    message: 'Support intent successfully recorded. Thank you for pledging!'
  };
}
