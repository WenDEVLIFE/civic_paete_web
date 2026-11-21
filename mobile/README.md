# Civic Paete — Mobile

React Native client for Civic Paete, the community reporting platform for Paete, Laguna.
Built with Expo SDK 58 (React Native 0.88) and Expo Router.

The web client lives at the repository root. This app is a separate client of the **same Firebase
project**: same collections, same field names, same role and status vocabulary.

## Quick start

```bash
cd mobile
npm install
# add google-services.json from the same Firebase project as the web app (see below)
npx expo start               # then press a (Android)
```

Node.js 22.13 or newer is required by Expo SDK 58.

## Firebase configuration

This app is a second client of the **same Firebase project** the web app uses. No separate backend,
no separate user store.

1. Open that project in the Firebase console.
2. Select the Android app for package `ph.gov.paete.civic` (create it if it is missing).
3. Register your signing fingerprint under **Project settings → Your apps → Android app → Add
   fingerprint**. For a local debug build:

   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey \
     -storepass android -keypass android
   ```

   The debug SHA-1 covers local development; add the release and Play App Signing fingerprints
   before shipping.
4. Download `google-services.json` and place it at `mobile/google-services.json`.
5. Check that the file contains an **Android** OAuth client (`client_type: 1`). If `oauth_client`
   only lists `client_type: 3`, the fingerprint is not registered yet and native sign-in will fail
   with `DEVELOPER_ERROR`.
6. That is the whole setup. `app.config.ts` reads the file, passes it to
   `android.googleServicesFile`, and derives the runtime Firebase config (API key, app ID, project
   ID, storage bucket, sender ID) plus the auto-created **Web OAuth client ID** (`client_type: 3`)
   that Google Sign-In needs.

The values land in `expo.extra.firebase`, so the JS SDK initializes from them at runtime. Explicit
`EXPO_PUBLIC_*` variables still win, for teams that need a different project per environment.

Without `google-services.json` or env values the app still boots and shows a "Backend not
configured" state.

| Variable | Required | Purpose |
|---|---|---|
| `EXPO_PUBLIC_FIREBASE_*` (6 keys) | no | Override the values derived from `google-services.json` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | no | Override the Web OAuth client from `google-services.json` |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | iOS only | iOS OAuth client |
| `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` | iOS only | Reversed iOS client ID, registered as a URL scheme |

## Google Sign-In on Android

Authentication is Firebase Authentication, exactly like the web app: the same Google provider in
the same project, the same `users/{uid}` profile documents, and the same Firestore rules.

What differs is how the Google credential is obtained. Firebase's `signInWithPopup` and
`signInWithRedirect` are browser-only — the React Native build of `firebase/auth` does not contain
them. On native, `@react-native-google-signin/google-signin` obtains the Google ID token, and
`signInWithCredential` exchanges it for a Firebase session. It is a credential source, not a second
auth system.

That native module cannot run in Expo Go, so sign-in requires a development build:

```bash
npx expo run:android
```

Expo Go can still browse the feed, open reports, and read threads; the Google button will report that
a development build is required.

## What ships in this pass

- Community feed streaming the `reports` collection with barangay, category, status, and text filters.
- Report detail: photo, status, meta, timeline, atomic upvote, and comment thread.
- Report submission: Google identity, progressive-verification gate, mandatory photo, anonymous mode.
- Account tab: identity, verification status, sign in / sign out.

Deferred: admin console, transparency dashboards, verification-request submission, and push
notifications (FCM).

## Architecture

```
src/
  app/                    Expo Router routes
    (tabs)/index.tsx      community feed
    (tabs)/profile.tsx    citizen account
    report/[id].tsx       report detail
    submit.tsx            report form (modal)
    sign-in.tsx           Google sign-in (modal)
  components/             UI primitives, report card, category icons
  constants.ts            barangays, categories, status labels, limits
  lib/
    firebase.ts           app/auth/firestore/storage initialization
    auth.tsx              AuthProvider: Google credential → Firebase session
    format.ts             dates and file sizes
  services/
    reportService.ts      Firestore contracts for reports, upvotes, comments
  storage/
    uploadReportImage.ts  on-device compression + Storage upload
  theme/                  design tokens, light/dark palettes
  types.ts                shared domain types
```

### Why the service layer is mirrored instead of imported

`lib/services/*` at the repository root is React-free, so importing it directly was considered. It
does not work safely: Metro would resolve the `firebase` package from two different `node_modules`
trees, and Firebase is a stateful singleton. Two module instances mean two app registries and
`No Firebase App '[DEFAULT]' has been created` at runtime.

This app therefore mirrors the contracts in `src/services/`. The invariant is the Firestore schema,
not the module path. Extraction into a shared workspace package is the follow-up once both clients
stabilize.

### Contract notes

- Report documents keep the exact web shape: `status`, `date`, `timeline`, `comments`, nullable
  author fields, and `serverTimestamp()` audit fields.
- Upvotes stay atomic through a Firestore transaction over `reports/{id}` and
  `reports/{id}/upvotes/{voterId}`, using a persisted device voter id.
- Comments are stored in `reports/{id}/comments`; legacy `comments[]` arrays are read as a fallback.
- Photos upload to `reports/{barangaySlug}/{reportId}_{timestamp}.jpg` with the same cache metadata.
  The web client prefers WebP via Canvas; React Native cannot, so mobile uses native JPEG
  compression at 1920 px / 0.82 quality.
- Submission is blocked unless the account is `barangay_verified`, `community_leader`, or
  `municipal_officer`.

## Verification

```bash
npx tsc --noEmit
npx expo-doctor
npx expo export --platform ios    # bundles the app without a device
```
