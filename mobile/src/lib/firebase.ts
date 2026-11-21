import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { BLOCKED_MESSAGES } from '@/constants';

/**
 * `getReactNativePersistence` exists only on the React Native build of firebase/auth, which
 * Metro selects through the package's "react-native" export condition. The public web typings
 * do not declare it, so it is read through a narrowed runtime shape.
 */
type InitOptions = NonNullable<Parameters<typeof initializeAuth>[1]>;
type PersistenceFactory = (storage: unknown) => InitOptions['persistence'];

const getReactNativePersistence = (
  FirebaseAuth as unknown as { getReactNativePersistence?: PersistenceFactory }
).getReactNativePersistence;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase web config values are public client identifiers, but a build without them
 * must still boot instead of crashing at import time.
 */
export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (firebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  try {
    // AsyncStorage keeps the session across app restarts. Metro resolves the React Native
    // build of firebase/auth through the "react-native" export condition.
    const persistence = getReactNativePersistence?.(AsyncStorage);
    authInstance = persistence
      ? initializeAuth(app, { persistence })
      : getAuth(app);
  } catch {
    // Fast Refresh can re-run this module after auth was already initialized.
    authInstance = getAuth(app);
  }

  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export function requireAuth(): Auth {
  if (!authInstance) {
    throw new Error(BLOCKED_MESSAGES.notConfigured);
  }
  return authInstance;
}

export function requireDb(): Firestore {
  if (!dbInstance) {
    throw new Error(BLOCKED_MESSAGES.notConfigured);
  }
  return dbInstance;
}

export function requireStorage(): FirebaseStorage {
  if (!storageInstance) {
    throw new Error(BLOCKED_MESSAGES.notConfigured);
  }
  return storageInstance;
}
