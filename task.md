# Civic Paete Web — Implementation Tasks & Roadmap

> Tracking the implementation of the 11 Core Civic Governance & Compliance Features for **Civic Paete** (`civic_paete_web`), aligned with Philippine Data Privacy Act (RA 10173) and local civic transparency requirements.

---

## Feature Matrix Overview

| # | Feature Domain | Status | Target Module / Component |
|---|---|:---:|---|
| **1** | Privacy Policy (RA 10173 compliance) | 🟡 Queued | `app/legal/privacy/page.tsx` + `components/legal/` |
| **2** | Cookie Consent Banner & Preferences | 🟢 Done | `components/legal/CookieConsentBanner.tsx` |
| **3** | Terms & Conditions | 🟡 Queued | `app/legal/terms/page.tsx` + Modal preview |
| **4** | User Data Management & Export | 🟡 Queued | `app/profile/data/page.tsx` / `UserDataModal.tsx` |
| **5** | User Account & Barangay Verification System | 🟡 Queued | `components/auth/VerificationBadge.tsx` & Verification Flow |
| **6** | Nickname / Anonymous Reporting Option | 🟡 Queued | `components/reports/SubmitReportModal.tsx` |
| **7** | Community Reporting Module (Feed + Comments) | 🟢 In Progress | `components/reports/ReportCard.tsx` + `app/page.tsx` |
| **8** | Project Transparency & History (LGU Audits) | 🟡 Queued | `app/transparency/projects/page.tsx` |
| **9** | Officials & Accountability Directory | 🟡 Queued | `app/transparency/officials/page.tsx` |
| **10** | Open Data & Civic Reports (CSV/PDF Exports) | 🟡 Queued | `app/transparency/reports/page.tsx` |
| **11** | Safety & Whistleblower Legal Protection | 🟡 Queued | `app/legal/safety/page.tsx` + Submission Shield Banner |

---

## Detailed Task Breakdown

### Phase 1: Legal, Compliance & Consent Foundation (Features 1, 2, 3, 11)
- [x] **1.1 Cookie & Privacy Consent Banner (`Feature 2`)**
  - [x] Implement floating accessible consent drawer in `components/legal/CookieConsentBanner.tsx`.
  - [x] Store user preferences in `localStorage` (`civic_cookie_consent_v1`) with "Accept All", "Essential Only", and "Customize" options.
  - [x] Integrate into root layout `app/layout.tsx`.
- [ ] **1.2 Privacy Policy Page & Modal (`Feature 1`)**
  - [ ] Create `app/legal/privacy/page.tsx` detailing RA 10173 compliance, DPO contact for Paete LGU, data retention, and resident rights.
  - [ ] Create quick-reference slide-over or modal for embedded viewing during signup and report submission.
- [ ] **1.3 Terms & Conditions (`Feature 3`)**
  - [ ] Build `app/legal/terms/page.tsx` outlining community guidelines, false report liabilities, official municipal response SLAs, and intellectual property.
- [ ] **1.4 Safety & Legal Protection Hub (`Feature 11`)**
  - [ ] Build `app/legal/safety/page.tsx` covering Whistleblower Protection, Anti-Harassment safeguards, and direct escalation contacts with the Provincial Ombudsman & DILG.
  - [ ] Add "Protektado ang Iyong Pagkakakilanlan" security badge inside report submission forms.

---

### Phase 2: User Account, Verification & Privacy Shield (Features 4, 5, 6)
- [ ] **2.1 Anonymous / Alias Reporting Shield (`Feature 6`)**
  - [ ] Add `isAnonymous` toggle in `components/reports/SubmitReportModal.tsx`.
  - [ ] Generate pseudonym aliases (e.g., *"Protektadong Mamamayan #104"*) on public feeds while storing the true authenticated UID in secure admin-only metadata for spam prevention.
  - [ ] Update `components/reports/ReportCard.tsx` to render masked avatar and alias badge when `isAnonymous` is enabled.
- [ ] **2.2 Barangay Verification System (`Feature 5`)**
  - [ ] Design verification state badges (`Unverified Resident`, `Barangay Verified`, `Community Leader`, `Municipal Officer`).
  - [ ] Create Barangay Residency verification modal in resident profile (ID upload / Barangay Certificate number entry).
  - [ ] Add verification approval review queue in `app/admin/dashboard/page.tsx` (under the Users tab).
- [ ] **2.3 User Data & Privacy Dashboard (`Feature 4`)**
  - [ ] Build resident settings tab / modal allowing users to view all submitted reports, upvotes, and comments.
  - [ ] Provide "Download My Civic Data" JSON/PDF export feature (Data Portability under RA 10173).
  - [ ] Provide "Request Data Deletion / Account Closure" flow.

---

### Phase 3: Community Reporting Module Enhancement (Feature 7)
- [x] **3.1 Social-Media Style Civic Feed UI**
  - [x] Responsive post cards with upvoting, verified author badges, and barangay tags.
  - [x] 3-tier Civic Action Pipeline visualizer (`Naisumite` ──> `Dispatched` ──> `Nalutas`).
- [x] **3.2 Official Government Disposition Toolbar**
  - [x] Quick status toggling (`Pending`, `In Progress`, `Resolved`, `Urgent`) for logged-in Admin and Governor.
  - [x] Official notice banner and public accountability notes.
- [x] **3.3 Community Discussion Thread**
  - [x] Expandable comments with role badges (`Opisyal ng Pamahalaan` vs `Resident`).
  - [x] Live local state dispatch for instant comment appending and status updates.
- [ ] **3.4 Media Attachments & Geotagging**
  - [ ] Camera / photo upload preview with Paete landmark / street tagging.
  - [ ] Filter reports by Barangay (e.g., Bagumbayan, Bangkusay, Ibaba del Sur, Ilaya del Norte, etc.).

---

### Phase 4: Public Transparency & Governance Hub (Features 8, 9, 10)
- [ ] **4.1 Project Transparency & Public Works History (`Feature 8`)**
  - [ ] Create `app/transparency/projects/page.tsx` displaying public municipal infrastructure projects, budget allocations, contractor details, and completion milestones.
  - [ ] Add interactive timeline filter (e.g., Flood Control, Road Widening, Streetlighting).
- [ ] **4.2 Officials & Accountability Directory (`Feature 9`)**
  - [ ] Create `app/transparency/officials/page.tsx` listing municipal and provincial officials (Mayor, Vice Mayor, Sangguniang Bayan, Barangay Captains, Provincial Governor).
  - [ ] Display civic response performance metrics: resolution rate (%), average response time (e.g., `< 48 hours`), and active civic reports handled.
- [ ] **4.3 Open Data & Civic Reports (`Feature 10`)**
  - [ ] Create `app/transparency/reports/page.tsx` featuring municipal resolution summaries, monthly incident charts, and download links for open datasets (CSV / JSON format).

---

### Phase 5: Navigation, UI Polish & Mobile Experience
- [ ] **5.1 Public Navigation & Footer Updates**
  - [ ] Update `components/navigation/Navbar.tsx` and create a rich civic footer linking to Legal, Transparency, and Emergency contacts.
- [ ] **5.2 Admin & Governor Sync**
  - [ ] Ensure admin dashboard navigation includes direct links to Transparency audits and verification queues.
- [ ] **5.3 Automated Builds & Type Check**
  - [ ] Run `npm run build` and ensure zero lint or TypeScript warnings.
