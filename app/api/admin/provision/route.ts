import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface ProvisionAccount {
  email: string;
  password: string;
  name: string;
  role: "admin" | "governor";
  office: string;
  barangayOrOffice: string;
}

export async function POST() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@paete.gov.ph").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "PaeteAdmin2026!").trim();
    const governorEmail = (process.env.GOVERNOR_EMAIL || "governor@laguna.gov.ph").trim();
    const governorPassword = (process.env.GOVERNOR_PASSWORD || "LagunaGov2026!").trim();

    const accountsToProvision: ProvisionAccount[] = [
      {
        email: adminEmail,
        password: adminPassword,
        name: "Municipal Administrator",
        role: "admin",
        office: "Office of the Municipal Mayor / Administrator",
        barangayOrOffice: "Paete Municipal Hall",
      },
      {
        email: governorEmail,
        password: governorPassword,
        name: "Hon. Provincial Governor",
        role: "governor",
        office: "Office of the Provincial Governor - Laguna",
        barangayOrOffice: "Provincial Capitol, Laguna",
      },
    ];

    const results = [];

    for (const acc of accountsToProvision) {
      let uid = "";
      let status = "created";

      try {
        // Attempt to create user in Firebase Auth
        const credential = await createUserWithEmailAndPassword(
          auth,
          acc.email,
          acc.password
        );
        uid = credential.user.uid;
        await updateProfile(credential.user, { displayName: acc.name });
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        if (error.code === "auth/email-already-in-use") {
          // If already in auth, sign in to retrieve UID and update Firestore record
          try {
            const credential = await signInWithEmailAndPassword(
              auth,
              acc.email,
              acc.password
            );
            uid = credential.user.uid;
            status = "already_existed_updated";
          } catch {
            results.push({
              email: acc.email,
              status: "failed",
              error: "Email already registered in Auth with different password.",
            });
            continue;
          }
        } else {
          results.push({
            email: acc.email,
            status: "failed",
            error: error.message || "Failed to create user in Firebase Auth",
          });
          continue;
        }
      }

      // Save user profile and role to Firestore 'users' collection
      try {
        await setDoc(
          doc(db, "users", uid),
          {
            uid,
            name: acc.name,
            email: acc.email,
            role: acc.role,
            office: acc.office,
            barangayOrOffice: acc.barangayOrOffice,
            updatedAt: serverTimestamp(),
            authProvider: "municipal_credentials",
          },
          { merge: true }
        );
      } catch (fsErr: unknown) {
        const error = fsErr as { code?: string; message?: string };
        results.push({
          email: acc.email,
          uid,
          role: acc.role,
          status: "auth_success_firestore_failed",
          firestoreError: error.message || String(fsErr),
        });
        continue;
      }

      results.push({
        email: acc.email,
        uid,
        role: acc.role,
        status,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin and Governor accounts successfully provisioned in Firebase Auth and Firestore.",
      results,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to provision accounts in Firebase.",
      },
      { status: 500 }
    );
  }
}
