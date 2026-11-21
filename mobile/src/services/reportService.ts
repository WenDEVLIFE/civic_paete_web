import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

import { ANONYMOUS_ALIAS, BLOCKED_MESSAGES } from '@/constants';
import { formatCommentTimestamp, formatLongDate } from '@/lib/format';
import { requireDb } from '@/lib/firebase';
import { uploadReportImage } from '@/storage/uploadReportImage';
import type {
  AddCommentInput,
  CommunityReport,
  CreateReportInput,
  DetailedReport,
  ReportComment,
  ReportFilters,
  ReportStatus,
  TimelineEvent,
} from '@/types';

const VOTER_ID_KEY = 'civic_paete_voter_id';
const CATEGORY_VALUES = ['waste', 'lighting', 'road', 'drainage', 'safety'];
const STATUS_VALUES = ['urgent', 'pending', 'in_progress', 'resolved'];

function readCategory(value: unknown): CommunityReport['category'] {
  return CATEGORY_VALUES.includes(value as string)
    ? (value as CommunityReport['category'])
    : 'waste';
}

function readStatus(value: unknown): ReportStatus {
  return STATUS_VALUES.includes(value as string) ? (value as ReportStatus) : 'pending';
}

function mapReport(id: string, data: DocumentData): CommunityReport {
  return {
    id,
    title: typeof data.title === 'string' ? data.title : 'Untitled report',
    description: typeof data.description === 'string' ? data.description : '',
    category: readCategory(data.category),
    barangay: typeof data.barangay === 'string' ? data.barangay : 'Unassigned',
    status: readStatus(data.status),
    date: typeof data.date === 'string' ? data.date : formatLongDate(),
    upvotes: typeof data.upvotes === 'number' ? data.upvotes : 0,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
    authorName: typeof data.authorName === 'string' ? data.authorName : undefined,
    authorAvatar: typeof data.authorAvatar === 'string' ? data.authorAvatar : undefined,
    authorRole: data.authorRole === 'official' || data.authorRole === 'governor' ? data.authorRole : 'resident',
    officialNotes: typeof data.officialNotes === 'string' ? data.officialNotes : undefined,
    officialActorName: typeof data.officialActorName === 'string' ? data.officialActorName : undefined,
    officialActorRole: typeof data.officialActorRole === 'string' ? data.officialActorRole : undefined,
    isAnonymous: Boolean(data.isAnonymous),
    anonymousAlias: typeof data.anonymousAlias === 'string' ? data.anonymousAlias : undefined,
    authorUid: typeof data.authorUid === 'string' ? data.authorUid : undefined,
    authorRealName: typeof data.authorRealName === 'string' ? data.authorRealName : undefined,
    authorEmail: typeof data.authorEmail === 'string' ? data.authorEmail : undefined,
    authorVerificationStatus:
      typeof data.authorVerificationStatus === 'string' ? data.authorVerificationStatus : undefined,
  };
}

function mapTimeline(value: unknown): TimelineEvent[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((entry): entry is DocumentData => Boolean(entry) && typeof entry === 'object')
    .map((entry) => ({
      title: typeof entry.title === 'string' ? entry.title : 'Update',
      departmentOrActor:
        typeof entry.departmentOrActor === 'string' ? entry.departmentOrActor : 'Paete Municipal Hall',
      timestamp: typeof entry.timestamp === 'string' ? entry.timestamp : 'Pending',
      notes: typeof entry.notes === 'string' ? entry.notes : '',
      status:
        entry.status === 'completed' || entry.status === 'current' || entry.status === 'upcoming'
          ? entry.status
          : 'upcoming',
    }));
}

function mapDetailedReport(id: string, data: DocumentData): DetailedReport {
  return {
    ...mapReport(id, data),
    locationDetails: typeof data.locationDetail === 'string' ? data.locationDetail : undefined,
    submittedBy: typeof data.submittedBy === 'string' ? data.submittedBy : undefined,
    assignedDepartment:
      typeof data.assignedDepartment === 'string' ? data.assignedDepartment : undefined,
    timeline: mapTimeline(data.timeline),
  };
}

