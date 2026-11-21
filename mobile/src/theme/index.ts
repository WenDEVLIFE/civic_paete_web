import { useColorScheme } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const fonts = {
  display: 'Outfit_900Black',
  heading: 'Outfit_700Bold',
  subtitle: 'Outfit_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodyBold: 'PlusJakartaSans_600SemiBold',
  label: 'PlusJakartaSans_700Bold',
} as const;

export const typeScale = {
  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, letterSpacing: -0.6 },
  title: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 28, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.heading, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  subtitle: { fontFamily: fonts.subtitle, fontSize: 15, lineHeight: 21 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18 },
  label: { fontFamily: fonts.label, fontSize: 11, lineHeight: 14, letterSpacing: 1.1 },
} as const;

type StatusColors = { fg: string; bg: string; border: string };

export type Theme = {
  scheme: 'light' | 'dark';
  colors: {
    canvas: string;
    surface: string;
    surfaceAlt: string;
    surfaceSunken: string;
    border: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    navy: string;
    navySurface: string;
    primary: string;
    primaryPressed: string;
    onPrimary: string;
    wave: string;
    glow: string;
    pattern: string;
    overlay: string;
    inputBg: string;
    danger: string;
    dangerSurface: string;
    status: Record<'pending' | 'urgent' | 'in_progress' | 'resolved', StatusColors>;
  };
};

const light: Theme = {
  scheme: 'light',
  colors: {
    canvas: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF2F8',
    surfaceSunken: '#E3EAF4',
    border: '#D7DFEA',
    borderStrong: '#B9C6D8',
    text: '#071126',
    textMuted: '#51607A',
    textSubtle: '#7A879E',
    navy: '#0A1931',
    navySurface: '#112347',
    primary: '#2563EB',
    primaryPressed: '#1D4ED8',
    onPrimary: '#FFFFFF',
    wave: '#60A5FA',
    glow: 'rgba(37,99,235,0.12)',
    pattern: 'rgba(37,99,235,0.16)',
    overlay: 'rgba(7,17,38,0.55)',
    inputBg: '#FFFFFF',
    danger: '#DC2626',
    dangerSurface: '#FEE2E2',
    status: {
      pending: { fg: '#B45309', bg: '#FEF3C7', border: '#FDE68A' },
      urgent: { fg: '#B91C1C', bg: '#FEE2E2', border: '#FECACA' },
      in_progress: { fg: '#1D4ED8', bg: '#DBEAFE', border: '#BFDBFE' },
      resolved: { fg: '#047857', bg: '#D1FAE5', border: '#A7F3D0' },
    },
  },
};

const dark: Theme = {
  scheme: 'dark',
  colors: {
    canvas: '#071126',
    surface: '#0A1931',
    surfaceAlt: '#112347',
    surfaceSunken: '#0E1B33',
    border: 'rgba(147,197,253,0.16)',
    borderStrong: 'rgba(147,197,253,0.32)',
    text: '#F1F5F9',
    textMuted: '#A8B6CE',
    textSubtle: '#7C8BA6',
    navy: '#0A1931',
    navySurface: '#112347',
    primary: '#3B82F6',
    primaryPressed: '#2563EB',
    onPrimary: '#FFFFFF',
    wave: '#60A5FA',
    glow: 'rgba(96,165,250,0.16)',
    pattern: 'rgba(96,165,250,0.20)',
    overlay: 'rgba(3,8,18,0.72)',
    inputBg: '#0E1B33',
    danger: '#F87171',
    dangerSurface: 'rgba(239,68,68,0.14)',
    status: {
      pending: { fg: '#FBBF24', bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.32)' },
      urgent: { fg: '#F87171', bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.32)' },
      in_progress: { fg: '#60A5FA', bg: 'rgba(59,130,246,0.14)', border: 'rgba(59,130,246,0.32)' },
      resolved: { fg: '#34D399', bg: 'rgba(16,185,129,0.14)', border: 'rgba(16,185,129,0.32)' },
    },
  },
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}

export const themes = { light, dark };
