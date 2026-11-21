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
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AuthProvider } from '@/lib/auth';
import { themes } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen may already be hidden during a Fast Refresh cycle.
});

export default function RootLayout() {
  const scheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Outfit_900Black,
    Outfit_700Bold,
    Outfit_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const palette = scheme === 'dark' ? themes.dark : themes.light;
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
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.colors.canvas },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="report/[id]" />
          <Stack.Screen
            name="submit"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="sign-in"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
