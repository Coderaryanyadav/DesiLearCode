import { z } from 'zod';

function cleanUrl(val?: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function cleanEmail(val?: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

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
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SAFEGUARDING_EMAIL: z.string().email().default('safeguarding@desilearncode.org'),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function getValidatedEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  const defaultAppUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const rawPayload = {
    NEXT_PUBLIC_SUPABASE_URL: cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined,
    NEXT_PUBLIC_APP_URL: cleanUrl(process.env.NEXT_PUBLIC_APP_URL) || defaultAppUrl,
    NEXT_PUBLIC_SAFEGUARDING_EMAIL: cleanEmail(process.env.NEXT_PUBLIC_SAFEGUARDING_EMAIL) || 'safeguarding@desilearncode.org',
  };

  const result = envSchema.safeParse(rawPayload);

  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => `[ENV ERROR] ${e.path.join('.')}: ${e.message}`).join('\n');
    
    // In build or test environments (including Vercel static prerendering), allow fallback
    const isBuildOrTest = process.env.NODE_ENV === 'test' || 
      process.env.NEXT_PHASE === 'phase-production-build' || 
      Boolean(process.env.VERCEL) || 
      Boolean(process.env.CI);

    if (isBuildOrTest) {
      console.warn(
        `[ENV NOTICE] Non-blocking build fallback applied during static generation:\n` +
        errorMessages
      );
      return {
        NEXT_PUBLIC_SUPABASE_URL: cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'https://mock-build-db.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'mock-anon-key-for-build-prerendering-only-1234567890',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined,
        NEXT_PUBLIC_APP_URL: cleanUrl(process.env.NEXT_PUBLIC_APP_URL) || defaultAppUrl,
        NEXT_PUBLIC_SAFEGUARDING_EMAIL: cleanEmail(process.env.NEXT_PUBLIC_SAFEGUARDING_EMAIL) || 'safeguarding@desilearncode.org',
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

