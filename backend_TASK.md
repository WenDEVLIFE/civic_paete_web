# Civic Paete Web — Backend Implementation Roadmap (`backend_TASK.md`)

> **Architectural Audit & Roadmap**: Transitioning Civic Paete from frontend state simulation & mock datasets to an enterprise-grade, secure, and production-ready Firebase/Cloud architecture compliant with Philippine statutory laws (RA 10173 Data Privacy Act, RA 10742 SK Reform Act, and COA Public Auditing standards).

---

## 1. System Gap Analysis (Current Mock vs Target Backend)

| Module / Feature | Current Frontend State | Required Backend Infrastructure | Priority |
|---|---|---|:---:|
| **Community Reports Feed** | `INITIAL_REPORTS` mock array in React state (`app/page.tsx`); lost on refresh | Firestore `reports` collection with real-time listeners (`onSnapshot`), indexing by `barangay`, `category`, and `status` | 🔴 Critical |
| **Media Attachments** | `FileReader.readAsDataURL` local Base64 string preview | Firebase Storage bucket (`/reports/{reportId}/{filename}`) with compression, MIME validation, and CDN delivery | 🔴 Critical |
| **Upvoting & Civic Endorsement** | React component state counter (`report.upvotes + 1`) | Atomic Firestore transaction / increment (`FieldValue.increment(1)`) + `reports/{id}/upvotes/{uid}` subcollection to prevent duplicate voting | 🔴 Critical |
| **Discussion Threads** | Local array appending (`report.comments`); not persisted | Firestore subcollection `reports/{id}/comments` with server timestamps and role verification | 🟡 High |
| **Barangay Verification (KYC)** | `localStorage.setItem("civic_paete_verification_pending")` | Secure Firebase Storage (`/verifications/{uid}/...` with private read access), `verification_requests` collection, and admin review approval pipeline | 🔴 Critical |
| **Admin Review Queue** | `INITIAL_VERIFICATION_REQUESTS` in memory; mock approvals | Firestore transactions updating `users/{uid}.verificationStatus` and mutating request status (`approved` / `rejected`) | 🔴 Critical |
| **Data Portability (RA 10173)** | Static mock activity JSON export (`mockActivity`) in `UserProfileModal.tsx` | Next.js API Route (`/api/user/export-data`) querying all documents authored by `user.uid` across all collections | 🟡 High |
| **Right to Erasure (RA 10173)** | Simulated 2.5s timeout saving to `localStorage` and signing out | Cloud Function / API Route (`/api/user/delete-account`) anonymizing public reports and purging PII & Firebase Auth record | 🟡 High |
| **Public Transparency Hub** | Static constants (`PROJECTS`, `OFFICIALS`) in page files | Firestore `transparency_projects` and `officials` collections with dynamic CMS updates | 🟢 Medium |
| **Open Data CSV/JSON Exports** | Pre-generated static string arrays in `/transparency/reports` | Dynamic streaming API endpoint generating live de-identified datasets directly from resolved incident records | 🟢 Medium |
| **Audit Trail & Governance Logs** | Mock array in `app/admin/dashboard/page.tsx` | Immutable, append-only `audit_logs` collection with server-side timestamps and restrictive write rules | 🟡 High |
| **AI Civic Diagnostics** | 3 hardcoded recommendations in `InsightsSection.tsx` | Cloud Function / cron analyzing geographic report clusters and generating automated municipal triage advisories | 🟢 Medium |

---

## 2. Detailed Backend Implementation Checklist

### Phase 1: Firebase Storage & Cloud Asset Pipeline
- [x] **1.1 Firebase Storage Initialization**
  - [x] Initialize `getStorage` in `lib/firebase.ts` referencing `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`.
  - [x] Configure cross-origin resource sharing (CORS) rules for local development and production domains.
- [x] **1.2 Report Photo Upload Service**
  - [x] Create `lib/storage/uploadReportImage.ts` handling client-side image compression before upload (max 1920px, WebP/JPEG).
  - [x] Upload to `reports/{barangay}/{reportId}_{timestamp}.ext`.
  - [x] Return permanent public download URL to be stored in the Firestore report document.
- [x] **1.3 Secure Verification Document Vault**
  - [x] Create dedicated private storage path: `verifications/{userId}/{documentType}_{timestamp}.ext`.
  - [x] Configure storage security rules: IDs and Barangay Certificates are strictly readable **only** by authenticated municipal administrators and the document owner.

---

### Phase 2: Community Reporting Engine & Realtime Feed
- [x] **2.1 Firestore `reports` Collection CRUD**
  - [x] Create `lib/services/reportService.ts` containing typed methods:
    - [x] `createReport(data: CreateReportInput): Promise<string>`
    - [x] `getReports(filters: ReportFilters): Promise<CommunityReport[]>`
    - [x] `subscribeToReports(filters: ReportFilters, callback: (reports: CommunityReport[]) => void): Unsubscribe`
    - [x] `updateReportStatus(reportId: string, status: ReportStatus, officerNotes: string): Promise<void>`
  - [x] Replace `INITIAL_REPORTS` in `app/page.tsx` with a live Firestore subscription (`onSnapshot`).
  - [x] Replace mock lookup in `app/reports/[id]/page.tsx` with live single-document listener.
