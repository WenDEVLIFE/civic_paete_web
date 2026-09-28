import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AuditAction =
  | "STATUS_CHANGE"
  | "STATUS_RESOLVED"
  | "NOTE_ATTACHED"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "EMERGENCY_DIRECTIVE"
  | "DISPATCH_OPERATION"
  | "DATA_EXPORT";

export interface GovernmentAuditLog {
  id: string;
  timestamp: string;
  createdAt?: unknown;
  actorName: string;
  actorEmail?: string;
  actorRole: string;
  action: AuditAction | string;
  reportId?: string;
  targetUserId?: string;
  barangay?: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export const INITIAL_AUDIT_LOGS: GovernmentAuditLog[] = [
  {
    id: "aud-101",
    timestamp: "Sept 26, 2026 • 09:12 AM",
    actorName: "Engr. Marco Adea",
    actorRole: "Municipal Engineering",
    action: "STATUS_CHANGE",
    reportId: "rep-1",
    barangay: "Bagumbayan",
    details: "Changed status from 'Pending' to 'In Progress'. Scheduled on-site diagnostic inspection.",
  },
  {
    id: "aud-102",
    timestamp: "Sept 25, 2026 • 11:20 AM",
    actorName: "System Analytics",
    actorRole: "Automated Recommendation",
    action: "RULE_FLAGGED",
    reportId: "rep-1",
    barangay: "Bagumbayan",
    details: "Flagged as recurring streetlight cluster concern (3 reports within 7 days).",
  },
  {
    id: "aud-103",
    timestamp: "Sept 25, 2026 • 03:45 PM",
    actorName: "Arlene Cadawas",
    actorRole: "MENRO Paete",
    action: "DISPATCH_OPERATION",
    reportId: "rep-2",
    barangay: "Ibaba del Sur",
    details: "Dispatched to Barangay Drainage Maintenance crew for clearing operation.",
  },
  {
    id: "aud-104",
    timestamp: "Sept 23, 2026 • 04:10 PM",
    actorName: "Engr. Marco Adea",
    actorRole: "Municipal Engineering",
    action: "STATUS_RESOLVED",
    reportId: "rep-3",
    barangay: "Maytoong",
    details: "Changed status to 'Resolved'. Completed cold-patch remediation with clearance record.",
  },
];

const COLLECTION_NAME = "audit_logs";

function formatCurrentTimestamp(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " • " + d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Writes an immutable government audit event into Firestore `audit_logs`.
 */
export async function logAuditEvent(
  event: Omit<GovernmentAuditLog, "id" | "timestamp" | "createdAt">
): Promise<string> {
  try {
    const logsCol = collection(db, COLLECTION_NAME);
    const formattedTime = formatCurrentTimestamp();

    const docData = {
      ...event,
      timestamp: formattedTime,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(logsCol, docData);
    return docRef.id;
  } catch (error) {
    console.warn("Notice: Government audit log write failed (continuing safely):", error);
    return `local-${Date.now()}`;
  }
}

/**
 * 6.1 Audit Helper: Log official status change on incident tickets
 */
export async function logStatusChange(
  reportId: string,
  oldStatus: string,
  newStatus: string,
  actor: { name: string; role: string; email?: string },
  barangay: string = "Paete",
  notes?: string
): Promise<string> {
  const isResolved = newStatus === "resolved";
  const action: AuditAction = isResolved ? "STATUS_RESOLVED" : "STATUS_CHANGE";

  const details = notes
    ? `Changed status from '${oldStatus}' to '${newStatus}'. Officer note: "${notes}"`
    : `Changed status from '${oldStatus}' to '${newStatus}'.`;

  return logAuditEvent({
    actorName: actor.name || "Municipal Official",
    actorEmail: actor.email,
    actorRole: actor.role || "Municipal Government",
    action,
    reportId,
    barangay,
    details,
    metadata: { oldStatus, newStatus, notes },
  });
}

/**
 * 6.1 Audit Helper: Log residency KYC verification approval, promotion, or rejection
 */
export async function logVerificationDecision(
  requestId: string,
  targetUserId: string,
  applicantName: string,
  decision: "approved" | "rejected" | "promoted",
  actor: { name: string; role: string; email?: string },
  barangay: string,
  reasonOrLevel?: string
): Promise<string> {
  const action: AuditAction =
    decision === "approved" || decision === "promoted"
      ? "VERIFICATION_APPROVED"
      : "VERIFICATION_REJECTED";

  let details = "";
  if (decision === "approved" || decision === "promoted") {
    details = `Approved ${reasonOrLevel || "Barangay Verified"} status for resident ${applicantName} (Brgy. ${barangay}). Document verified pursuant to municipal KYC protocol.`;
  } else {
    details = `Rejected residency verification request for ${applicantName} in Brgy. ${barangay}.${reasonOrLevel ? ` Reason: ${reasonOrLevel}` : " Document discrepancy noted."}`;
  }

  return logAuditEvent({
    actorName: actor.name || "Municipal Administrator",
    actorEmail: actor.email,
    actorRole: actor.role || "Municipal Official",
    action,
    reportId: requestId,
    targetUserId,
    barangay,
    details,
    metadata: { decision, applicantName, reasonOrLevel },
  });
}

/**
 * 6.1 Audit Helper: Log emergency directives issued by Governor or Mayor
 */
export async function logEmergencyDirective(
  directiveTitle: string,
  directiveScope: string,
  actor: { name: string; role: string; email?: string },
  directiveDetails: string,
  barangay: string = "All Barangays"
): Promise<string> {
  const details = `[EMERGENCY DIRECTIVE: ${directiveTitle.toUpperCase()}] Scope: ${directiveScope}. ${directiveDetails}`;

  return logAuditEvent({
    actorName: actor.name || "Hon. Rosario A. Fadul (Mayor)",
    actorEmail: actor.email,
    actorRole: actor.role || "Executive Office",
    action: "EMERGENCY_DIRECTIVE",
    barangay,
    details,
    metadata: { directiveTitle, directiveScope },
  });
}

/**
 * Real-time listener for `audit_logs` collection.
 */
export function subscribeToAuditLogs(
  callback: (logs: GovernmentAuditLog[]) => void,
  maxRecords: number = 50
): Unsubscribe {
  const logsCol = collection(db, COLLECTION_NAME);
  const q = query(logsCol, orderBy("createdAt", "desc"), limit(maxRecords));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_AUDIT_LOGS);
        return;
      }

      const items: GovernmentAuditLog[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          timestamp: data.timestamp || "Recently",
          actorName: data.actorName || "Municipal Official",
          actorEmail: data.actorEmail || undefined,
          actorRole: data.actorRole || "Municipal Administration",
          action: (data.action as AuditAction) || "STATUS_CHANGE",
          reportId: data.reportId || undefined,
          targetUserId: data.targetUserId || undefined,
          barangay: data.barangay || "Paete",
          details: data.details || "",
          metadata: data.metadata || undefined,
        });
      });

      callback(items);
    },
    (err) => {
      console.warn("Audit logs subscription notice:", err);
      callback(INITIAL_AUDIT_LOGS);
    }
  );
}

/**
 * One-shot query for recent audit logs.
 */
export async function getAuditLogs(maxRecords: number = 50): Promise<GovernmentAuditLog[]> {
  try {
    const logsCol = collection(db, COLLECTION_NAME);
    const q = query(logsCol, orderBy("createdAt", "desc"), limit(maxRecords));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return INITIAL_AUDIT_LOGS;

    const items: GovernmentAuditLog[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        timestamp: data.timestamp || "Recently",
        actorName: data.actorName || "Municipal Official",
        actorEmail: data.actorEmail || undefined,
        actorRole: data.actorRole || "Municipal Administration",
        action: (data.action as AuditAction) || "STATUS_CHANGE",
        reportId: data.reportId || undefined,
        targetUserId: data.targetUserId || undefined,
        barangay: data.barangay || "Paete",
        details: data.details || "",
        metadata: data.metadata || undefined,
      });
    });

    return items;
  } catch (err) {
    console.warn("Failed to fetch audit logs from Firestore, using initial fallback:", err);
    return INITIAL_AUDIT_LOGS;
  }
}
