import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { auth, db, firebaseConfigured, requireAuth, requireDb } from '@/lib/firebase';
import { BLOCKED_MESSAGES } from '@/constants';
import { userVerificationRequests } from '@/services/verificationService';
import type { VerificationStatus } from '@/types';

const extraGoogleWebClientId = Constants.expoConfig?.extra?.firebase?.googleWebClientId as
  | string
  | undefined;

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || extraGoogleWebClientId;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined;

export const googleSignInConfigured = Boolean(GOOGLE_WEB_CLIENT_ID);

const VERIFICATION_VALUES: VerificationStatus[] = [
  'unverified',
  'pending',
  'barangay_verified',
  'community_leader',
  'municipal_officer',
  'rejected',
];

function isOfficialRole(role: unknown) {
  return role === 'admin' || role === 'governor' || role === 'official' || role === 'department_head';
}

type OfficialRoleCheck = { user: FirebaseUser; isOfficial: boolean };

function readVerificationStatus(value: unknown): VerificationStatus {
  return VERIFICATION_VALUES.includes(value as VerificationStatus)
    ? (value as VerificationStatus)
    : 'unverified';
}

function toFriendlyAuthError(error: unknown): Error {
  const code = (error as { code?: string } | null)?.code;
  const message = error instanceof Error ? error.message : String(error);

  if (code === statusCodes.SIGN_IN_CANCELLED) {
    return new Error('Sign-in was cancelled.');
  }
  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return new Error('Google Play Services is unavailable on this device, so Google sign-in cannot continue.');
  }
  if (code === '10' || /DEVELOPER_ERROR/i.test(`${code ?? ''} ${message}`)) {
    return new Error(
      'Google Sign-In rejected this Android build (DEVELOPER_ERROR). The SHA-1 of the keystore that signed the APK is not registered in Firebase. For an Expo debug build that is android/app/debug.keystore — check it with apksigner, register that fingerprint under Firebase Console → Project settings → Your apps → Android app, then rebuild.'
    );
  }
  if (/RNGoogleSignin|native module|NativeModule/i.test(message)) {
    return new Error(
      'Google Sign-In needs a development build. Run "npx expo run:ios" or "npx expo run:android" instead of Expo Go.'
    );
  }
  return error instanceof Error ? error : new Error(message);
}

async function ensureUserProfile(user: FirebaseUser): Promise<void> {
  const database = requireDb();
  const profileRef = doc(database, 'users', user.uid);
  const snapshot = await getDoc(profileRef);
  const existing = snapshot.exists() ? snapshot.data() : null;

  await setDoc(
    profileRef,
    {
      uid: user.uid,
      displayName: user.displayName || existing?.displayName || 'Paete Resident',
      name: user.displayName || existing?.name || 'Paete Resident',
      email: user.email || existing?.email || '',
      photoURL: user.photoURL || existing?.photoURL || null,
      role: existing?.role || 'resident',
      authProvider: 'google',
      verificationStatus: existing?.verificationStatus || 'unverified',
      lastLogin: serverTimestamp(),
      ...(existing
        ? {}
        : {
            createdAt: serverTimestamp(),
            registeredDate: new Date().toISOString(),
            reportsCount: 0,
          }),
    },
    { merge: true }
  );
}

type AuthContextValue = {
  user: FirebaseUser | null;
  loading: boolean;
  verificationStatus: VerificationStatus;
  isVerifiedResident: boolean;
  showResidencyVerification: boolean;
  googleReady: boolean;
  firebaseReady: boolean;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<VerificationStatus>('unverified');
  const [profileRole, setProfileRole] = useState<OfficialRoleCheck | null>(null);
  const [claimRole, setClaimRole] = useState<OfficialRoleCheck | null>(null);
  const showResidencyVerification =
    user !== null && profileRole?.user === user && !profileRole.isOfficial &&
    claimRole?.user === user && !claimRole.isOfficial;
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const verificationStatus = pendingUserId && pendingUserId === user?.uid &&
    (profileStatus === 'unverified' || profileStatus === 'rejected') ? 'pending' : profileStatus;

  useEffect(() => {
    if (!googleSignInConfigured) return;
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
        offlineAccess: false,
      });
    } catch (error) {
      console.warn('Google Sign-In configuration failed:', error);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (error) => {
        console.warn('Auth state listener error:', error);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!user || !db) {
      setProfileStatus('unverified');
      return;
    }
    return onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        const profile = snapshot.data();
        const status = readVerificationStatus(profile?.verificationStatus);
        setProfileStatus(status);
        setProfileRole({ user, isOfficial: isOfficialRole(profile?.role) || status === 'municipal_officer' });
      },
      () => setProfileStatus('unverified')
    );
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;

    void user.getIdTokenResult().then(({ claims }) => {
      if (active) setClaimRole({ user, isOfficial: claims.admin === true || isOfficialRole(claims.role) });
    }).catch((error) => {
      console.warn('Could not read the signed-in account role:', error);
    });

    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user || !db) return;
    return onSnapshot(
      userVerificationRequests(user.uid),
      (snapshot) => {
        setPendingUserId(snapshot.docs.some((request) => request.data().status === 'pending')
          ? user.uid
          : null);
      },
      () => setPendingUserId(null)
    );
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    if (!googleSignInConfigured) {
      throw new Error(BLOCKED_MESSAGES.googleNotConfigured);
    }

    const authInstance = requireAuth();

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (response.type !== 'success' || !response.data.idToken) {
        return null;
      }

      const credential = GoogleAuthProvider.credential(response.data.idToken);
      const result = await signInWithCredential(authInstance, credential);
      await ensureUserProfile(result.user);
      return result.user;
    } catch (error) {
      throw toFriendlyAuthError(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Native sign-out is best-effort; the Firebase session still has to be cleared.
    }
    if (auth) {
      await firebaseSignOut(auth);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      verificationStatus,
      showResidencyVerification,
      isVerifiedResident:
        verificationStatus === 'barangay_verified' ||
        verificationStatus === 'community_leader' ||
        verificationStatus === 'municipal_officer',
      googleReady: googleSignInConfigured,
      firebaseReady: firebaseConfigured,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, verificationStatus, showResidencyVerification, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}

export function displayNameFor(user: FirebaseUser | null): string {
  return user?.displayName || user?.email?.split('@')[0] || 'Paete Resident';
}
