import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  increment,
  runTransaction,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CommunityReport,
  ReportStatus,
  ReportComment,
} from "@/components/reports/ReportCard";
import { uploadReportImage } from "@/lib/storage/uploadReportImage";
import { isUserAdminOrGovernor } from "@/lib/roleHelper";

export interface CreateReportInput {
  title: string;
  description: string;
  category: "waste" | "lighting" | "road" | "drainage" | "safety";
  barangay: string;
  locationDetail?: string;
  imageFile?: File | null;
  imageUrl?: string;
  isAnonymous?: boolean;
  anonymousAlias?: string;
  authorUid?: string;
  authorName?: string;
  authorAvatar?: string;
  authorRole?: "resident" | "official" | "governor";
}

export interface ReportFilters {
  barangay?: string;
  category?: string;
  status?: ReportStatus | "all";
}

export interface TimelineEvent {
  title: string;
  departmentOrActor: string;
  timestamp: string;
  notes: string;
  status: "completed" | "current" | "upcoming";
}

export interface DetailedReport extends CommunityReport {
  locationDetails?: string;
  submittedBy?: string;
  assignedDepartment?: string;
  timeline?: TimelineEvent[];
}

/**
 * Seeds initial baseline Paete community reports if collection is currently empty.
 */
const SEED_REPORTS: Omit<CommunityReport, "id">[] = [
  {
    title: "Non-functional Streetlights along Quesada Street",
    description:
      "A dark stretch of road at night creating hazardous transit conditions for students and commuters returning home. Three adjacent lamp posts have been unlit since last week.",
    category: "lighting",
    barangay: "Bagumbayan",
    status: "in_progress",
    date: "September 24, 2026",
    upvotes: 18,
    authorName: "Juan Dela Cruz",
    authorRole: "resident",
    officialNotes:
      "Inspected by electrical maintenance crew. Scheduled for 100W LED lamp fixture replacement tomorrow morning.",
    officialActorName: "Engr. Marco Adea",
    officialActorRole: "Municipal Engineering Office",
    comments: [
      {
        id: "c-1",
        authorName: "Maria Santos",
        authorRole: "resident",
        timestamp: "2 days ago",
        content:
          "Corroborated. This corner is completely dark past 8:00 PM when retail staff and students walk home.",
      },
      {
        id: "c-2",
        authorName: "Engr. Marco Adea",
        authorRole: "official",
        timestamp: "Yesterday",
        content:
          "Materials requisitioned from municipal motorpool. Crew scheduled on-site at 9:00 AM.",
        isOfficial: true,
      },
    ],
  },
  {
    title: "Severe Drainage Blockage near Paete Central Elementary",
    description:
      "Stagnant runoff and storm drainage overflow spilling onto sidewalk after afternoon rain. Accumulation of silt and fallen foliage causing persistent pedestrian obstruction.",
    category: "drainage",
    barangay: "Ilaya del Norte",
    status: "urgent",
    date: "September 25, 2026",
    upvotes: 34,
    authorName: "Teresa Mendoza",
    authorRole: "resident",
    officialNotes:
      "MDRRMO emergency desilting dispatched. Backhoe and utility crew currently on site clearing canal bottleneck.",
    officialActorName: "MDRRMO Paete",
    officialActorRole: "Disaster Risk Reduction Office",
    comments: [
      {
        id: "c-3",
        authorName: "Kagawad Benjie",
        authorRole: "official",
        timestamp: "5 hours ago",
        content:
          "Barangay Tanods assisting in perimeter safety. Half-culvert cleared as of 11:30 AM.",
        isOfficial: true,
      },
    ],
  },
  {
    title: "Uncollected Commercial Woodcarving Offcuts & Solid Waste",
    description:
      "Piles of untreated sawdust sacks and splintered softwood scrap blocking corner easement. Potential fire safety hazard if left unattended through the weekend.",
    category: "waste",
    barangay: "Quinale",
    status: "pending",
    date: "September 26, 2026",
    upvotes: 9,
    authorName: "Protected Citizen #402",
    authorRole: "resident",
    isAnonymous: true,
    anonymousAlias: "Protected Citizen #402",
    comments: [],
  },
];

/**
 * Creates a new community report in Firestore, uploading an image if attached.
 */
