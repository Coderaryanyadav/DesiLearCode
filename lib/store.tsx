'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Organization, 
  NeedItem, 
  DeviceDonation, 
  VolunteerOpportunity, 
  VolunteerProfile, 
  DonationIntent, 
  ImpactReport, 
  AuditLogEntry, 
  SafeguardingReport,
  DeviceStatus,
  OrganizationVerificationStatus,
  ProjectStatus
} from './types';
import { 
  INITIAL_ORGANIZATIONS, 
  INITIAL_PROJECTS, 
  INITIAL_NEEDS, 
  INITIAL_DEVICES, 
  INITIAL_VOLUNTEER_OPPORTUNITIES, 
  INITIAL_VOLUNTEER_PROFILES, 
  INITIAL_DONATIONS, 
  INITIAL_IMPACT_REPORTS, 
  INITIAL_AUDIT_LOGS 
} from './mock-data';

interface StoreContextType {
  organizations: Organization[];
  projects: Project[];
  needs: NeedItem[];
  devices: DeviceDonation[];
  volunteerOpportunities: VolunteerOpportunity[];
  volunteerProfiles: VolunteerProfile[];
  donations: DonationIntent[];
  impactReports: ImpactReport[];
  auditLogs: AuditLogEntry[];
  safeguardingReports: SafeguardingReport[];

  // Device actions
  submitDeviceDonation: (data: Omit<DeviceDonation, 'id' | 'trackingCode' | 'status' | 'statusHistory' | 'createdAt'>) => string;
  updateDeviceStatus: (deviceId: string, status: DeviceStatus, note: string, adminName: string) => void;

  // Volunteer actions
  applyForVolunteering: (applicationData: {
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
    opportunityId?: string;
  }) => void;
  logVolunteerHours: (profileId: string, hours: number, workshopNote: string) => void;

  // Donation intent actions
  submitDonationIntent: (intentData: {
    donorName: string;
    donorEmail: string;
    isAnonymous: boolean;
    projectId: string;
    amount: number;
    allocatedNeedType?: string;
    message?: string;
  }) => string;

  // Project actions
  createProject: (projectData: Partial<Project>, organizationId: string) => string;
  updateProjectStatus: (projectId: string, status: ProjectStatus, adminName: string) => void;
  addProjectMilestone: (projectId: string, title: string, description: string, targetDate: string) => void;
  addProjectUpdate: (projectId: string, title: string, content: string, authorName: string) => void;

  // Organization actions
  updateOrganizationStatus: (orgId: string, status: OrganizationVerificationStatus, adminName: string) => void;

  // Impact actions
  publishImpactReport: (report: Omit<ImpactReport, 'id' | 'publishedAt' | 'verifiedByAdmin'>) => void;

