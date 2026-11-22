## Description
Briefly explain the goal and scope of this pull request.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Performance optimization (caching, query parallelization)
- [ ] Documentation update

## Verification & Quality Gates
- [ ] `npm test` passes (57/57 Vitest unit & integration tests)
- [ ] `npx tsc --noEmit` passes with 0 compiler errors
- [ ] `npm run lint` passes with 0 warnings
- [ ] Next.js production build succeeds (`npm run build`)

## Child Safeguarding & Privacy Checklist
- [ ] **Zero-PII Compliance**: No student names, photos, or residential addresses introduced.
- [ ] **No Hardcoded Secrets**: Verified `.env.local` or API tokens are not checked in.
- [ ] **Tenant Isolation**: Verified multi-tenant organization boundaries are respected.