export async function createReport(data: CreateReportInput): Promise<string> {
  // Prevent Admin or Governor accounts from submitting reports
  if (
    isUserAdminOrGovernor() ||
    data.authorRole === "governor" ||
    data.authorRole === "official"
  ) {
    throw new Error(
      "Municipal Administrators and Provincial Governors are not permitted to submit community reports. Reports must originate from verified residents."
    );
  }

  const reportsCollection = collection(db, "reports");
  const newReportRef = doc(reportsCollection);
  const reportId = newReportRef.id;

  let finalImageUrl = data.imageUrl || undefined;

  // 1. Upload image to Firebase Storage if provided as a File
  if (data.imageFile) {
    try {
      finalImageUrl = await uploadReportImage({
        file: data.imageFile,
        barangay: data.barangay,
        reportId,
      });
    } catch (uploadErr) {
      console.warn("Storage upload notice (falling back without image):", uploadErr);
    }
  }

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const newDocData = {
    id: reportId,
    title: data.title,
    description: data.description,
    category: data.category,
    barangay: data.barangay,
    locationDetail: data.locationDetail || "",
    status: "pending" as ReportStatus,
    date: currentDateStr,
    upvotes: 0,
    imageUrl: finalImageUrl || null,
    isAnonymous: Boolean(data.isAnonymous),
    anonymousAlias: data.isAnonymous ? data.anonymousAlias || "Protected Citizen" : null,
    authorUid: data.authorUid || null,
    authorName: data.isAnonymous ? null : data.authorName || "Resident",
    authorAvatar: data.isAnonymous ? null : data.authorAvatar || null,
    authorRole: data.authorRole || "resident",
    officialNotes: null,
    officialActorName: null,
    officialActorRole: null,
    comments: [],
    timeline: [
      {
        title: "Report Submitted",
        departmentOrActor: "Citizen Verification Hub",
        timestamp: currentDateStr,
        notes: "Community report entered public triage queue.",
        status: "completed",
      },
      {
        title: "Barangay & Municipal Dispatch",
        departmentOrActor: "Paete Municipal Hall",
        timestamp: "Pending",
        notes: "Awaiting inspection and crew scheduling.",
        status: "upcoming",
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newReportRef, newDocData);
  return reportId;
}

/**
 * Fetches all community reports from Firestore matching the given filters.
 */
export async function getReports(filters?: ReportFilters): Promise<CommunityReport[]> {
  const reportsCollection = collection(db, "reports");
  let q = query(reportsCollection, orderBy("createdAt", "desc"));

  if (filters?.barangay && filters.barangay !== "all") {
    q = query(q, where("barangay", "==", filters.barangay));
  }
  if (filters?.category && filters.category !== "all") {
    q = query(q, where("category", "==", filters.category));
  }
  if (filters?.status && filters.status !== "all") {
    q = query(q, where("status", "==", filters.status));
  }

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // If empty on first read, seed initial baseline reports
    await seedInitialReportsIfEmpty();
    return (await getDocs(q)).docs.map((docSnap) => docSnap.data() as CommunityReport);
  }

  return snapshot.docs.map((docSnap) => docSnap.data() as CommunityReport);
}

/**
 * Real-time listener for community reports in Firestore.
 */
export function subscribeToReports(
  filters: ReportFilters,
  callback: (reports: CommunityReport[]) => void
): Unsubscribe {
  const reportsCollection = collection(db, "reports");

  return onSnapshot(
    reportsCollection,
    async (snapshot) => {
      if (snapshot.empty) {
        // Automatically seed baseline reports if empty
        await seedInitialReportsIfEmpty();
        return;
      }

      let items: CommunityReport[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          description: data.description || "",
          category: data.category || "waste",
          barangay: data.barangay || "Bagumbayan",
          status: data.status || "pending",
          date: data.date || "Recently",
          upvotes: typeof data.upvotes === "number" ? data.upvotes : 0,
          imageUrl: data.imageUrl || undefined,
          isAnonymous: Boolean(data.isAnonymous),
          anonymousAlias: data.anonymousAlias || undefined,
          authorName: data.authorName || undefined,
          authorAvatar: data.authorAvatar || undefined,
          authorRole: data.authorRole || "resident",
          officialNotes: data.officialNotes || undefined,
          officialActorName: data.officialActorName || undefined,
          officialActorRole: data.officialActorRole || undefined,
          comments: Array.isArray(data.comments) ? data.comments : [],
          createdAt: data.createdAt,
        };
      });

      // Sort newest first by createdAt seconds or fallback
      items.sort((a, b) => {
        const timeA = (a as unknown as { createdAt?: { seconds: number } }).createdAt?.seconds || 0;
        const timeB = (b as unknown as { createdAt?: { seconds: number } }).createdAt?.seconds || 0;
        return timeB - timeA;
      });

      // Apply client-side in-memory filter matching
      if (filters.barangay && filters.barangay !== "all") {
        items = items.filter((rep) => rep.barangay === filters.barangay);
      }
      if (filters.category && filters.category !== "all") {
        items = items.filter((rep) => rep.category === filters.category);
      }
      if (filters.status && filters.status !== "all") {
        items = items.filter((rep) => rep.status === filters.status);
      }

      callback(items);
    },
    (err) => {
      console.warn("Firestore reports subscription notice:", err);
    }
  );
}

