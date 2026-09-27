import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Mangyaring ilagay ang parehong opisyal na email at password." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // 1. Authenticate with Firebase Auth
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );
    } catch (authErr: unknown) {
      const error = authErr as { code?: string; message?: string };
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        return NextResponse.json(
          { error: "Maling email o password. Pakisuri ang iyong opisyal na kredensyal." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: error.message || "Hindi matanggap ang kredensyal sa Firebase Auth." },
        { status: 401 }
      );
    }

    const uid = userCredential.user.uid;

    // 2. Fetch role and official profile from Firestore 'users' collection
    let role: "admin" | "governor" = "admin";
    let name = userCredential.user.displayName || "Municipal Official";
    let office = "Pamahalaang Bayan ng Paete";
    let barangayOrOffice = "Paete Municipal Hall";

    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        role = data.role === "governor" ? "governor" : "admin";
        name = data.name || name;
        office = data.office || office;
        barangayOrOffice = data.barangayOrOffice || barangayOrOffice;
      } else {
        // Fallback identification by email if Firestore doc is missing
        if (cleanEmail.includes("governor")) {
          role = "governor";
          name = "Hon. Provincial Governor";
          office = "Office of the Provincial Governor - Laguna";
          barangayOrOffice = "Provincial Capitol, Laguna";
        }
      }
    } catch (fsErr) {
      console.warn("Notice: Firestore role lookup warning:", fsErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        uid,
        email: cleanEmail,
        name,
        role,
        office,
        barangayOrOffice,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Nagkaroon ng aberya sa pagsusuri ng kredensyal." },
      { status: 500 }
    );
  }
}
