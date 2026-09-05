import { createClient } from '@/lib/supabase/server';
import { Organization } from '@/lib/types';

export async function getVerifiedOrganizations(): Promise<Organization[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      projects (id, status, target_students)
    `)
    .eq('verification_status', 'verified')
    .order('name');

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapOrgRow(row));
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      projects (id, status, target_students),
      organization_verifications (document_name, document_type, is_verified)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapOrgRow(data);
}

export async function getAllOrganizationsForAdmin(): Promise<Organization[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      projects (id, status, target_students),
      organization_verifications (document_name, document_type, is_verified)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => mapOrgRow(row));
}

function mapOrgRow(row: any): Organization {
  const activeProjects = (row.projects || []).filter((p: any) => p.status === 'active' || p.status === 'almost_funded');
  const totalStudents = (row.projects || []).reduce((acc: number, curr: any) => acc + (Number(curr.target_students) || 0), 0);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || '',
    description: row.description || '',
    registrationNumber: row.registration_number,
    website: row.website || '',
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    location: row.location,
    areasServed: row.areas_served || [],
    programs: row.programs || [],
    technologyNeedsSummary: row.technology_needs_summary || '',
    verificationStatus: row.verification_status,
    verifiedAt: row.verified_at,
    logoUrl: row.logo_url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
    heroImageUrl: row.hero_image_url || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    documents: (row.organization_verifications || []).map((d: any) => ({
      name: d.document_name,
      type: d.document_type,
      verified: d.is_verified,
    })),
    activeProjectsCount: activeProjects.length,
    studentsReached: totalStudents,
    devicesReceived: 0,
    isFictionalDemo: row.is_fictional_demo || false,
    createdAt: row.created_at,
  };
}