/**
 * Fetches a single detailed report by ID.
 */
export async function getReportById(reportId: string): Promise<DetailedReport | null> {
  const docRef = doc(db, "reports", reportId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || "",
    description: data.description || "",
    category: data.category || "waste",
    barangay: data.barangay || "Bagumbayan",
    locationDetails: data.locationDetail || data.locationDetails || "Municipality of Paete",
    submittedBy: data.isAnonymous
      ? data.anonymousAlias || "Protected Citizen"
      : data.authorName || "Verified Resident",
    status: data.status || "pending",
    date: data.date || "Recently",
    upvotes: typeof data.upvotes === "number" ? data.upvotes : 0,
    assignedDepartment: data.officialActorRole || "Municipal Public Services Office",
    imageUrl: data.imageUrl || undefined,
    isAnonymous: Boolean(data.isAnonymous),
    anonymousAlias: data.anonymousAlias || undefined,
    authorName: data.authorName || undefined,
    authorAvatar: data.authorAvatar || undefined,
    authorRole: data.authorRole || "resident",
    officialNotes: data.officialNotes || undefined,
    officialActorName: data.officialActorName || undefined,
    officialActorRole: data.officialActorRole || undefined,
    comments: Array.isArray(data.comments) ? data.comments : [],
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
  };
}

/**
 * Real-time listener for a single report document.
 */
export function subscribeToReportById(
  reportId: string,
  callback: (report: DetailedReport | null) => void
): Unsubscribe {
  const docRef = doc(db, "reports", reportId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        callback(null);
        return;
      }

      const data = docSnap.data();
      const detailed: DetailedReport = {
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        category: data.category || "waste",
        barangay: data.barangay || "Bagumbayan",
        locationDetails: data.locationDetail || data.locationDetails || "Municipality of Paete",
        submittedBy: data.isAnonymous
          ? data.anonymousAlias || "Protected Citizen"
          : data.authorName || "Verified Resident",
        status: data.status || "pending",
        date: data.date || "Recently",
        upvotes: typeof data.upvotes === "number" ? data.upvotes : 0,
        assignedDepartment: data.officialActorRole || "Municipal Public Services Office",
        imageUrl: data.imageUrl || undefined,
        isAnonymous: Boolean(data.isAnonymous),
        anonymousAlias: data.anonymousAlias || undefined,
        authorName: data.authorName || undefined,
        authorAvatar: data.authorAvatar || undefined,
        authorRole: data.authorRole || "resident",
        officialNotes: data.officialNotes || undefined,
        officialActorName: data.officialActorName || undefined,
        officialActorRole: data.officialActorRole || undefined,
        comments: Array.isArray(data.comments) ? data.comments : [],
        timeline: Array.isArray(data.timeline) ? data.timeline : [],
      };

      callback(detailed);
    },
    (err) => {
      console.warn("Single report subscription notice:", err);
      callback(null);
    }
  );
}

