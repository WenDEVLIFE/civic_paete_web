import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadVerificationDocument } from "@/lib/storage/uploadVerificationDoc";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "barangay_verified"
  | "community_leader"
  | "municipal_officer"
  | "rejected";

export interface VerificationRequest {
  id: string;
  userId: string;
  applicantName: string;
  email: string;
  barangay: string;
  address: string;
  birthDate: string;
  method: "certificate" | "gov_id";
  documentType: string;
  documentNumber: string;
  fileUrl?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: unknown;
  updatedAt: unknown;
  reviewedAt?: unknown;
  reviewedBy?: string;
  reviewerRole?: string;
  rejectionReason?: string;
}

export interface SubmitVerificationInput {
  userId: string;
  applicantName: string;
  email: string;
  barangay: string;
  address: string;
  birthDate: string;
  method: "certificate" | "gov_id";
  documentType: string;
  documentNumber: string;
  file?: File | null;
  fileUrl?: string;
}

/**
 * 3.1 Verification Submission Flow
 * - Uploads proof document to Firebase Storage: verifications/{userId}/{docType}_{timestamp}.ext
 * - Creates a record in Firestore `verification_requests` collection
 * - Updates `users/{uid}.verificationStatus` to `"pending"`
 */
export async function submitVerificationRequest(
  input: SubmitVerificationInput
): Promise<string> {
  let fileUrl = input.fileUrl || "";

  // 1. Upload proof document if file is provided
  if (input.file) {
    try {
      fileUrl = await uploadVerificationDocument({
        userId: input.userId,
        documentType: input.documentType,
        file: input.file,
      });
    } catch (uploadErr) {
      console.warn("Storage upload failed, falling back without fileUrl:", uploadErr);
    }
  }

  // 2. Create record in Firestore `verification_requests` collection
  const requestsCol = collection(db, "verification_requests");
  const newRequestRef = doc(requestsCol);

  const requestPayload: Record<string, unknown> = {
    id: newRequestRef.id,
    userId: input.userId,
    applicantName: input.applicantName.trim(),
    email: input.email.trim(),
    barangay: input.barangay,
    address: input.address.trim(),
    birthDate: input.birthDate,
    method: input.method,
    documentType: input.documentType,
    documentNumber: input.documentNumber.trim(),
    status: "pending",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (fileUrl) {
    requestPayload.fileUrl = fileUrl;
  }

  await setDoc(newRequestRef, requestPayload);

  // 3. Update `users/{uid}.verificationStatus` to "pending"
  try {
    const userDocRef = doc(db, "users", input.userId);
    await setDoc(
      userDocRef,
      {
        uid: input.userId,
        email: input.email.trim(),
        displayName: input.applicantName.trim(),
        barangay: input.barangay,
        verificationStatus: "pending",
        verificationRequestId: newRequestRef.id,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (userDocErr) {
    console.warn("Notice: user verificationStatus sync error:", userDocErr);
  }

  return newRequestRef.id;
}

/**
 * Subscribes to the live verification status of a specific user.
 */
export function subscribeToUserVerification(
  userId: string,
  callback: (status: VerificationStatus, request: VerificationRequest | null) => void
): Unsubscribe {
  const userDocRef = doc(db, "users", userId);

  return onSnapshot(
    userDocRef,
    async (userSnap) => {
      if (!userSnap.exists()) {
        callback("unverified", null);
        return;
      }

      const userData = userSnap.data();
      const status: VerificationStatus =
        userData.verificationStatus || "unverified";

      // If user has an active verification request ID, fetch details
      if (userData.verificationRequestId) {
        try {
          const reqSnap = await getDoc(
            doc(db, "verification_requests", userData.verificationRequestId)
          );
          if (reqSnap.exists()) {
            callback(status, reqSnap.data() as VerificationRequest);
            return;
          }
        } catch {
          // ignore lookup error
        }
      }

      callback(status, null);
    },
    (err) => {
      console.warn("User verification listener notice:", err);
      callback("unverified", null);
    }
  );
}

/**
 * Real-time listener for pending verification requests (for Admin dashboard).
 */
export function subscribeToPendingVerifications(
  callback: (requests: VerificationRequest[]) => void
): Unsubscribe {
  const requestsCol = collection(db, "verification_requests");
  const q = query(
    requestsCol,
    where("status", "==", "pending"),
    orderBy("submittedAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => docSnap.data() as VerificationRequest);
      callback(items);
    },
    (err) => {
      console.warn("Pending verifications listener notice:", err);
    }
  );
}

/**
 * 6.1 Review verification request: approves, rejects, or promotes resident,
 * updates Firestore documents, and logs to immutable government audit trail.
 */
export async function reviewVerificationRequest(
  requestId: string,
  decision: "approved" | "rejected",
  options: {
    reviewerName: string;
    reviewerRole: string;
    reviewerEmail?: string;
    targetStatus?: VerificationStatus;
    rejectionReason?: string;
  }
): Promise<void> {
  const reqRef = doc(db, "verification_requests", requestId);
  const reqSnap = await getDoc(reqRef);
  if (!reqSnap.exists()) return;

  const reqData = reqSnap.data();
  const userId = reqData.userId;
  const applicantName = reqData.applicantName || "Resident";
  const barangay = reqData.barangay || "Paete";
  const finalStatus: VerificationStatus =
    decision === "approved"
      ? options.targetStatus || "barangay_verified"
      : "rejected";

  // Update request document
  await updateDoc(reqRef, {
    status: decision,
    reviewedAt: serverTimestamp(),
    reviewedBy: options.reviewerName,
    reviewerRole: options.reviewerRole,
    rejectionReason: options.rejectionReason || null,
    updatedAt: serverTimestamp(),
  });

  // Update user profile status
  if (userId) {
    await setDoc(
      doc(db, "users", userId),
      {
        verificationStatus: finalStatus,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  // Automatically log to immutable government audit trail
  import("@/lib/services/auditService")
    .then(({ logVerificationDecision }) => {
      logVerificationDecision(
        requestId,
        userId,
        applicantName,
        decision,
        {
          name: options.reviewerName,
          role: options.reviewerRole,
          email: options.reviewerEmail,
        },
        barangay,
        decision === "approved" ? finalStatus : options.rejectionReason
      ).catch((err) =>
        console.warn("Background audit log write notice:", err)
      );
    })
    .catch(() => {});
}
