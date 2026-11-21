import type { ReportCategory, ReportStatus, VerificationStatus } from '@/types';

export const PAETE_BARANGAYS = [
  'Bagumbayan',
  'Bangkusay',
  'Ermita',
  'Ibaba del Norte',
  'Ibaba del Sur',
  'Ilaya del Norte',
  'Ilaya del Sur',
  'Maytoong',
  'Quinale',
] as const;

export const PAETE_LANDMARKS = [
  'Paete Municipal Hall',
  'Paete Public Market',
  'St. James the Apostle Parish Church',
  'Paete Central Elementary School',
  'Laguna de Bay shoreline',
  'Barangay Hall',
  'Paete Sports Complex',
  'Ukit carving district',
  'Paete Public Cemetery',
  'Municipal Health Center',
  'Paete National High School',
  'Quinale Beach',
] as const;

type CategoryMeta = { label: string; short: string };

export const CATEGORIES: Record<ReportCategory, CategoryMeta> = {
  waste: { label: 'Solid Waste & Sanitation', short: 'Solid Waste' },
  lighting: { label: 'Streetlights & Electrical Grid', short: 'Streetlights' },
  road: { label: 'Road Maintenance & Potholes', short: 'Roads & Potholes' },
  drainage: { label: 'Drainage & Flood Channels', short: 'Drainage Channels' },
  safety: { label: 'Public Safety & Physical Hazards', short: 'Public Safety' },
};

export const CATEGORY_ORDER: ReportCategory[] = ['waste', 'lighting', 'road', 'drainage', 'safety'];

type StatusMeta = { label: string; short: string; step: number };

export const STATUS_META: Record<ReportStatus, StatusMeta> = {
  pending: { label: 'Pending Verification', short: 'Pending', step: 1 },
  urgent: { label: 'Critical Hazard', short: 'Urgent', step: 1 },
  in_progress: { label: 'In Progress', short: 'In Progress', step: 2 },
  resolved: { label: 'Resolved', short: 'Resolved', step: 3 },
};

export const STATUS_ORDER: ReportStatus[] = ['pending', 'urgent', 'in_progress', 'resolved'];

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  unverified: 'Not Verified',
  pending: 'Verification In Progress',
  barangay_verified: 'Barangay Verified',
  community_leader: 'Community Leader',
  municipal_officer: 'Municipal Officer',
  rejected: 'Verification Rejected',
};

export const VERIFIED_STATUSES: VerificationStatus[] = [
  'barangay_verified',
  'community_leader',
  'municipal_officer',
];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_DIMENSION = 1920;
export const IMAGE_QUALITY = 0.82;
export const ANONYMOUS_ALIAS = 'Protected Citizen';

export const BLOCKED_MESSAGES = {
  signInRequired: 'Citizen sign-in is required to submit a community report.',
  imageTooLarge: 'Image file size must not exceed 5MB.',
  imageRequired: 'A photo of the reported concern is required for verification.',
  titleRequired: 'Please provide a short title for your report.',
  descriptionRequired: 'Please describe the concern you are reporting.',
  barangayRequired: 'Please select the barangay where the concern is located.',
  categoryRequired: 'Please select the category that best fits your report.',
  notConfigured: 'Firebase is not configured for this build. Set EXPO_PUBLIC_FIREBASE_* in mobile/.env.local.',
  anonymousBlocked: 'Municipal Administrators and Provincial Governors are not permitted to submit community reports. Reports must originate from verified residents.',
} as const;