/**
 * Updates an official's disposition and status note on a report.
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  officerNotes?: string,
  officerName?: string,
  officerRole?: string
): Promise<void> {
  const docRef = doc(db, "reports", reportId);
  const docSnap = await getDoc(docRef);

  const updatePayload: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (officerNotes !== undefined) updatePayload.officialNotes = officerNotes;
  if (officerName !== undefined) updatePayload.officialActorName = officerName;
  if (officerRole !== undefined) updatePayload.officialActorRole = officerRole;

  let previousStatus = "pending";
  let barangay = "Paete";

  if (docSnap.exists()) {
    const existingData = docSnap.data();
    previousStatus = existingData.status || "pending";
    barangay = existingData.barangay || "Paete";
    const existingTimeline = Array.isArray(existingData.timeline) ? existingData.timeline : [];
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newTimelineItem: TimelineEvent = {
      title: `Official Status: ${status.replace("_", " ").toUpperCase()}`,
      departmentOrActor: officerRole
        ? `${officerName || "Official"} (${officerRole})`
        : officerName || "Municipal Official",
      timestamp: formattedDate,
      notes: officerNotes || `Status updated to ${status.replace("_", " ")}.`,
      status: "completed",
    };
    updatePayload.timeline = [newTimelineItem, ...existingTimeline];
  }

  await updateDoc(docRef, updatePayload);

  // 1. Trigger background official resolution metric recalculation on status changes
  import("@/lib/services/officialService")
    .then(({ recalculateOfficialMetrics }) => {
      recalculateOfficialMetrics().catch((err) =>
        console.warn("Background official metric recalculation notice:", err)
      );
    })
    .catch(() => {});

  // 2. Automatically log official status change to immutable government audit trail
  import("@/lib/services/auditService")
    .then(({ logStatusChange }) => {
      logStatusChange(
        reportId,
        previousStatus,
        status,
        {
          name: officerName || "Municipal Official",
          role: officerRole || "Municipal Administration",
        },
        barangay,
        officerNotes
      ).catch((err) =>
        console.warn("Background audit log write notice:", err)
      );
    })
    .catch(() => {});

  // 3. Dispatch automated push & in-app notification to the resident author
  if (docSnap.exists()) {
    const data = docSnap.data();
    const authorUid = data.authorUid || data.userId;
    const reportTitle = data.title || "Community Report";
    if (authorUid) {
      import("@/lib/services/notificationService")
        .then(({ dispatchStatusChangeNotification }) => {
          dispatchStatusChangeNotification(
            reportId,
            authorUid,
            reportTitle,
            status,
            officerNotes
          ).catch((err) =>
            console.warn("Background notification dispatch notice:", err)
          );
        })
        .catch(() => {});
    }
  }
}

/**
 * Helper to get or persist a stable device voter ID for guests / visitors.
 */
