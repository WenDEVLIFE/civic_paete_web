# Mobile App — Civic Paete (React Native / Expo)

Objective: add a React Native mobile client for Civic Paete under `mobile/`, covering the citizen flow
(Google sign-in, community feed, report detail, report submission with photo upload).
Branch: `mobile-app` · Delivery: single PR · Test runner: `npx tsc --noEmit` + `npx expo export`

## Specs

- **S1 — React Native app exists and boots.** "lets add react native here for mobile app." The app lives
  in `mobile/` as an Expo SDK 58 (React Native 0.88) TypeScript project created by `create-expo-app`,
  runs on iOS and Android, and does not modify or move the existing Next.js web app at the repository root.
- **S2 — Firebase is wired for React Native.** Auth persists across restarts via AsyncStorage, and
  Firestore/Storage initialize once from `EXPO_PUBLIC_FIREBASE_*` environment variables. No direct use of
  `getAuth()` browser-only persistence.
- **S3 — Citizen feed.** Home screen streams the `reports` collection ordered by `createdAt` desc,
  with client-side filtering by barangay, category, and status, plus title search. Loading, empty, and
  error states are explicit.
- **S4 — Report detail.** Detail screen subscribes to `reports/{id}` and renders status pill, meta grid,
  description, photo, timeline, upvote control, and comment thread with comment submission.
- **S5 — Report submission with photo.** Submission requires Google sign-in, requires progressive
  verification (`barangay_verified` | `community_leader` | `municipal_officer`), requires a photo of at
  most 5 MB, and writes the identical Firestore document shape used by the web app.
- **S6 — Contract parity with the web client.** Collection paths (`reports`, `reports/{id}/upvotes`,
  `reports/{id}/comments`, `users`), field names, status/category/barangay values, storage object path
  (`reports/{slug}/{reportId}_{timestamp}.{webp|jpg}`), and user-facing blocking messages match
  `lib/services/*` and `components/reports/SubmitReportModal.tsx`.
- **S7 — Civic Paete visual identity.** Dark-navy / Paete-blue token palette, Outfit + Plus Jakarta Sans
  typography, 44pt minimum touch targets, tap feedback, staggered list reveal, and no generic Expo demo UI.

Scope boundaries (explicitly deferred): admin dashboard, transparency dashboards, verification request
submission, push notifications (FCM), web export parity.

## Tasks

| ID | Specs | Route | Status | Evidence |
|----|-------|-------|--------|----------|
| T1 | S1, S2 | inline | done | Expo SDK 58.0.26 scaffold in `mobile/`, deps pinned via `expo install`, `expo-doctor` 20/20 |
| T2 | S7 | inline | done | `src/theme/index.ts`, `src/components/ui.tsx`, SVG `CivicPattern` |
| T3 | S2 | inline | done | `src/lib/firebase.ts` (AsyncStorage persistence), `src/lib/auth.tsx` (google-signin v17, profile upsert) |
| T4 | S6 | inline | done | `src/types.ts`, `src/constants.ts` mirror web vocabulary |
| T5 | S3, S4, S6 | inline | done | `src/services/reportService.ts` (feed, detail, atomic upvote, comments) |
| T6 | S5, S6 | inline | done | `src/storage/uploadReportImage.ts` (ImageManipulator + `File.bytes` + `uploadBytes`) |
| T7 | S1, S3, S4, S5, S7 | inline | done | `(tabs)/index`, `(tabs)/profile`, `report/[id]`, `submit`, `sign-in` |
| T8 | all | inline | done | `tsc --noEmit` exit 0, `expo lint` exit 0, `expo-doctor` 20/20, `expo export --platform android` 7.1 MB Hermes bundle |


## Log

### L1 — User request (verbatim)
> lets add react native here for mobile app.