- [x] **2.2 Atomic Upvoting Engine (Anti-Spam)**
  - [x] Implement atomic upvote/un-upvote via Firestore transaction:
    - [x] Check if `reports/{reportId}/upvotes/{userId}` exists.
    - [x] If exists: remove document and decrement `upvotes` by 1.
    - [x] If not: create document and increment `upvotes` by 1.
  - [x] Reflect live upvote states on resident feed and report cards.
- [x] **2.3 Threaded Comments & Official Action Logging**
  - [x] Migrate comments to subcollection `reports/{reportId}/comments`.
  - [x] Add server-side timestamp validation (`serverTimestamp()`).
  - [x] Enforce author role verification: only authenticated municipal officers can attach `isOfficial: true` and official action notices.

---

### Phase 3: Residency Verification & KYC Pipeline (Feature 5)
- [x] **3.1 Verification Submission Flow**
  - [x] Update `BarangayVerificationModal.tsx` to upload proof document to Firebase Storage.
  - [x] Create record in Firestore `verification_requests` collection with fields:
    - [x] `userId`, `applicantName`, `email`, `barangay`, `address`, `birthDate`, `method`, `documentType`, `documentNumber`, `fileUrl`, `status: "pending"`, `submittedAt`.
  - [x] Update `users/{uid}.verificationStatus` to `"pending"`.
- [x] **3.2 Admin Review & Approval Queue**
  - [x] Connect `app/admin/dashboard/page.tsx` Verification Review Queue to live `verification_requests` collection (filtered by `status == "pending"`).
  - [x] Build atomic approval action:
    - [x] Update `verification_requests/{id}.status = "approved"`.
    - [x] Update `users/{userId}.verificationStatus = "barangay_verified"` (or `"community_leader"`).
    - [x] Append entry to `audit_logs`.
      - [x] Build atomic rejection action:
        - [x] Update `verification_requests/{id}.status = "rejected"` with `rejectionReason`.
        - [x] Update `users/{userId}.verificationStatus = "unverified"`.
- [x] **3.3 Age 15+ Server Validation**
  - [x] Implement validation verifying applicant's `birthDate` is at least 15 years prior to the current server timestamp (adhering to RA 10742).

---

### Phase 4: Statutory Privacy & Data Portability APIs (Feature 4, RA 10173)
- [x] **4.1 Data Portability Export API (`/api/user/export-data`)**
  - [x] Create Next.js route handler `app/api/user/export-data/route.ts`.
  - [x] Authenticate caller via Firebase ID Token (`Authorization: Bearer <token>`).
  - [x] Query and compile into a structured, downloadable JSON bundle:
    - [x] User profile, email, authentication provider, and verification status.
    - [x] All submitted reports with timestamps, status histories, and landmark coordinates.
    - [x] All upvote records and posted comments.
    - [x] Statutory compliance disclosure and DPO contact information.
  - [x] Connect "Download My Civic Data" button in `UserProfileModal.tsx` to this live endpoint.
- [x] **4.2 Right to Erasure / Account Closure Pipeline (`/api/user/delete-account`)**
  - [x] Create route handler `app/api/user/delete-account/route.ts`.
  - [x] Verify explicit confirmation (`confirmation === "DELETE"`).
  - [x] Audit & Compliance Retention Handling:
    - [x] Public Works reports older than incident remediation are anonymized (author identity set to `"Deactivated Resident"`, PII stripped) pursuant to COA and local infrastructure audit rules.
    - [x] Purge `users/{uid}` document and verification files.
    - [x] Delete Firebase Auth user record via Firebase Admin SDK (`admin.auth().deleteUser(uid)`).

---

### Phase 5: Public Transparency & Dynamic Open Data Engine (Features 8, 9, 10)
- [x] **5.1 Public Works Projects Collection**
  - [x] Create Firestore collection `transparency_projects` matching `Project` schema (budget, contractor, milestones, fund source).
  - [x] Connect `app/transparency/projects/page.tsx` to fetch projects from Firestore with revalidation (`next: { revalidate: 3600 }`).
- [x] **5.2 Officials & Accountability Directory**
  - [x] Create Firestore collection `officials` with civic response metrics (`resolutionRate`, `avgResponseHours`, `activeReports`, `resolvedReports`).
  - [x] Build background aggregator to recalculate official resolution metrics dynamically when incident tickets are marked `resolved`.
- [x] **5.3 Automated Open Data Generator (`/api/transparency/export`)**
  - [x] Create route handler `app/api/transparency/export/route.ts?format=csv|json`.
  - [x] Query resolved reports, strip all resident PII, pseudonymize aliases, and stream clean open dataset for public download.

