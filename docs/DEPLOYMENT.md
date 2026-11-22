# DesiLearCode — Production Deployment & Operations Guide

> **Live Production URL**: [https://desilearncode.vercel.app](https://desilearncode.vercel.app)  
> **Vercel Project Dashboard**: [https://vercel.com/aryanjyadav-9862s-projects/desilearncode](https://vercel.com/aryanjyadav-9862s-projects/desilearncode)  
> **Source Repository**: [https://github.com/Coderaryanyadav/DesiLearCode](https://github.com/Coderaryanyadav/DesiLearCode)  
> **Target Cloud**: Vercel (Edge & Node.js Serverless Functions)  
> **Primary Database**: Supabase PostgreSQL 15+ (us-east-1 / AWS Mumbai)

---

## 1. Deployment Topology

```
                  ┌───────────────────────────────┐
                  │    GitHub (origin/main)       │
                  │  Coderaryanyadav/DesiLearCode  │
                  └──────────────┬────────────────┘
                                 │ Webhook Push / Vercel CLI
                                 ▼
                  ┌───────────────────────────────┐
                  │     Vercel Production Node    │
                  │   desilearncode.vercel.app    │
                  └──────────────┬────────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             │                                       │
             ▼                                       ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  Next.js 15 App Router       │        │  Next.js Static & Assets     │
│  • Edge Middleware           │        │  • PWA Manifest (manifest.ts)│
│  • Dynamic SSR / RSC         │        │  • Dynamic Sitemap (sitemap) │
│  • 82+ Serverless Lambdas    │        │  • Crawler Policy (robots.ts)│
│  • Security Headers (CSP)    │        │  • Edge Favicon (icon.tsx)   │
└──────────────┬───────────────┘        └──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Supabase PostgreSQL DB      │
│  • 25+ Row Level Security    │
│  • Session Cookie SSR Auth   │
│  • Append-Only Audit Trail   │
└──────────────────────────────┘
```

---

## 2. Active Production URLs & Endpoints

| Resource | Production URL | Description |
| :--- | :--- | :--- |
| **Main Web Portal** | [https://desilearncode.vercel.app](https://desilearncode.vercel.app) | Public landing & grassroots initiatives |
| **National Directory** | [https://desilearncode.vercel.app/projects](https://desilearncode.vercel.app/projects) | Verified learning labs & computer rooms |
| **Hardware Intake** | [https://desilearncode.vercel.app/donate-device](https://desilearncode.vercel.app/donate-device) | 5-step hardware donation wizard & tracking |
| **Mentorship Portal** | [https://desilearncode.vercel.app/volunteer](https://desilearncode.vercel.app/volunteer) | Engineering & STEM volunteer onboarding |
| **Impact Ledger** | [https://desilearncode.vercel.app/impact](https://desilearncode.vercel.app/impact) | Real-time database metrics & audit reports |
| **Partners Directory** | [https://desilearncode.vercel.app/organizations](https://desilearncode.vercel.app/organizations) | Statutory-verified grassroots NGO partners |
| **Child Safeguarding** | [https://desilearncode.vercel.app/safeguarding](https://desilearncode.vercel.app/safeguarding) | Zero-PII child protection charter & intake |
| **Search Engine Sitemap** | [https://desilearncode.vercel.app/sitemap.xml](https://desilearncode.vercel.app/sitemap.xml) | Dynamic XML sitemap indexing all initiatives |
| **Crawler Policy** | [https://desilearncode.vercel.app/robots.txt](https://desilearncode.vercel.app/robots.txt) | Prevents crawling of `/admin`, `/ngo`, `/api` |
| **Web App Manifest** | [https://desilearncode.vercel.app/manifest.webmanifest](https://desilearncode.vercel.app/manifest.webmanifest) | Progressive Web App mobile install config |

---

## 3. Required Environment Variables

Configure these in the **Vercel Dashboard ➔ Project Settings ➔ Environment Variables**:

| Variable Name | Environment | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Public anonymous API key for client-side queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development | Privileged server-side key for administrative actions |
| `NEXT_PUBLIC_APP_URL` | Production, Preview | Canonical domain (`https://desilearncode.vercel.app`) |
| `NEXT_PUBLIC_SAFEGUARDING_EMAIL` | Production, Preview | Designated safety officer email |

---

## 4. Deploying Updates

### Option A: Automatic Git Deployments (Recommended)
Any commit pushed to `main` automatically triggers an optimized Vercel production build:
```bash
git add .
git commit -m "feat: enhance platform discovery, seo, and deployment"
git push origin main
```

### Option B: Vercel CLI Direct Deployment
Deploy instantly from the terminal using prebuilt assets:
```bash
# 1. Pull production configuration
npx vercel pull --yes --environment=production

# 2. Compile optimized production build
npx vercel build --prod

# 3. Deploy prebuilt bundle directly to production
npx vercel deploy --prebuilt --prod
```

---

## 5. Security & Verification Baseline

Every production deployment is subjected to automated validation:
- **Unit & Security Tests**: 57 tests across 8 suites (`npm test`)
- **Type Safety**: Strict TypeScript 5.9 with 0 compiler errors (`npx tsc --noEmit`)
- **Code Standards**: Next.js ESLint with zero warnings (`npm run lint`)
- **Production Build**: 43 static and dynamic routes compiled cleanly (`npm run build`)
- **Security Headers**: HSTS (`63072000`), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`)