### L2 — Scope decision
Selected first-pass scope: "Scaffold + citizen core" — Expo app bootable on iOS/Android with Firebase
wired, and the citizen flow: Google sign-in, home, report list/detail, and report submission with photo
upload. Admin and transparency views deferred.

### L3 — Architecture decision: mirrored service layer, not a shared import
The selected option described a "shared services alias". Implementation deviates, deliberately:
importing `lib/services/*` from `mobile/` through Metro would resolve the `firebase` package from two
different `node_modules` trees, producing two Firebase module instances (Firebase is a stateful
singleton). The robust alternative is a mirrored service layer in `mobile/src/services/` with identical
collection paths, field names, and function contracts. Extraction to a shared npm workspace package is
the follow-up once both clients stabilize.

### L4 — Environment facts verified
- Expo SDK 58.0.26 / expo-router 58.0.32, React Native 0.88.1, React 19.3.0, Node 24.18.1 (min 22.13).
- Web client pins `firebase@^12.19.0`; Expo requires `firebase@>=12`. Mobile pins `^12.19.0` for parity.
- `lib/` contains zero React/Next imports, but `roleHelper.ts` (localStorage/cookie) and
  `uploadReportImage.ts` (FileReader/Canvas/WebP) are browser-locked and must be reimplemented natively.

### L5 — Android-first scope (user decision)
User directive: "no skip ios since android lng taypo" — Android is the target platform. iOS
verification is out of scope. The Google Sign-In config plugin stays conditional on
`EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` so Android builds never require iOS credentials.

### L6 — Deviations from the web client (deliberate)
- Photo upload failure aborts submission with a retry message. The web client swallows the error
  and files a report without a photo, which loses required triage evidence.
- Legacy `comments[]` arrays are displayed read-only. The web client migrates them into the
  subcollection from inside a read listener; writing from an `onSnapshot` callback on mobile is
  avoidable risk.
- The web `isUserAdminOrGovernor` heuristic relies on `localStorage` and `document.cookie`, which do
  not exist in React Native. Submission is gated on verification status only; role enforcement
  remains a Firestore-rules concern, as it already is for the web client.

### L7 — Verification evidence and runtime limit
`npx tsc --noEmit` → exit 0. `npx expo lint` → exit 0. `npx expo-doctor` → 20/20 checks passed.
`npx expo export --platform android` → 7.1 MB Hermes bytecode bundle, proving every import resolves
under Metro for the Android target. No Android SDK or `adb` exists in this environment, so the app
was bundled but NOT launched on a device or emulator. Google Sign-In remains untested end to end
because it needs OAuth client IDs and a development build.

### L8 — Firebase-native Google configuration (user directive)
User clarified: "im using firebase in google auth same with the web". Confirmed: the session already is
Firebase Authentication (`signInWithCredential` → same Firebase project, same `users/{uid}` documents).
Corrected the mechanism: `signInWithPopup` does not exist in the React Native build of `@firebase/auth`
(0 occurrences, versus 1 in the web build), so a native Google library supplies the ID token only.

`app.config.ts` now reads `mobile/google-services.json` — the file Firebase itself generates for the
same project as web — sets `android.googleServicesFile`, and derives `extra.firebase`
(apiKey, authDomain, projectId, storageBucket, senderId, appId) plus the auto-created web OAuth client
(`client_type: 3`) as `googleWebClientId`. Hand-managed client IDs are no longer required;
`EXPO_PUBLIC_*` values still override for multi-environment builds. Verified with a synthetic fixture
through `expo config --json`; the fixture was removed afterwards.

### L9 — Real google-services.json adopted
The user's file lives at the repository root and belongs to project `glenndatabase`, which matches the
web client on project ID, storage bucket, and sender ID. Its Android package is already
`ph.gov.paete.civic`, so no package drift. The file was copied to `mobile/google-services.json`;
`app.config.ts` now derives the real Firebase config and the Web OAuth client from it.

