import {
  collection,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VerificationStatus } from "@/lib/services/verificationService";

export interface CivicUser {
  id: string;
  name: string;
  email: string;
  role: "resident" | "official";
  barangayOrOffice: string;
  reportsCount: number;
  registeredDate: string;
  authProvider: "google" | "municipal_credentials";
  verificationStatus: VerificationStatus;
}

/**
 * Subscribes to the live Firestore 'users' collection for real-time
 * directory updates on the administrator dashboard.
 */
export function subscribeToUsers(
  callback: (users: CivicUser[]) => void
): Unsubscribe {
  const usersCol = collection(db, "users");

  return onSnapshot(
    usersCol,
    (snapshot) => {
      if (snapshot.empty) {
        callback([]);
        return;
      }

      const items: CivicUser[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let registeredDate = "Recently";

        if (data.createdAt && typeof data.createdAt === "object" && "toDate" in data.createdAt) {
          try {
            registeredDate = (data.createdAt as Timestamp).toDate().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } catch {
            registeredDate = "Recently";
          }
        } else if (typeof data.registeredDate === "string") {
          registeredDate = data.registeredDate;
        }

        return {
          id: docSnap.id,
          name: data.displayName || data.name || "Civic Citizen",
          email: data.email || "",
          role: data.role === "official" ? "official" : "resident",
          barangayOrOffice: data.barangay ? `Brgy. ${data.barangay}` : data.barangayOrOffice || "Paete Resident",
          reportsCount: typeof data.reportsCount === "number" ? data.reportsCount : 0,
          registeredDate,
          authProvider: data.authProvider || "google",
          verificationStatus: (data.verificationStatus as VerificationStatus) || "unverified",
        };
      });

      callback(items);
    },
    (err) => {
      console.warn("Users live subscription notice:", err);
      callback([]);
    }
  );
}