export function getOrCreateClientVoterId(): string {
  if (typeof window === "undefined") return "guest-client";
  let voterId = localStorage.getItem("civic_paete_voter_id");
  if (!voterId) {
    voterId = `voter_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    localStorage.setItem("civic_paete_voter_id", voterId);
  }
  return voterId;
}

/**
 * 2.2 Atomic Upvoting Engine (Anti-Spam)
 * Implements atomic upvote/un-upvote via Firestore transaction:
 * - Checks if `reports/{reportId}/upvotes/{userId}` exists.
 * - If exists: deletes document and decrements report `upvotes` by 1.
 * - If not: creates document and increments report `upvotes` by 1.
 */
export async function toggleReportUpvote(
  reportId: string,
  userId: string
): Promise<{ hasUpvoted: boolean; newCount: number }> {
  const reportRef = doc(db, "reports", reportId);
  const upvoteDocRef = doc(db, "reports", reportId, "upvotes", userId);

  return await runTransaction(db, async (transaction) => {
    const reportSnap = await transaction.get(reportRef);
    if (!reportSnap.exists()) {
      throw new Error(`Report ${reportId} not found.`);
    }

    const upvoteSnap = await transaction.get(upvoteDocRef);
    const reportData = reportSnap.data();
    const currentUpvotes =
      typeof reportData.upvotes === "number" ? reportData.upvotes : 0;

    if (upvoteSnap.exists()) {
      // User has already upvoted -> Un-upvote (decrement)
      const newCount = Math.max(0, currentUpvotes - 1);
      transaction.delete(upvoteDocRef);
      transaction.update(reportRef, {
        upvotes: newCount,
        updatedAt: serverTimestamp(),
      });
      return { hasUpvoted: false, newCount };
    } else {
      // User has not upvoted -> Upvote (increment)
      const newCount = currentUpvotes + 1;
      transaction.set(upvoteDocRef, {
        userId,
        reportId,
        createdAt: serverTimestamp(),
      });
      transaction.update(reportRef, {
        upvotes: newCount,
        updatedAt: serverTimestamp(),
      });
      return { hasUpvoted: true, newCount };
    }
  });
}

/**
 * Real-time listener for a user's upvote state on a specific report.
 */
export function subscribeToReportUpvoteStatus(
  reportId: string,
  userId: string,
  callback: (hasUpvoted: boolean) => void
): Unsubscribe {
  const upvoteDocRef = doc(db, "reports", reportId, "upvotes", userId);
  return onSnapshot(
    upvoteDocRef,
    (snapshot) => {
      callback(snapshot.exists());
    },
    (err) => {
      console.warn(`Upvote listener notice for report ${reportId}:`, err);
      callback(false);
    }
  );
}

/**
 * Format relative timestamp cleanly for display.
 */
function formatCommentTimestamp(val: unknown): string {
  if (!val) return "Just now";
  let date: Date;
  if (val instanceof Timestamp) {
    date = val.toDate();
  } else if (typeof val === "object" && val !== null && "toDate" in val) {
    date = (val as { toDate: () => Date }).toDate();
  } else if (typeof val === "string" || typeof val === "number") {
    date = new Date(val);
  } else {
    return "Just now";
  }

  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return "Just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * 2.3 Threaded Comments: Subcollection Realtime Listener
 * Listens to `reports/{reportId}/comments` ordered by createdAt ascending.
 */
export function subscribeToReportComments(
  reportId: string,
  callback: (comments: ReportComment[]) => void
): Unsubscribe {
  const commentsCol = collection(db, "reports", reportId, "comments");
  const q = query(commentsCol, orderBy("createdAt", "asc"));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Check if report has baseline seeded comments on the main document
        try {
          const reportSnap = await getDoc(doc(db, "reports", reportId));
          if (reportSnap.exists()) {
            const reportData = reportSnap.data();
            const legacyComments: ReportComment[] = Array.isArray(
              reportData.comments
            )
              ? reportData.comments
              : [];
            if (legacyComments.length > 0) {
              // Migrate legacy comments to subcollection
              for (const comm of legacyComments) {
                const newCommRef = doc(commentsCol);
                await setDoc(newCommRef, {
                  id: newCommRef.id,
                  authorName: comm.authorName,
                  authorAvatar: comm.authorAvatar || null,
                  authorRole: comm.authorRole || "resident",
                  content: comm.content,
                  isOfficial: Boolean(comm.isOfficial),
                  createdAt: serverTimestamp(),
                });
              }
              return;
            }
          }
        } catch {
          // ignore migration lookup error
        }
        callback([]);
        return;
      }

      const comments: ReportComment[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          authorName: data.authorName || "Verified Resident",
          authorAvatar: data.authorAvatar || undefined,
          authorRole: data.authorRole || "resident",
          timestamp: formatCommentTimestamp(data.createdAt),
          content: data.content || "",
          isOfficial: Boolean(data.isOfficial),
        };
      });

      callback(comments);
    },
    (err) => {
      console.warn(`Comments listener notice for report ${reportId}:`, err);
    }
  );
}

export interface AddCommentInput {
  content: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "resident" | "official" | "governor";
  isOfficial?: boolean;
  authorUid?: string;
}

/**
 * 2.3 Threaded Comments: Appends a comment to `reports/{reportId}/comments`
 * with serverTimestamp() and enforces author role verification.
 */
export async function addReportComment(
  reportId: string,
  comment: ReportComment | AddCommentInput
): Promise<string> {
  const commentsCol = collection(db, "reports", reportId, "comments");
  const newCommentRef = doc(commentsCol);

  // Author role verification: Only verified official or governor can attach isOfficial: true
  const isAuthorizedOfficial =
    comment.authorRole === "official" || comment.authorRole === "governor";
  const verifiedIsOfficial = Boolean(comment.isOfficial && isAuthorizedOfficial);

  const commentPayload = {
    id: newCommentRef.id,
    reportId,
    authorName: comment.authorName || "Paete Resident",
    authorAvatar: comment.authorAvatar || null,
    authorRole: comment.authorRole || "resident",
    content: comment.content.trim(),
    isOfficial: verifiedIsOfficial,
    createdAt: serverTimestamp(),
  };

  await setDoc(newCommentRef, commentPayload);

  // Update parent report updatedAt
  try {
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Notice: Parent report update timestamp notice:", err);
  }

  return newCommentRef.id;
}

/**
 * Auto-seeds initial mock reports into Firestore if collection is empty.
 */
async function seedInitialReportsIfEmpty(): Promise<void> {
  try {
    const reportsCollection = collection(db, "reports");
    const checkSnap = await getDocs(query(reportsCollection));
    if (!checkSnap.empty) return;

    for (let i = 0; i < SEED_REPORTS.length; i++) {
      const rep = SEED_REPORTS[i];
      const customId = `rep-${i + 1}`;
      const docRef = doc(reportsCollection, customId);

      await setDoc(docRef, {
        ...rep,
        id: customId,
        createdAt: Timestamp.fromDate(new Date(Date.now() - (i + 1) * 86400000)),
        updatedAt: serverTimestamp(),
        timeline: [
          {
            title: "Report Submitted",
            departmentOrActor: "Citizen Verification Hub",
            timestamp: rep.date,
            notes: "Community report entered public triage queue.",
            status: "completed",
          },
          {
            title: "Dispatched to Municipal Engineering",
            departmentOrActor: rep.officialActorRole || "MDRRMO Paete",
            timestamp: "September 25, 2026",
            notes: rep.officialNotes || "Assigned for investigation.",
            status: rep.status === "resolved" ? "completed" : "current",
          },
        ],
      });
    }
  } catch (err) {
    console.warn("Notice: Initial reports auto-seed skipped:", err);
  }
}
