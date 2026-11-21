import { useId, useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { radius, spacing, typeScale, useTheme, type Theme } from '@/theme';
import { STATUS_META } from '@/constants';
import type { ReportStatus } from '@/types';

type TextVariant = keyof typeof typeScale;

export function AppText({
  variant = 'body',
  color,
  style,
  children,
  numberOfLines,
}: {
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  numberOfLines?: number;
}) {
  const theme = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[typeScale[variant], { color: color ?? theme.colors.text }, style]}
    >
      {children}
    </Text>
  );
}

/** Subtle Paete woodcarving (ukit) relief motif, mirroring the web `.civic-ukit-pattern`. */
export function CivicPattern({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  const patternId = `ukit-${useId().replace(/[:]/g, '')}`;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id={patternId} width={24} height={24} patternUnits="userSpaceOnUse">
            <Circle cx={1.5} cy={1.5} r={1.15} fill={theme.colors.pattern} />
            <Circle cx={13.5} cy={13.5} r={1.15} fill={theme.colors.pattern} opacity={0.55} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
    </View>
  );
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  bottomInset = 110,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  bottomInset?: number;
}) {
  const theme = useTheme();
  const background = { backgroundColor: theme.colors.canvas };
  const padding = padded ? styles.screenPadding : undefined;

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, background]}>
      <CivicPattern />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.screen, background, padding, { paddingBottom: bottomInset }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.screen, background, padding, styles.fill]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

function useSurface(theme: Theme) {
  return {
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
  };
}

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const surface = useSurface(theme);

  if (!onPress) {
    return <View style={[styles.card, surface.card, style]}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        surface.card,
        pressed && { transform: [{ scale: 0.985 }], borderColor: theme.colors.borderStrong },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: isDisabled
            ? theme.colors.surfaceSunken
            : pressed
              ? theme.colors.primaryPressed
              : theme.colors.primary,
          opacity: isDisabled ? 0.75 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <>
          {icon}
          <AppText variant="bodyBold" color={isDisabled ? theme.colors.textMuted : theme.colors.onPrimary}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        {
          borderColor: theme.colors.borderStrong,
          backgroundColor: pressed ? theme.colors.surfaceAlt : 'transparent',
        },
        style,
      ]}
    >
      {icon}
      <AppText variant="bodyBold">{label}</AppText>
    </Pressable>
  );
}

export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt,
          borderColor: active ? theme.colors.primary : theme.colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <AppText
        variant="caption"
        style={styles.chipLabel}
        color={active ? theme.colors.onPrimary : theme.colors.textMuted}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  style,
  ...props
}: TextInputProps & { label: string; hint?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.fieldGroup}>
      <AppText variant="label" color={theme.colors.textSubtle} style={styles.fieldLabel}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={theme.colors.textSubtle}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
          style,
        ]}
        {...props}
      />
      {hint ? (
        <AppText variant="caption" color={theme.colors.textSubtle}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

export function StatusPill({ status }: { status: ReportStatus }) {
  const theme = useTheme();
  const palette = theme.colors.status[status];
  return (
    <View
      style={[
        styles.statusPill,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      <View style={[styles.statusDot, { backgroundColor: palette.fg }]} />
      <AppText variant="label" color={palette.fg} style={styles.statusLabel}>
        {STATUS_META[status].label}
      </AppText>
    </View>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.emptyState}>
      {icon ? (
        <View
          style={[
            styles.emptyIcon,
            { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
          ]}
        >
          {icon}
        </View>
      ) : null}
      <AppText variant="heading" style={styles.emptyTitle}>
        {title}
      </AppText>
      <AppText variant="body" color={theme.colors.textMuted} style={styles.emptyMessage}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.emptyAction} />
      ) : null}
    </View>
  );
}

export function LoadingState({ label = 'Loading community reports…' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.loadingState}>
      <ActivityIndicator color={theme.colors.primary} />
      <AppText variant="caption" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

export function Reveal({ index = 0, children }: { index?: number; children: ReactNode }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(14));
  const delay = Math.min(index, 8) * 45;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}

export function Divider() {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flexGrow: 1 },
  fill: { flex: 1 },
  screenPadding: { paddingHorizontal: spacing.lg },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { fontSize: 12.5, letterSpacing: 0.1 },
  fieldGroup: { gap: spacing.xs },
  fieldLabel: { textTransform: 'uppercase' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    lineHeight: 20,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 10 },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: { textAlign: 'center' },
  emptyMessage: { textAlign: 'center', maxWidth: 320 },
  emptyAction: { marginTop: spacing.md, minWidth: 200 },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  divider: { height: 1, width: '100%' },
});