---

### Phase 6: Immutable Audit Trail & RBAC Security Rules
- [x] **6.1 Server-Side Government Audit Logging**
  - [x] Create helper `lib/services/auditService.ts` that writes to `audit_logs` collection.
  - [x] Automatically log every administrative event:
    - [x] Official status change (`pending` ──> `in_progress` ──> `resolved`).
    - [x] Residency verification approval, promotion, or rejection.
    - [x] Emergency directives issued by Governor or Mayor.
- [x] **6.2 Production Firestore Security Rules (`firestore.rules`)**
  - [x] Enforce read/write partitions:
    - [x] `reports`: Anyone can read; authenticated residents can create; only authors can edit drafts; only officials can update `status` and `officialNotes`.
    - [x] `verification_requests`: Only document owner can create; only admins can read and update.
    - [x] `users`: Anyone authenticated can read basic public profile; only user or admin can write.
    - [x] `audit_logs`: Publicly readable (or official-readable); append-only (no updates, no deletions).
- [x] **6.3 Firebase Admin SDK & Custom Claims**
  - [x] Set up Firebase Admin SDK in `lib/firebaseAdmin.ts` using service account environment variables.
  - [x] Create script or endpoint to attach custom claims (`{ role: "admin" }` or `{ role: "governor" }`) to authorized municipal email accounts.

---

### Phase 7: Rule-Based Civic Recommendations & Incident Aggregation (PROJECT.MD Sec. 7)
- [x] **7.1 Incident Aggregation & Rule-Based Clustering**
  - [x] Aggregate active community reports grouped by category and Paete barangay.
  - [x] Apply traditional deterministic logic (adhering to PROJECT.MD Sec. 7: `IF multiple reports concern the same issue/barangay THEN recommend for municipal assessment`).
- [x] **7.2 Dynamic Recommendations Feed**
  - [x] Store generated advisory cards in `insights` collection.
  - [x] Connect `components/insights/InsightsSection.tsx` to read live rule-based recommendations from Firestore instead of hardcoded data.

---

### Phase 8: Notifications & Emergency Alerts
- [x] **8.1 Push Notifications via FCM**
  - [x] Register Service Worker for Firebase Cloud Messaging (`public/firebase-messaging-sw.js`).
  - [x] Save resident device tokens in `users/{uid}/fcm_tokens`.
  - [x] Dispatch automated notification when a report submitted by the resident changes status (`In Progress` / `Resolved`).


---

## 3. Firestore Collection Schemas

```typescript
// 1. users/{uid}
interface UserDocument {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: "resident" | "official" | "governor" | "admin";
  barangay?: string;
  address?: string;
  birthDate?: string; // YYYY-MM-DD
  verificationStatus: "unverified" | "pending" | "barangay_verified" | "community_leader" | "municipal_officer";
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// 2. reports/{reportId}
interface ReportDocument {
  id: string;
  title: string;
  description: string;
  category: "waste" | "lighting" | "road" | "drainage" | "safety";
  barangay: string;
  locationDetail?: string;
  imageUrl?: string;
  status: "pending" | "in_progress" | "resolved" | "urgent";
  upvotesCount: number;
  commentsCount: number;
  authorUid?: string; // Hidden from public feed if isAnonymous is true
  authorName?: string;
  authorRole: "resident" | "official" | "governor";
  isAnonymous: boolean;
  anonymousAlias?: string; // e.g., "Protected Citizen #104"
  officialNotes?: string;
  officialActorName?: string;
  officialActorRole?: string;
  resolvedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 3. reports/{reportId}/upvotes/{uid}
interface UpvoteDocument {
  uid: string;
  timestamp: Timestamp;
}

// 4. reports/{reportId}/comments/{commentId}
interface CommentDocument {
  id: string;
  authorUid: string;
  authorName: string;
  authorRole: "resident" | "official" | "governor";
  content: string;
  isOfficial: boolean;
  createdAt: Timestamp;
}

// 5. verification_requests/{requestId}
interface VerificationRequestDocument {
  id: string;
  userId: string;
  applicantName: string;
  email: string;
  birthDate: string; // YYYY-MM-DD (Validated >= 15 years)
  barangay: string;
  address: string;
  method: "certificate" | "gov_id";
  documentType: string;
  documentNumber: string;
  fileUrl: string; // Secure Storage URL
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rejectionReason?: string;
  submittedAt: Timestamp;
}

// 6. audit_logs/{logId}
interface AuditLogDocument {
  id: string;
  actorName: string;
  actorRole: "admin" | "governor" | "official";
  action: string;
  target: string;
  details: string;
  ipAddress?: string;
  timestamp: Timestamp;
}
```

---

## 4. Required Environment Variables

```env
# Client-side Firebase Configuration (Existing)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Server-Side Firebase Admin SDK (To be added for backend services)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# SMS Gateway (Optional for Phase 8)
SEMAPHORE_API_KEY=...
```
