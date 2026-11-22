import {
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_900Black,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/lib/auth';
import { PreferencesProvider } from '@/lib/preferences';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen may already be hidden during a Fast Refresh cycle.
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_900Black,
    Outfit_700Bold,
    Outfit_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PreferencesProvider>
      <AppNavigation />
    </PreferencesProvider>
  );
}

function AppNavigation() {
  const palette = useTheme();
  const { scheme } = palette;
  const pathname = usePathname();
  const hasNavyHeader = pathname === '/' || pathname === '/profile';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: palette.colors.canvas,
      card: palette.colors.surface,
      text: palette.colors.text,
      border: palette.colors.border,
      primary: palette.colors.primary,
      notification: palette.colors.primary,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <AuthProvider>
        <StatusBar style={scheme === 'dark' || hasNavyHeader ? 'light' : 'dark'} />
        <SessionStack backgroundColor={palette.colors.canvas} />
      </AuthProvider>
    </ThemeProvider>
  );
}

function SessionStack({ backgroundColor }: { backgroundColor: string }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report/[id]" />
        <Stack.Screen name="verification" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="submit"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
