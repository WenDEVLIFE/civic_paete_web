# Civic Paete — Mobile

React Native client for Civic Paete, the community reporting platform for Paete, Laguna.
Built with Expo SDK 58 (React Native 0.88) and Expo Router.

The web client lives at the repository root. This app is a separate client of the **same Firebase
project**: same collections, same field names, same role and status vocabulary.

## Quick start

```bash
cd mobile
npm install
cp .env.example .env.local   # fill in the Firebase + Google values
npx expo start               # then press i (iOS), a (Android)
```

Node.js 22.13 or newer is required by Expo SDK 58.

## Environment

Expo inlines variables prefixed with `EXPO_PUBLIC_` at bundle time. `.env.local` is gitignored.

| Variable | Required | Purpose |
|---|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | yes | Firebase web config |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | yes | Firebase web config |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | yes | Firebase web config |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | yes | Report photo uploads |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | yes | Firebase web config |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | yes | Firebase web config |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | for sign-in | Web OAuth client from Google Cloud Console |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | for sign-in | iOS OAuth client for `ph.gov.paete.civic` |
| `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` | for sign-in | Reversed iOS client ID, registered as a URL scheme |

Without Firebase values the app still boots and shows a "Backend not configured" state.

## Google Sign-In needs a development build

Expo deprecated the `expo-auth-session` Google provider; the supported path is a native
Google Sign-In library, which cannot run inside Expo Go.

1. In Google Cloud Console, create OAuth clients for the iOS bundle ID `ph.gov.paete.civic`
   and the Android package `ph.gov.paete.civic` (include your debug SHA-1 for Android).
2. Put the client IDs in `.env.local`.
3. Build and run:

```bash
npx expo run:ios       # or npx expo run:android
```

Expo Go can browse the feed, open reports, and read threads, but the Google button will report that
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
