export type ReportStatus = 'urgent' | 'pending' | 'in_progress' | 'resolved';

export type ReportCategory = 'waste' | 'lighting' | 'road' | 'drainage' | 'safety';

export type AuthorRole = 'resident' | 'official' | 'governor';

export interface ReportComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: AuthorRole;
  timestamp: string;
  content: string;
  isOfficial?: boolean;
}

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  barangay: string;
  status: ReportStatus;
  date: string;
  upvotes: number;
  imageUrl?: string;
  authorName?: string;
  authorAvatar?: string;
  authorRole?: AuthorRole;
  officialNotes?: string;
  officialActorName?: string;
  officialActorRole?: string;
  comments?: ReportComment[];
  isAnonymous?: boolean;
  anonymousAlias?: string;
  authorUid?: string;
  authorRealName?: string;
  authorVerificationStatus?: string;
}

export interface TimelineEvent {
  title: string;
  departmentOrActor: string;
  timestamp: string;
  notes: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface DetailedReport extends CommunityReport {
  locationDetails?: string;
  submittedBy?: string;
  assignedDepartment?: string;
  timeline?: TimelineEvent[];
}

export interface ReportFilters {
  barangay?: string;
  category?: ReportCategory | 'all';
  status?: ReportStatus | 'all';
  search?: string;
}

export interface CreateReportInput {
  title: string;
  description: string;
  category: ReportCategory;
  barangay: string;
  locationDetail?: string;
  imageUri?: string | null;
  isAnonymous?: boolean;
  anonymousAlias?: string;
  authorUid?: string;
  authorName?: string;
  authorRealName?: string;
  authorAvatar?: string;
  authorRole?: AuthorRole;
  authorVerificationStatus?: string;
}

export interface AddCommentInput {
  content: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: AuthorRole;
  isOfficial?: boolean;
  authorUid: string;
}

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'barangay_verified'
  | 'community_leader'
  | 'municipal_officer'
  | 'rejected';

export interface CivicUser {
  id: string;
  name: string;
  role: 'resident' | 'official';
  barangayOrOffice: string;
  reportsCount: number;
  registeredDate: string;
  authProvider: 'google' | 'municipal_credentials';
  verificationStatus: VerificationStatus;
}