  // Safeguarding actions
  submitSafeguardingReport: (report: Omit<SafeguardingReport, 'id' | 'status' | 'createdAt'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [needs, setNeeds] = useState<NeedItem[]>(INITIAL_NEEDS);
  const [devices, setDevices] = useState<DeviceDonation[]>(INITIAL_DEVICES);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerOpportunity[]>(INITIAL_VOLUNTEER_OPPORTUNITIES);
  const [volunteerProfiles, setVolunteerProfiles] = useState<VolunteerProfile[]>(INITIAL_VOLUNTEER_PROFILES);
  const [donations, setDonations] = useState<DonationIntent[]>(INITIAL_DONATIONS);
  const [impactReports, setImpactReports] = useState<ImpactReport[]>(INITIAL_IMPACT_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [safeguardingReports, setSafeguardingReports] = useState<SafeguardingReport[]>([]);

  // Local storage persistence helper for smooth preview
  useEffect(() => {
    try {
      const savedDevices = localStorage.getItem('tfk_devices');
      if (savedDevices) setDevices(JSON.parse(savedDevices));
      const savedProjects = localStorage.getItem('tfk_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      const savedDonations = localStorage.getItem('tfk_donations');
      if (savedDonations) setDonations(JSON.parse(savedDonations));
      const savedOrgs = localStorage.getItem('tfk_orgs');
      if (savedOrgs) setOrganizations(JSON.parse(savedOrgs));
    } catch {
      // ignore
    }
  }, []);

  const addAuditLog = (actorName: string, actorRole: any, action: string, targetType: any, targetId: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      actorName,
      actorEmail: 'system@techforkids.org',
      actorRole,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const submitDeviceDonation = (data: Omit<DeviceDonation, 'id' | 'trackingCode' | 'status' | 'statusHistory' | 'createdAt'>): string => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const trackingCode = `TFK-${randomNum}`;
    const id = `dev_${Date.now()}`;
    const newDevice: DeviceDonation = {
      ...data,
      id,
      trackingCode,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          note: 'Donation intake details received online. Evaluation queue pending.',
        }
      ],
      createdAt: new Date().toISOString(),
    };

    setDevices(prev => {
      const updated = [newDevice, ...prev];
      try { localStorage.setItem('tfk_devices', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog(data.donorName, 'donor', 'DEVICE_SUBMITTED', 'device', trackingCode, `Submitted ${data.manufacturer} ${data.model} (${data.deviceType}) for evaluation`);
    return trackingCode;
  };

  const updateDeviceStatus = (deviceId: string, status: DeviceStatus, note: string, adminName: string) => {
    setDevices(prev => {
      const updated = prev.map(dev => {
        if (dev.id === deviceId || dev.trackingCode === deviceId) {
          return {
            ...dev,
            status,
            statusHistory: [
              ...dev.statusHistory,
              { status, timestamp: new Date().toISOString(), note }
            ]
          };
        }
        return dev;
      });
      try { localStorage.setItem('tfk_devices', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog(adminName, 'admin', 'DEVICE_STATUS_UPDATE', 'device', deviceId, `Device status transitioned to ${status}: ${note}`);
  };

  const applyForVolunteering = (appData: {
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
    opportunityId?: string;
  }) => {
    const opp = volunteerOpportunities.find(o => o.id === appData.opportunityId);
    const newProfile: VolunteerProfile = {
      id: `vol_${Date.now()}`,
      userId: `usr_vol_${Date.now()}`,
      name: appData.name,
      email: appData.email,
      skills: appData.skills,
      experienceYears: appData.experienceYears,
      availabilityHoursPerWeek: appData.availabilityHoursPerWeek,
      preferredMode: appData.preferredMode,
      preferredSubjects: appData.preferredSubjects,
      preferredAgeGroup: appData.preferredAgeGroup,
      location: appData.location,
      languages: appData.languages,
      bio: appData.bio,
      safeguardingConsent: true,
      hoursVolunteered: 0,
      workshopsCompleted: 0,
      studentsReached: 0,
      applications: opp ? [
        {
          id: `app_${Date.now()}`,
          opportunityId: opp.id,
          projectTitle: opp.projectTitle,
          organizationName: opp.organizationName,
          status: 'pending',
          appliedAt: new Date().toISOString(),
        }
      ] : []
    };

    setVolunteerProfiles(prev => [newProfile, ...prev]);
    addAuditLog(appData.name, 'volunteer', 'VOLUNTEER_APPLIED', 'volunteer', newProfile.id, `Volunteer profile created with ${appData.skills.join(', ')} skills`);
  };

  const logVolunteerHours = (profileId: string, hours: number, workshopNote: string) => {
    setVolunteerProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return {
          ...p,
          hoursVolunteered: p.hoursVolunteered + hours,
          workshopsCompleted: p.workshopsCompleted + 1,
          studentsReached: p.studentsReached + 12,
        };
      }
      return p;
    }));

    addAuditLog('Coordinator', 'ngo', 'VOLUNTEER_HOURS_LOGGED', 'volunteer', profileId, `Logged ${hours} hours: ${workshopNote}`);
  };

  const submitDonationIntent = (intentData: {
    donorName: string;
    donorEmail: string;
    isAnonymous: boolean;
    projectId: string;
    amount: number;
    allocatedNeedType?: string;
    message?: string;
  }): string => {
    const proj = projects.find(p => p.id === intentData.projectId);
    const receiptNumber = `TFK-DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationIntent = {
      id: `don_${Date.now()}`,
      receiptNumber,
      donorName: intentData.donorName,
      donorEmail: intentData.donorEmail,
      isAnonymous: intentData.isAnonymous,
      projectId: intentData.projectId,
      projectTitle: proj?.title || 'General Tech Support Project',
      organizationName: proj?.organizationName || 'Verified Partner Organization',
      amount: intentData.amount,
      currency: 'INR',
      allocatedNeedType: intentData.allocatedNeedType || 'refurbishment_fund',
      message: intentData.message,
      status: 'successful',
      taxExemptEligible: true,
      complianceNotice: 'Project support intent recorded. Partner 80G tax confirmation processed.',
      createdAt: new Date().toISOString(),
    };

    setDonations(prev => {
      const updated = [newDonation, ...prev];
      try { localStorage.setItem('tfk_donations', JSON.stringify(updated)); } catch {}
      return updated;
    });

    // Update project progress
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id === intentData.projectId) {
          const newCurrent = p.currentValue + intentData.amount;
          const newPct = Math.min(100, Math.round((newCurrent / p.goalValue) * 100));
          return {
            ...p,
            currentValue: newCurrent,
            progressPercentage: newPct,
          };
        }
        return p;
      });
      try { localStorage.setItem('tfk_projects', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog(intentData.donorName, 'donor', 'DONATION_PLEDGED', 'donation', receiptNumber, `Pledged ₹${intentData.amount.toLocaleString()} for ${proj?.title}`);
    return receiptNumber;
  };

  const createProject = (projectData: Partial<Project>, organizationId: string): string => {
    const org = organizations.find(o => o.id === organizationId) || organizations[0];
    const id = `proj_${Date.now()}`;
    const slug = (projectData.title || 'new-project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const newProject: Project = {
      id,
      slug,
      title: projectData.title || 'Untitled Initiative',
      tagline: projectData.tagline || 'Technology assistance for community learning.',
      description: projectData.description || '',
      whyItMatters: projectData.whyItMatters || '',
      whatSupportProvides: projectData.whatSupportProvides || '',
      organizationId: org.id,
      organizationName: org.name,
      organizationVerified: org.verificationStatus === 'verified',
      category: projectData.category || 'Technology',
      region: projectData.region || org.location,
      beneficiaryGroup: projectData.beneficiaryGroup || 'Students in local community care',
      targetStudents: projectData.targetStudents || 25,
      status: 'pending_approval',
      urgency: projectData.urgency || 'normal',
      heroImageUrl: projectData.heroImageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
      goalValue: projectData.goalValue || 25000,
      currentValue: 0,
      progressPercentage: 0,
      needs: [],
      milestones: [
        {
          id: `ms_${Date.now()}`,
          title: 'Project Inception & Safety Baseline',
          description: 'Classroom preparation and safeguarding verification completed.',
          targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          completed: false,
        }
      ],
      updates: [],
      impactSummary: {
        studentsReached: 0,
        computersInstalled: 0,
        volunteerHoursLogged: 0,
        workshopsConducted: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFictionalDemo: true,
    };

    setProjects(prev => {
      const updated = [newProject, ...prev];
      try { localStorage.setItem('tfk_projects', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog(org.contactPerson, 'ngo', 'PROJECT_CREATED', 'project', id, `Submitted project "${newProject.title}" for admin moderation`);
    return slug;
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus, adminName: string) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p);
      try { localStorage.setItem('tfk_projects', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog(adminName, 'admin', 'PROJECT_STATUS_UPDATE', 'project', projectId, `Project status changed to ${status}`);
  };

  const addProjectMilestone = (projectId: string, title: string, description: string, targetDate: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: [
            ...p.milestones,
            { id: `ms_${Date.now()}`, title, description, targetDate, completed: false }
          ]
        };
      }
      return p;
    }));
  };

  const addProjectUpdate = (projectId: string, title: string, content: string, authorName: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          updates: [
            {
              id: `upd_${Date.now()}`,
              projectId,
              title,
              content,
              postedAt: new Date().toISOString(),
              authorName,
              isSafeguardedChecked: true,
            },
            ...p.updates
          ]
        };
      }
      return p;
    }));

    addAuditLog(authorName, 'ngo', 'PROJECT_UPDATE_POSTED', 'project', projectId, `Published update: ${title}`);
  };

  const updateOrganizationStatus = (orgId: string, status: OrganizationVerificationStatus, adminName: string) => {
    setOrganizations(prev => {
      const updated = prev.map(o => o.id === orgId ? {
        ...o,
        verificationStatus: status,
        verifiedAt: status === 'verified' ? new Date().toISOString() : o.verifiedAt
      } : o);
      try { localStorage.setItem('tfk_orgs', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog(adminName, 'admin', 'ORGANIZATION_STATUS_UPDATE', 'organization', orgId, `Verification status updated to ${status}`);
  };

  const publishImpactReport = (reportData: Omit<ImpactReport, 'id' | 'publishedAt' | 'verifiedByAdmin'>) => {
    const newReport: ImpactReport = {
      ...reportData,
      id: `imp_${Date.now()}`,
      verifiedByAdmin: true,
      publishedAt: new Date().toISOString(),
    };

    setImpactReports(prev => [newReport, ...prev]);
    addAuditLog('Coordinator', 'ngo', 'IMPACT_REPORT_PUBLISHED', 'project', reportData.projectId, `Impact report published: ${reportData.headline}`);
  };

  const submitSafeguardingReport = (report: Omit<SafeguardingReport, 'id' | 'status' | 'createdAt'>) => {
    const newRep: SafeguardingReport = {
      ...report,
      id: `safe_${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setSafeguardingReports(prev => [newRep, ...prev]);
    addAuditLog(report.reporterName, 'visitor', 'SAFEGUARDING_FLAG_RAISED', 'safeguarding_report', newRep.id, `Report filed regarding ${report.subjectType} (${report.subjectId})`);
  };

  return (
    <StoreContext.Provider
      value={{
        organizations,
        projects,
        needs,
        devices,
        volunteerOpportunities,
        volunteerProfiles,
        donations,
        impactReports,
        auditLogs,
        safeguardingReports,
        submitDeviceDonation,
        updateDeviceStatus,
        applyForVolunteering,
        logVolunteerHours,
        submitDonationIntent,
        createProject,
        updateProjectStatus,
        addProjectMilestone,
        addProjectUpdate,
        updateOrganizationStatus,
        publishImpactReport,
        submitSafeguardingReport,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
