import { describe, it, expect } from 'vitest';
import { 
  ProjectCreationSchema, 
  SafeguardingReportSchema, 
  VolunteerApplicationSchema, 
  DonationIntentSchema, 
  DeviceDonationSchema 
} from '../lib/validations';

describe('Security & Child Safeguarding Policy Checks', () => {
  const piiRegex = /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|child named [A-Z][a-z]+|age \d+, attends [A-Za-z\s]+ school/i;

  it('detects and flags phone numbers or student personal identifiers in project content', () => {
    const maliciousText = "Meet our student Rahul, age 12, attends St. Xavier school, contact guardian at 9876543210";
    expect(piiRegex.test(maliciousText)).toBe(true);
  });

  it('approves aggregated cohort text without personal identifiable information', () => {
    const safeText = "Providing digital learning tools to a cohort of 35 secondary school students in rural Pune";
    expect(piiRegex.test(safeText)).toBe(false);
  });

  it('enforces minimum description length and aggregates for project creation', () => {
    const invalidShortProject = {
      title: 'Lab',
      tagline: 'Short',
      description: 'Too short',
      whyItMatters: 'None',
      whatSupportProvides: 'None',
      category: 'Coding' as const,
      region: 'Delhi',
      beneficiaryGroup: 'Kids',
      targetStudents: 2, // Minimum is 5
      goalValue: 500,    // Minimum is 1000
    };

    const parseResult = ProjectCreationSchema.safeParse(invalidShortProject);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      expect(fieldErrors.title).toBeDefined();
      expect(fieldErrors.targetStudents).toBeDefined();
      expect(fieldErrors.goalValue).toBeDefined();
    }
  });

  it('strictly validates safeguarding reports for rapid moderation triage', () => {
    const validReport = {
      reporterName: 'Concerned Citizen',
      reporterEmail: 'citizen@example.org',
      subjectType: 'project' as const,
      subjectId: 'proj-123',
      description: 'The uploaded lab photo shows identifiable minor faces without signed guardian consent waiver.',
    };

    const result = SafeguardingReportSchema.safeParse(validReport);
    expect(result.success).toBe(true);
  });

  it('rejects incomplete safeguarding reports with missing description or invalid subjectType', () => {
    const invalidReport = {
      reporterName: 'Anonymous',
      reporterEmail: 'bad-email',
      subjectType: 'invalid_type' as any,
      subjectId: 'proj-123',
      description: 'short',
    };

    const result = SafeguardingReportSchema.safeParse(invalidReport);
    expect(result.success).toBe(false);
  });
});
