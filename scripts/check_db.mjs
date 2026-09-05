import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qacnfacwnfpbisvumrnv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhY25mYWN3bmZwYmlzdnVtcm52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODU5NTI4NSwiZXhwIjoyMTA0MTcxMjg1fQ.0IiQfMEnu2e4__XKrgpiqENCao15pV5NgxNO-b0yKFU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  console.log('Checking if tables exist...');
  const { data, error } = await supabase.from('profiles').select('id').limit(1);
  
  if (error) {
    console.error('DATABASE ERROR:', error.message);
  } else {
    console.log('Database seems to be set up! Profiles query successful.');
  }
}

checkDatabase();
