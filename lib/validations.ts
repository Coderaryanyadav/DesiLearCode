import { z } from 'zod';

export const DeviceDonationSchema = z.object({
  donorName: z.string().min(2, 'Name must be at least 2 characters'),
  donorEmail: z.string().email('Please enter a valid email address'),
  donorPhone: z.string().optional(),
  deviceType: z.enum(['Laptop', 'Desktop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Router', 'Arduino', 'Raspberry Pi', 'Other']),
  manufacturer: z.string().min(2, 'Manufacturer is required (e.g. Dell, HP, Lenovo)'),
  model: z.string().min(2, 'Model name/number is required'),
  approximateAgeYears: z.number().min(0).max(15),
  condition: z.enum(['like_new', 'good', 'fair', 'needs_repair']),
  powersOn: z.boolean(),
  batteryCondition: z.enum(['excellent', 'good', 'fair', 'dead_or_missing']),
  hasCharger: z.boolean(),
  storage: z.string().min(2, 'Storage details required (e.g. 256GB SSD)'),
  ram: z.string().min(2, 'RAM details required (e.g. 8GB DDR4)'),
  os: z.string().min(2, 'Operating system required (e.g. Windows 11, Ubuntu, None)'),
  pickupPreference: z.enum(['dropoff', 'courier_pickup', 'self_ship']),
  notes: z.string().max(500).optional(),
});

export const VolunteerApplicationSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  experienceYears: z.number().min(0).max(50),
  availabilityHoursPerWeek: z.number().min(1, 'Minimum 1 hour per week required').max(40),
  preferredMode: z.enum(['online', 'in_person', 'both']),
  preferredSubjects: z.array(z.string()).min(1, 'Select at least one subject area'),
  preferredAgeGroup: z.string().min(2, 'Preferred age group required'),
  location: z.string().min(2, 'City/Region required'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  bio: z.string().min(20, 'Please provide a short introduction of at least 20 characters'),
  safeguardingConsent: z.boolean().refine(val => val === true, {
    message: 'You must review and agree to child safeguarding protocols and identity verification standards.',
  }),
});

export const DonationIntentSchema = z.object({
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Valid email is required'),
  isAnonymous: z.boolean().default(false),
  amount: z.number().min(100, 'Minimum project contribution is ₹100'),
  projectId: z.string().min(1, 'Project selection required'),
  allocatedNeedType: z.string().optional(),
  message: z.string().max(300).optional(),
});

export const ProjectCreationSchema = z.object({
  title: z.string().min(10, 'Project title should be descriptive (min 10 characters)'),
  tagline: z.string().min(15, 'Tagline is required (min 15 characters)'),
  description: z.string().min(50, 'Please provide a comprehensive project description'),
  whyItMatters: z.string().min(30, 'Explain why this technology access matters for the children'),
  whatSupportProvides: z.string().min(30, 'Detail specifically what funding/hardware accomplishes'),
  category: z.enum(['Technology', 'Education', 'STEM', 'Coding', 'Cybersecurity', 'AI', 'Internet Access', 'School Supplies', 'Infrastructure']),
  region: z.string().min(3, 'Generalized region (e.g. Pune Urban, Maharashtra)'),
  beneficiaryGroup: z.string().min(5, 'Aggregated beneficiary description (no individual child names)'),
  targetStudents: z.number().min(5, 'Target minimum 5 students'),
  goalValue: z.number().min(1000, 'Minimum budget target is ₹1,000'),
  heroImageUrl: z.string().url().optional(),
});

export const SafeguardingReportSchema = z.object({
  reporterName: z.string().min(2, 'Your name is required'),
  reporterEmail: z.string().email('Valid email is required'),
  subjectType: z.enum(['project', 'organization', 'content', 'volunteer']),
  subjectId: z.string().min(1, 'Subject identifier is required'),
  description: z.string().min(20, 'Please describe the privacy or child safety concern with specific details'),
});