function matchesFilters(report: CommunityReport, filters: ReportFilters): boolean {
  if (filters.barangay && filters.barangay !== 'all' && report.barangay !== filters.barangay) {
    return false;
  }
  if (filters.category && filters.category !== 'all' && report.category !== filters.category) {
    return false;
  }
  if (filters.status && filters.status !== 'all' && report.status !== filters.status) {
    return false;
  }
  if (filters.search) {
    const needle = filters.search.trim().toLowerCase();
    if (needle) {
      const haystack = `${report.title} ${report.description} ${report.barangay}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
  }
  return true;
}

/**
 * Stable per-device voter identity for guests, mirroring the web client's
 * `civic_paete_voter_id` localStorage entry.
 */
export async function getOrCreateDeviceVoterId(): Promise<string> {
  const existing = await AsyncStorage.getItem(VOTER_ID_KEY);
  if (existing) return existing;

  const generated = `voter_${Crypto.randomUUID()}`;
  await AsyncStorage.setItem(VOTER_ID_KEY, generated);
  return generated;
}

export function filterReports(
  reports: CommunityReport[],
  filters: ReportFilters
): CommunityReport[] {
  return reports.filter((report) => matchesFilters(report, filters));
}

export function subscribeToReports(
  filters: ReportFilters,
  callback: (reports: CommunityReport[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const reportsQuery = query(collection(requireDb(), 'reports'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const reports = snapshot.docs.map((entry) => mapReport(entry.id, entry.data()));
      callback(reports.filter((report) => matchesFilters(report, filters)));
    },
    (error) => {
      console.warn('Reports listener notice:', error);
      onError?.(error);
    }
  );
}

export function subscribeToReportById(
  reportId: string,
  callback: (report: DetailedReport | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), 'reports', reportId),
    (snapshot) => {
      callback(snapshot.exists() ? mapDetailedReport(snapshot.id, snapshot.data()) : null);
    },
    (error) => {
      console.warn(`Report listener notice for ${reportId}:`, error);
      onError?.(error);
    }
  );
}

export async function createReport(input: CreateReportInput): Promise<string> {
  if (!input.authorUid) {
    throw new Error(BLOCKED_MESSAGES.signInRequired);
  }
  if (input.authorRole === 'governor' || input.authorRole === 'official') {
    throw new Error(BLOCKED_MESSAGES.anonymousBlocked);
  }

  const database = requireDb();
  const newReportRef = doc(collection(database, 'reports'));
  const reportId = newReportRef.id;

  let finalImageUrl: string | undefined;
  if (input.imageUri) {
    try {
      finalImageUrl = await uploadReportImage({
        uri: input.imageUri,
        barangay: input.barangay,
        reportId,
      });
    } catch (error) {
      console.warn('Report photo upload failed:', error);
      throw new Error('Photo upload failed. Check your connection and try submitting again.');
    }
  }

  const currentDateStr = formatLongDate();
  const isAnonymous = Boolean(input.isAnonymous);

  await setDoc(newReportRef, {
    id: reportId,
    title: input.title,
    description: input.description,
    category: input.category,
    barangay: input.barangay,
    locationDetail: input.locationDetail || '',
    status: 'pending' as ReportStatus,
    date: currentDateStr,
    upvotes: 0,
    imageUrl: finalImageUrl ?? null,
    isAnonymous,
    anonymousAlias: isAnonymous ? input.anonymousAlias || ANONYMOUS_ALIAS : null,
    authorUid: input.authorUid,
    authorRealName: input.authorRealName || input.authorName || 'Paete Resident',
    authorEmail: input.authorEmail || null,
    authorVerificationStatus: input.authorVerificationStatus || 'unverified',
    authorName: isAnonymous ? null : input.authorName || input.authorRealName || 'Resident',
    authorAvatar: isAnonymous ? null : input.authorAvatar || null,
    authorRole: input.authorRole || 'resident',
    officialNotes: null,
    officialActorName: null,
    officialActorRole: null,
    comments: [],
    timeline: [
      {
        title: 'Report Submitted',
        departmentOrActor: 'Citizen Verification Hub',
        timestamp: currentDateStr,
        notes: 'Community report entered public triage queue.',
        status: 'completed',
      },
      {
        title: 'Barangay & Municipal Dispatch',
        departmentOrActor: 'Paete Municipal Hall',
        timestamp: 'Pending',
        notes: 'Awaiting inspection and crew scheduling.',
        status: 'upcoming',
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return reportId;
}

export async function toggleReportUpvote(
  reportId: string,
  userId: string
): Promise<{ hasUpvoted: boolean; newCount: number }> {
  const database = requireDb();
  const reportRef = doc(database, 'reports', reportId);
  const upvoteDocRef = doc(database, 'reports', reportId, 'upvotes', userId);

  return runTransaction(database, async (transaction) => {
    const reportSnap = await transaction.get(reportRef);
    if (!reportSnap.exists()) {
      throw new Error(`Report ${reportId} not found.`);
    }

    const upvoteSnap = await transaction.get(upvoteDocRef);
    const reportData = reportSnap.data();
    const currentUpvotes = typeof reportData.upvotes === 'number' ? reportData.upvotes : 0;

    if (upvoteSnap.exists()) {
      const newCount = Math.max(0, currentUpvotes - 1);
      transaction.delete(upvoteDocRef);
      transaction.update(reportRef, { upvotes: newCount, updatedAt: serverTimestamp() });
      return { hasUpvoted: false, newCount };
    }

    const newCount = currentUpvotes + 1;
    transaction.set(upvoteDocRef, { userId, reportId, createdAt: serverTimestamp() });
    transaction.update(reportRef, { upvotes: newCount, updatedAt: serverTimestamp() });
    return { hasUpvoted: true, newCount };
  });
}

export function subscribeToReportUpvoteStatus(
  reportId: string,
  userId: string,
  callback: (hasUpvoted: boolean) => void
): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), 'reports', reportId, 'upvotes', userId),
    (snapshot) => callback(snapshot.exists()),
    () => callback(false)
  );
}

export function subscribeToReportComments(
  reportId: string,
  callback: (comments: ReportComment[]) => void
): Unsubscribe {
  const database = requireDb();
  const commentsQuery = query(
    collection(database, 'reports', reportId, 'comments'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    commentsQuery,
    async (snapshot) => {
      if (!snapshot.empty) {
        callback(
          snapshot.docs.map((entry) => {
            const data = entry.data();
            return {
              id: entry.id,
              authorName: data.authorName || 'Verified Resident',
              authorAvatar: data.authorAvatar || undefined,
              authorRole:
                data.authorRole === 'official' || data.authorRole === 'governor'
                  ? data.authorRole
                  : 'resident',
              timestamp: formatCommentTimestamp(data.createdAt),
              content: data.content || '',
              isOfficial: Boolean(data.isOfficial),
            };
          })
        );
        return;
      }

      // Legacy reports kept their comments in an array on the parent document.
      try {
        const reportSnap = await getDoc(doc(database, 'reports', reportId));
        const legacy = reportSnap.data()?.comments;
        if (Array.isArray(legacy) && legacy.length > 0) {
          callback(
            legacy.map((comment: ReportComment) => ({
              ...comment,
              id: comment.id || `legacy-${comment.timestamp}`,
            }))
          );
          return;
        }
      } catch {
        // Reading legacy comments is best-effort.
      }

      callback([]);
    },
    (error) => {
      console.warn(`Comments listener notice for ${reportId}:`, error);
      callback([]);
    }
  );
}

export async function addReportComment(
  reportId: string,
  comment: AddCommentInput
): Promise<string> {
  const database = requireDb();
  const newCommentRef = doc(collection(database, 'reports', reportId, 'comments'));
  const isAuthorizedOfficial = comment.authorRole === 'official' || comment.authorRole === 'governor';

  await setDoc(newCommentRef, {
    id: newCommentRef.id,
    reportId,
    authorName: comment.authorName || 'Paete Resident',
    authorAvatar: comment.authorAvatar || null,
    authorRole: comment.authorRole || 'resident',
    content: comment.content.trim(),
    isOfficial: Boolean(comment.isOfficial && isAuthorizedOfficial),
    createdAt: serverTimestamp(),
  });

  return newCommentRef.id;
}
