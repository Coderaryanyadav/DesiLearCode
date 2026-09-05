export type UserRole = 'visitor' | 'donor' | 'volunteer' | 'ngo' | 'admin';

export type OrganizationVerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export type ProjectCategory = 
  | 'Technology' 
  | 'Education' 
  | 'STEM' 
  | 'Coding' 
  | 'Cybersecurity' 
  | 'AI' 
  | 'Internet Access' 
  | 'School Supplies' 
  | 'Infrastructure';

export type ProjectStatus = 'draft' | 'pending_approval' | 'active' | 'almost_funded' | 'completed' | 'paused';

export type NeedPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NeedType = 
  | 'laptop' 
  | 'desktop' 
  | 'tablet' 
  | 'mentor' 
  | 'refurbishment_fund' 
  | 'arduino_kit' 
  | 'books' 
  | 'internet_sponsorship' 
  | 'peripherals' 
  | 'school_supplies';

export type DeviceType = 
  | 'Laptop' 
  | 'Desktop' 
  | 'Tablet' 
  | 'Monitor' 
  | 'Keyboard' 
  | 'Mouse' 
  | 'Router' 
  | 'Arduino' 
  | 'Raspberry Pi' 
  | 'Other';

export type DeviceStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Approved' 
  | 'Pickup Scheduled' 
  | 'Received' 
  | 'Inspection' 
  | 'Repair' 
  | 'Ready' 
  | 'Assigned' 
  | 'Delivered' 
  | 'In Use' 
  | 'Retired';

export type VolunteerStatus = 'pending' | 'approved' | 'active' | 'completed' | 'withdrawn';

export type DonationIntentStatus = 'initiated' | 'pending' | 'successful' | 'failed' | 'refunded';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  organizationId?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  registrationNumber: string;
  website: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string; // generalized location (e.g. Bangalore Urban, Karnataka)
  areasServed: string[];
  programs: string[];
  technologyNeedsSummary: string;
  verificationStatus: OrganizationVerificationStatus;
  verifiedAt?: string;
  logoUrl: string;
  heroImageUrl: string;
  documents?: {
    name: string;
    type: string;
    verified: boolean;
  }[];
  activeProjectsCount: number;
  studentsReached: number;
  devicesReceived: number;
  isFictionalDemo: boolean;
  createdAt: string;
}

export interface NeedItem {
  id: string;
  projectId: string;
  projectTitle: string;
  organizationId: string;
  organizationName: string;
  title: string;
  type: NeedType;
  category: ProjectCategory;
  quantityRequired: number;
  quantityFulfilled: number;
  unit: string; // e.g., "Laptops", "Hours/Week", "Kits", "₹"
  estimatedCostPerUnit?: number;
  priority: NeedPriority;
  deadline?: string;
  purpose: string;
  fulfilled: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  postedAt: string;
  authorName: string;
  isSafeguardedChecked: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  whatSupportProvides: string;
  organizationId: string;
  organizationName: string;
  organizationVerified: boolean;
  category: ProjectCategory;
  region: string; // General location only (e.g., Pune District, MH)
  beneficiaryGroup: string; // Aggregated group (e.g., "40 Middle School Students from Rural Learning Centers")
  targetStudents: number;
  status: ProjectStatus;
  urgency: 'normal' | 'medium' | 'high' | 'critical';
  heroImageUrl: string;
  goalValue: number; // approximate monetary value or total unit target
  currentValue: number;
  progressPercentage: number;
  needs: NeedItem[];
  milestones: ProjectMilestone[];
  updates: ProjectUpdate[];
  impactSummary: {
    studentsReached: number;
    computersInstalled: number;
    volunteerHoursLogged: number;
    workshopsConducted: number;
  };
  createdAt: string;
  updatedAt: string;
  isFictionalDemo: boolean;
}

export interface DeviceDonation {
  id: string;
  trackingCode: string; // e.g. TFK-104
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  deviceType: DeviceType;
  manufacturer: string;
  model: string;
  approximateAgeYears: number;
  condition: 'like_new' | 'good' | 'fair' | 'needs_repair';
  powersOn: boolean;
  batteryCondition: 'excellent' | 'good' | 'fair' | 'dead_or_missing';
  hasCharger: boolean;
  storage: string;
  ram: string;
  os: string;
  pickupPreference: 'dropoff' | 'courier_pickup' | 'self_ship';
  notes?: string;
  status: DeviceStatus;
  statusHistory: {
    status: DeviceStatus;
    timestamp: string;
    note: string;
  }[];
  assignedOrgName?: string;
  assignedProjectName?: string;
  createdAt: string;
}

export interface VolunteerOpportunity {
  id: string;
  projectId: string;
  projectTitle: string;
  organizationName: string;
  roleTitle: string;
  skillsRequired: string[];
  hoursPerWeek: number;
  durationWeeks: number;
  mode: 'online' | 'in_person' | 'hybrid';
  region: string;
  description: string;
  openings: number;
  urgency: NeedPriority;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  skills: string[];
  experienceYears: number;
  availabilityHoursPerWeek: number;
  preferredMode: 'online' | 'in_person' | 'both';
  preferredSubjects: string[];
  preferredAgeGroup: string;
  location: string;
  languages: string[];
  bio: string;
  safeguardingConsent: boolean;
  hoursVolunteered: number;
  workshopsCompleted: number;
  studentsReached: number;
  applications: {
    id: string;
    opportunityId: string;
    projectTitle: string;
    organizationName: string;
    status: VolunteerStatus;
    appliedAt: string;
    hoursLogged?: number;
  }[];
}

export interface DonationIntent {
  id: string;
  receiptNumber: string; // e.g. TFK-DON-8842
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  projectId: string;
  projectTitle: string;
  organizationName: string;
  amount: number;
  currency: 'INR' | 'USD';
  allocatedNeedType?: string;
  message?: string;
  status: DonationIntentStatus;
  taxExemptEligible: boolean;
  complianceNotice: string;
  createdAt: string;
}

export interface ImpactReport {
  id: string;
  projectId: string;
  projectTitle: string;
  organizationName: string;
  period: string; // e.g. "Q2 2026"
  headline: string;
  summary: string;
  beforeState: string;
  afterState: string;
  computersProvided: number;
  studentsTrained: number;
  volunteerHours: number;
  workshopsConducted: number;
  verifiedByAdmin: boolean;
  publishedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: 'organization' | 'project' | 'device' | 'volunteer' | 'donation' | 'safeguarding_report' | 'system';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface SafeguardingReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  subjectType: 'project' | 'organization' | 'content' | 'volunteer';
  subjectId: string;
  description: string;
  status: 'new' | 'under_investigation' | 'resolved' | 'dismissed';
  createdAt: string;
}
