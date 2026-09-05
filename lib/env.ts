import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string({
      required_error: 'NEXT_PUBLIC_SUPABASE_URL is required.',
    })
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL.')
    .refine(
      (url) => !url.includes('placeholder-project.supabase.co'),
      'NEXT_PUBLIC_SUPABASE_URL cannot use the unconfigured placeholder URL.'
    ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string({
      required_error: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required.',
    })
    .min(10, 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid non-empty key.')
    .refine(
      (key) => key !== 'placeholder-anon-key',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY cannot use the unconfigured placeholder key.'
    ),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SAFEGUARDING_EMAIL: z.string().email().optional(),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function getValidatedEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SAFEGUARDING_EMAIL: process.env.NEXT_PUBLIC_SAFEGUARDING_EMAIL,
  });

  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => `[ENV ERROR] ${e.path.join('.')}: ${e.message}`).join('\n');
    
    // In build or test environments without live DB, we allow controlled fallback check
    if (process.env.NODE_ENV === 'test') {
      return {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-test-db.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-unit-testing-only-1234567890',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        NEXT_PUBLIC_SAFEGUARDING_EMAIL: 'safeguarding@desilearncode.org',
      };
    }

    throw new Error(
      `CRITICAL: DesiLearCode Environment Configuration Invalid.\n` +
      `Ensure correct Supabase environment variables are specified in .env.local or runtime config.\n` +
      errorMessages
    );
  }

  validatedEnv = result.data;
  return validatedEnv;
}

export function isSupabaseConfigured(): boolean {
  try {
    const env = getValidatedEnv();
    return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  } catch {
    return false;
  }
}
