import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qacnfacwnfpbisvumrnv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhY25mYWN3bmZwYmlzdnVtcm52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODU5NTI4NSwiZXhwIjoyMTA0MTcxMjg1fQ.0IiQfMEnu2e4__XKrgpiqENCao15pV5NgxNO-b0yKFU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function elevateAdmin() {
  const targetEmail = 'DesiLearCode@gmail.com';
  
  // First, find the user ID for this email from auth.users (if possible, but we don't have direct access via JS client easily unless we use admin API)
  // Instead, since profiles are linked, we can update public.profiles where email matches if we added email to profiles.
  // Let's check public.profiles schema... it might not have email.
  // Supabase admin api allows listing users:
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError);
    return;
  }
  
  const user = usersData.users.find(u => u.email === targetEmail);
  
  if (!user) {
    console.log(`User with email ${targetEmail} not found. Ensure they have signed up first.`);
    return;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id);
    
  if (error) {
    console.error('Error updating role:', error);
  } else {
    console.log(`Successfully elevated ${targetEmail} (ID: ${user.id}) to ADMIN role!`);
  }
}

elevateAdmin();
