'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAuditEvent } from '@/lib/db/audit-logger';

export async function login(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch profile to verify active status
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_active, full_name, email, role')
      .eq('user_id', data.user.id)
      .single();

    if (profile && !profile.is_active) {
      await supabase.auth.signOut();
      return { error: 'This account has been deactivated. Please contact support.' };
    }

    if (profile) {
      await logAuditEvent({
        actorName: profile.full_name,
        actorEmail: profile.email,
        actorRole: profile.role,
        action: 'USER_LOGIN',
        targetType: 'system',
        targetId: profile.id,
        details: 'User authenticated successfully.',
      });
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const fullName = (formData.get('fullName') as string)?.trim();
  const requestedRole = formData.get('role') as string;

  if (!email || !password || !fullName) {
    return { error: 'Full name, email, and password are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  // Zero-Trust Authorization: Prevent client from assigning 'admin' or 'ngo' directly during public registration
  const safeRole = (requestedRole === 'volunteer' || requestedRole === 'donor') ? requestedRole : 'visitor';

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: safeRole,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await logAuditEvent({
      actorName: fullName,
      actorEmail: email,
      actorRole: safeRole as any,
      action: 'USER_REGISTRATION',
      targetType: 'system',
      targetId: data.user.id,
      details: `New account registered with initial role ${safeRole}.`,
    });
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name, email, role, id').eq('user_id', user.id).single();
    if (profile) {
      await logAuditEvent({
        actorName: profile.full_name,
        actorEmail: profile.email,
        actorRole: profile.role,
        action: 'USER_LOGOUT',
        targetType: 'system',
        targetId: profile.id,
        details: 'User logged out.',
      });
    }
  }

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
