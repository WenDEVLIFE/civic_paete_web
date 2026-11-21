/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { ConfigContext, ExpoConfig } from 'expo/config';

const ANDROID_PACKAGE = 'ph.gov.paete.civic';
const GOOGLE_SERVICES_FILE = './google-services.json';
const GOOGLE_IOS_URL_SCHEME = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

const projectRoot = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

type GoogleServicesClient = {
  client_info?: {
    mobilesdk_app_id?: string;
    android_client_info?: { package_name?: string };
  };
  api_key?: Array<{ current_key?: string }>;
  oauth_client?: Array<{ client_id?: string; client_type?: number }>;
};

type GoogleServicesFile = {
  project_info?: {
    project_number?: string;
    project_id?: string;
    storage_bucket?: string;
  };
  client?: GoogleServicesClient[];
};

type FirebaseExtra = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  googleWebClientId?: string;
};

/**
 * Firebase's own Android config file already contains everything the JS SDK needs, plus the
 * auto-created Web OAuth client used for Google Sign-In. Reading it here keeps the mobile client
 * on the same Firebase project as the web app without duplicating client IDs by hand.
 */
function readFirebaseAndroidConfig(): {
  hasGoogleServicesFile: boolean;
  firebase?: FirebaseExtra;
} {
  const filePath = path.resolve(projectRoot, GOOGLE_SERVICES_FILE);
  if (!existsSync(filePath)) {
    return { hasGoogleServicesFile: false };
  }

  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as GoogleServicesFile;
    const client =
      parsed.client?.find(
        (entry) => entry.client_info?.android_client_info?.package_name === ANDROID_PACKAGE
      ) ?? parsed.client?.[0];

    const projectId = parsed.project_info?.project_id;
    const apiKey = client?.api_key?.[0]?.current_key;
    const appId = client?.client_info?.mobilesdk_app_id;

    // Firebase only creates the Android OAuth client (client_type 1) once an app SHA-1 is
    // registered. Without it, native Google Sign-In fails with DEVELOPER_ERROR.
    const hasAndroidOAuthClient = Boolean(
      client?.oauth_client?.some((entry) => entry.client_type === 1)
    );
    if (!hasAndroidOAuthClient) {
      console.warn(
        '[civic-paete] google-services.json has no Android OAuth client. Google Sign-In will fail ' +
          'with DEVELOPER_ERROR until the app SHA-1 fingerprint is registered in Firebase Console ' +
          'and google-services.json is downloaded again.'
      );
    }

    if (!projectId || !apiKey || !appId) {
      return { hasGoogleServicesFile: true };
    }

    return {
      hasGoogleServicesFile: true,
      firebase: {
        apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: parsed.project_info?.storage_bucket ?? `${projectId}.appspot.com`,
        messagingSenderId: parsed.project_info?.project_number ?? '',
        appId,
        googleWebClientId: client?.oauth_client?.find((entry) => entry.client_type === 3)
          ?.client_id,
      },
    };
  } catch {
    return { hasGoogleServicesFile: true };
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const { hasGoogleServicesFile, firebase } = readFirebaseAndroidConfig();

  const plugins: ExpoConfig['plugins'] = [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0A1931',
        image: './assets/images/splash-icon.png',
        imageWidth: 96,
        dark: { backgroundColor: '#071126' },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow Civic Paete to attach a photo of the community concern you are reporting.',
        microphonePermission: false,
      },
    ],
  ];

  // Google Sign-In needs the reversed iOS client ID as a URL scheme. It is added only
  // when configured so an Android-only build needs no iOS credentials.
  if (GOOGLE_IOS_URL_SCHEME) {
    plugins.push([
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: GOOGLE_IOS_URL_SCHEME },
    ]);
  }

  return {
    ...config,
    name: 'Civic Paete',
    slug: 'civic-paete',
    version: '0.1.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'civicpaete',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: false,
      bundleIdentifier: ANDROID_PACKAGE,
    },
    android: {
      package: ANDROID_PACKAGE,
      ...(hasGoogleServicesFile ? { googleServicesFile: GOOGLE_SERVICES_FILE } : {}),
      adaptiveIcon: {
        backgroundColor: '#0A1931',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'server',
      favicon: './assets/images/favicon.png',
    },
    plugins,
    extra: {
      ...config.extra,
      ...(firebase ? { firebase } : {}),
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
