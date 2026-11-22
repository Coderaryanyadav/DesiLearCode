import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';
import manifest from '@/app/manifest';
import sitemap from '@/app/sitemap';

describe('SEO & Platform Discovery Enhancement Suite', () => {
  it('generates valid robots.txt rules protecting private admin, ngo, and api routes', () => {
    const rules = robots();
    expect(rules).toBeDefined();
    expect(rules.rules).toBeDefined();

    const mainRule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules;
    expect(mainRule.allow).toBe('/');
    expect(mainRule.disallow).toContain('/admin/');
    expect(mainRule.disallow).toContain('/ngo/');
    expect(mainRule.disallow).toContain('/api/');
    expect(rules.sitemap).toContain('/sitemap.xml');
  });

  it('generates a compliant PWA Web App Manifest with required metadata', () => {
    const data = manifest();
    expect(data.name).toBe('DesiLearCode — Open Technology & STEM Infrastructure');
    expect(data.short_name).toBe('DesiLearCode');
    expect(data.start_url).toBe('/');
    expect(data.display).toBe('standalone');
    expect(data.icons).toBeDefined();
    expect(data.icons?.length).toBeGreaterThan(0);
    expect(data.shortcuts).toBeDefined();
    expect(data.shortcuts?.length).toBe(3);
  });

  it('generates a complete sitemap including core public routes and initiatives', async () => {
    const map = await sitemap();
    expect(Array.isArray(map)).toBe(true);
    expect(map.length).toBeGreaterThanOrEqual(13);

    const urls = map.map((entry) => entry.url);
    expect(urls.some((u) => u.endsWith('/projects'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/donate-device'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/volunteer'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/impact'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/safeguarding'))).toBe(true);
  });
});
