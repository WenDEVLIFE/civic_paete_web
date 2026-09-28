import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/**
 * Validates a Firebase ID Token using Google's Identity Toolkit endpoint.
 * Returns the verified user UID and email, or null if invalid or expired.
 */
async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ uid: string; email?: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !idToken) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const user = data.users?.[0];
    if (!user?.localId) {
      return null;
    }

    return {
      uid: user.localId,
      email: user.email,
    };
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

/**
 * GET /api/user/export-data
 *
 * Implements Statutory Data Portability under Republic Act No. 10173
 * (Data Privacy Act of 2012, Section 18 - Right to Data Portability).
 *
 * Compiles all resident personal data, civic activity records, submitted
 * reports, upvotes, and comments into a structured, machine-readable JSON bundle.
 */
export async function GET(request: Request) {
  try {
    // 1. Authenticate caller via Bearer token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Please provide a valid Firebase Bearer authorization token.",
        },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace(/^Bearer\s+/, "").trim();
    const verifiedUser = await verifyFirebaseIdToken(idToken);

    if (!verifiedUser?.uid) {
      return NextResponse.json(
        {
          error:
            "Invalid, expired, or revoked authentication token. Please re-authenticate.",
        },
        { status: 401 }
      );
    }

    const uid = verifiedUser.uid;

    // 2. Fetch User Profile from Firestore
    let userProfileData: Record<string, unknown> = {};
    try {
      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists()) {
        userProfileData = userSnap.data();
      }
    } catch (err) {
      console.warn("Notice: users collection lookup error:", err);
    }

    // 3. Fetch all reports authored by the user
    const reportsCol = collection(db, "reports");
    let submittedReports: Record<string, unknown>[] = [];
    try {
      const userReportsQuery = query(reportsCol, where("authorUid", "==", uid));
      const reportsSnap = await getDocs(userReportsQuery);
      submittedReports = reportsSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (err) {
      console.warn("Notice: user reports query notice:", err);
    }

    // 4. Fetch verification requests submitted by the user
    let verificationRecords: Record<string, unknown>[] = [];
    try {
      const verifSnap = await getDocs(
        query(collection(db, "verification_requests"), where("userId", "==", uid))
      );
      verificationRecords = verifSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (err) {
      console.warn("Notice: verification requests query notice:", err);
    }

    // 5. Query all reports for user's atomic upvotes and subcollection comments
    const upvotedReportIds: string[] = [];
    const postedComments: Record<string, unknown>[] = [];

    try {
      const allReportsSnap = await getDocs(reportsCol);

      await Promise.all(
        allReportsSnap.docs.map(async (reportDoc) => {
          const reportId = reportDoc.id;
          const reportData = reportDoc.data();

          // Check if user has upvoted this report
          try {
            const upvoteDocSnap = await getDoc(
              doc(db, "reports", reportId, "upvotes", uid)
            );
            if (upvoteDocSnap.exists()) {
              upvotedReportIds.push(reportId);
            }
          } catch {
            // ignore
          }

          // Check for comments authored by this user in subcollection
          try {
            const commentsSnap = await getDocs(
              query(
                collection(db, "reports", reportId, "comments"),
                where("authorUid", "==", uid)
              )
            );

            commentsSnap.docs.forEach((cDoc) => {
              postedComments.push({
                commentId: cDoc.id,
                reportId,
                reportTitle: reportData.title || "",
                ...cDoc.data(),
              });
            });
          } catch {
            // fallback: check legacy embedded array
            if (Array.isArray(reportData.comments)) {
              reportData.comments.forEach((c: Record<string, unknown>) => {
                if (c.authorUid === uid) {
                  postedComments.push({
                    reportId,
                    reportTitle: reportData.title || "",
                    ...c,
                  });
                }
              });
            }
          }
        })
      );
    } catch (err) {
      console.warn("Notice: civic interactions compilation notice:", err);
    }

    // 6. Compile Structured Data Portability Bundle
    const exportBundle = {
      exportMetadata: {
        platform: "Civic Paete — Official Municipal Platform",
        authority: "Municipality of Paete, Laguna, Republic of the Philippines",
        statutoryStandard:
          "Republic Act No. 10173 (Data Privacy Act of 2012) — Section 18 (Right to Data Portability)",
        generatedAt: new Date().toISOString(),
        residentUid: uid,
      },
      userProfile: {
        uid,
        email: verifiedUser.email || userProfileData.email || null,
        displayName: userProfileData.displayName || null,
        barangay: userProfileData.barangay || "Unspecified",
        verificationStatus: userProfileData.verificationStatus || "unverified",
        verificationRequestId: userProfileData.verificationRequestId || null,
        createdAt: userProfileData.createdAt || null,
        updatedAt: userProfileData.updatedAt || null,
      },
      verificationHistory: {
        totalRequests: verificationRecords.length,
        requests: verificationRecords,
      },
      civicActivity: {
        totalReportsSubmitted: submittedReports.length,
        totalUpvotesCast: upvotedReportIds.length,
        totalCommentsLogged: postedComments.length,
        submittedReports,
        upvotedReportIds,
        postedComments,
      },
      statutoryComplianceDisclosure: {
        governingLaw: "Republic Act No. 10173 (Data Privacy Act of 2012)",
        statutoryRights: [
          "Section 18: Right to Data Portability (interoperable electronic format)",
          "Section 16(c): Right to Reasonable Access to Personal Data",
          "Section 16(d): Right to Rectification of Inaccurate Records",
          "Section 16(e): Right to Erasure or Blocking of Personal Data",
          "Section 16(f): Right to Indemnification for Damages",
        ],
        dataProtectionOffice: {
          entity: "Municipality of Paete Data Protection Office (DPO)",
          officerTitle: "Municipal Data Protection Officer",
          officeAddress:
            "2nd Floor, Paete Municipal Hall, J.V. Quesada St., Paete, Laguna 4016",
          email: "dpo@paete.gov.ph",
          hotline: "+63 (49) 557-0101",
          nationalPrivacyCommission: "https://privacy.gov.ph",
        },
        retentionPolicy:
          "Personal data is retained while the resident account remains active. Upon verified account erasure request, personally identifiable data is permanently purged within 30 days pursuant to RA 10173, while public works maintenance tickets are anonymized in compliance with Commission on Audit (COA) Circular No. 2015-007.",
      },
    };

    return new NextResponse(JSON.stringify(exportBundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="civic-paete-data-export-${uid.slice(0, 8)}.json"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: unknown) {
    console.error("Data export API failure:", err);
    return NextResponse.json(
      {
        error: "Failed to compile civic data export bundle. Please try again later.",
      },
      { status: 500 }
    );
  }
}
