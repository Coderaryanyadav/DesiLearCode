import { MetadataRoute } from 'next';
import { getValidatedEnv } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const env = getValidatedEnv();
  const baseUrl = env.NEXT_PUBLIC_APP_URL || 'https://desilearncode.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/ngo/',
          '/ngo/*',
          '/dashboard/',
          '/dashboard/*',
          '/api/',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
