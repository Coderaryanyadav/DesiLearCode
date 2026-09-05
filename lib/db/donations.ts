import { createClient } from '@/lib/supabase/server';
import { DonationIntent } from '@/lib/types';

export async function getDonationsForDonor(donorProfileId: string): Promise<DonationIntent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('donation_intents')
    .select(`
      *,
      projects:project_id (
        title,
        organizations:organization_id (name)
      )
    `)
    .eq('donor_id', donorProfileId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapDonationRow(row));
}

export async function getAllDonationsForAdmin(): Promise<DonationIntent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('donation_intents')
    .select(`
      *,
      projects:project_id (
        title,
        organizations:organization_id (name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapDonationRow(row));
}

function mapDonationRow(row: any): DonationIntent {
  return {
    id: row.id,
    receiptNumber: row.receipt_number,
    donorName: row.is_anonymous ? 'Anonymous Supporter' : row.donor_name,
    donorEmail: row.donor_email,
    isAnonymous: row.is_anonymous,
    projectId: row.project_id,
    projectTitle: row.projects?.title || 'Tech Education Project',
    organizationName: row.projects?.organizations?.name || 'Partner NGO',
    amount: Number(row.amount),
    currency: row.currency,
    allocatedNeedType: row.allocated_need_type,
    message: row.message,
    status: row.status,
    taxExemptEligible: row.tax_exempt_eligible,
    complianceNotice: row.compliance_notice || 'Pledge recorded for transparent project allocation.',
    createdAt: row.created_at,
  };
}