Blocker found: the file lists only `client_type: 3` (web client) and no Android OAuth client
(`client_type: 1`), which means no SHA-1 fingerprint is registered in Firebase yet. Native sign-in
would fail with `DEVELOPER_ERROR` (code 10). Debug keystore SHA-1 on this machine:
`31:D0:40:81:20:42:3A:E0:B7:DD:5C:2B:3E:42:52:37:1D:71:07:8C`. The app now maps that failure to an
explanatory message, and `app.config.ts` warns at config time when the Android client is missing.

### L10 — First emulator run (runtime findings)
Built and installed on the `Pixel_Tablet` AVD (API 35) with `npx expo run:android --no-bundler`
(Gradle 9.4.1, JDK 21, 80 MB debug APK). Verified by screenshot: feed with 4 live reports and photos,
report detail with real Firestore data (title, author, timeline), and the account tab.

Three defects found only at runtime:
- Firestore stayed empty with `WebChannelConnection RPC 'Listen' stream transport errored`. Root cause
  was the AVD clock: it was 32 days behind the host, so TLS to `firestore.googleapis.com` failed
  (`curl` from the device returned `000`). A cold boot re-synced the clock.
- Added `initializeFirestore(app, { experimentalForceLongPolling: true })`; the default WebChannel
  streaming transport is unreliable in React Native.
- Empty `EXPO_PUBLIC_GOOGLE_*=` placeholders in `.env.local` shadowed the values derived from
  `google-services.json`, because `??` treats `""` as defined. Switched env fallbacks to `||` and
  removed the empty keys, so the account screen now recognizes Google as configured.

Google sign-in was not exercised end to end: the Android OAuth client is still absent (`client_type`
`[3]` only), so it will fail with `DEVELOPER_ERROR` until the SHA-1 fingerprint is registered.

### L11 — Google Sign-In verified after SHA-1 registration
The user registered the debug SHA-1 in Firebase and replaced `mobile/google-services.json`. The new
file now contains both `client_type: 1` (Android) and `client_type: 3` (web). Rebuilt incrementally
(1m 5s). Google's account screen appeared, but that was Play Services' add-account flow; the actual
`signIn()` still returned `DEVELOPER_ERROR`.

Root cause: the installed APK is signed by `android/app/debug.keystore`, the keystore Expo prebuild
generates — not `~/.android/debug.keystore`. `apksigner verify --print-certs` on the APK reports
SHA-1 `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` (the shared React Native debug
certificate), while the fingerprint originally supplied was the home keystore's `31:D0:40:...`. The
README and the in-app `DEVELOPER_ERROR` message now point at the APK signer, not the home keystore.
Pending: register `5E:8F:...` in Firebase and rebuild.

### L12 — Google Sign-In verified end to end
The APK signer SHA-1 was registered and `google-services.json` replaced (two Android clients plus the
web client). After the incremental rebuild, Google sign-in completed for real: the account tab shows
the signed-in Google identity (`Frouen Medina Jr`, `medinajrfrouen@gmail.com`), meaning
`signInWithCredential` returned a Firebase session and the `users/{uid}` upsert ran.

The session also survived a force-stop and relaunch, proving the AsyncStorage auth persistence works.
The submission gate correctly blocks the unverified account with "Verified resident account required".

Fixed: `router.dismissAll()` in the sign-in modal emitted an unhandled `POP_TO_TOP` action when the
modal was the only route (deep link or reload). It now uses `router.canGoBack() ? router.back() :
router.replace('/')`.

Remaining: end-to-end report submission needs a verified account (`barangay_verified` or higher),
which currently only the web verification flow can grant.


Clarified for the user: `client_type: 1` authenticates the app to Play Services via package + SHA-1
and is never passed to `GoogleSignin.configure`. `client_type: 3` is the ID-token audience required by
Firebase's `signInWithCredential`; without it `signIn()` returns `idToken: null`. Both come from
`google-services.json` in the same Firebase project and neither involves the web client app.





