import type { ConfigContext, ExpoConfig } from 'expo/config';

const GOOGLE_IOS_URL_SCHEME = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

export default ({ config }: ConfigContext): ExpoConfig => {
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
  // when configured so a build without Google credentials still succeeds.
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
      bundleIdentifier: 'ph.gov.paete.civic',
    },
    android: {
      package: 'ph.gov.paete.civic',
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
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
