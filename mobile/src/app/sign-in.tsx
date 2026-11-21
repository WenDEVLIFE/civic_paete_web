import { router } from 'expo-router';
import { BadgeCheck, ShieldCheck, UserRoundCheck, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, PrimaryButton, SecondaryButton } from '@/components/ui';
import { BLOCKED_MESSAGES } from '@/constants';
import { useAuth } from '@/lib/auth';
import { radius, spacing, useTheme } from '@/theme';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Accountable reports',
    body: 'Every concern traces back to a verified Paete resident, which deters fake or automated submissions.',
  },
  {
    icon: BadgeCheck,
    title: 'Official endorsement',
    body: 'Verified reports are routed to the correct Barangay Captain and Municipal Engineering Office.',
  },
  {
    icon: UserRoundCheck,
    title: 'Anonymous mode still available',
    body: 'Hide your name from the public feed while the municipality keeps your identity for follow-up.',
  },
];

export default function SignInScreen() {
  const theme = useTheme();
  const { googleReady, signInWithGoogle, user } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      const nextUser = await signInWithGoogle();
      if (nextUser) {
        router.dismissAll();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in could not complete.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.canvas }]}>
      <View style={styles.topBar}>
        <AppText variant="label" color={theme.colors.textSubtle} style={styles.topBarLabel}>
          Citizen access
        </AppText>
        <View style={styles.flexSpacer} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sign-in"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: pressed ? theme.colors.surfaceAlt : theme.colors.surface,
            },
          ]}
        >
          <X size={18} color={theme.colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.mark,
            { backgroundColor: theme.colors.navy, borderColor: theme.colors.borderStrong },
          ]}
        >
          <ShieldCheck size={30} color={theme.colors.wave} strokeWidth={2.2} />
        </View>

        <AppText variant="title" style={styles.center}>
          One verified resident, one accountable voice
        </AppText>
        <AppText variant="body" color={theme.colors.textMuted} style={styles.center}>
          Sign in with Google to connect your Paete residency verification to your reports and
          community replies.
        </AppText>

        <View style={styles.reasons}>
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <View
                key={reason.title}
                style={[
                  styles.reason,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <View
                  style={[
                    styles.reasonIcon,
                    { backgroundColor: theme.colors.glow, borderColor: theme.colors.border },
                  ]}
                >
                  <Icon size={16} color={theme.colors.primary} />
                </View>
                <View style={styles.reasonCopy}>
                  <AppText variant="bodyBold">{reason.title}</AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {reason.body}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>

        {!googleReady ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: theme.colors.dangerSurface, borderColor: theme.colors.danger },
            ]}
          >
            <AppText variant="caption" color={theme.colors.danger}>
              {BLOCKED_MESSAGES.googleNotConfigured}
            </AppText>
          </View>
        ) : null}

        {error ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: theme.colors.dangerSurface, borderColor: theme.colors.danger },
            ]}
          >
            <AppText variant="caption" color={theme.colors.danger}>
              {error}
            </AppText>
          </View>
        ) : null}

        {user ? (
          <PrimaryButton
            label="You are already signed in"
            onPress={() => router.back()}
          />
        ) : (
          <PrimaryButton
            label={signingIn ? 'Opening Google…' : 'Continue with Google'}
            loading={signingIn}
            disabled={!googleReady}
            onPress={handleSignIn}
          />
        )}

        <SecondaryButton label="Continue browsing" onPress={() => router.back()} />

        <AppText variant="caption" color={theme.colors.textSubtle} style={styles.center}>
          {googleReady
            ? 'Google Sign-In uses a development build. If sign-in fails, run npx expo run:ios or npx expo run:android.'
            : BLOCKED_MESSAGES.notConfigured}
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topBarLabel: { textTransform: 'uppercase' },
  flexSpacer: { flex: 1 },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 96,
    gap: spacing.lg,
    alignItems: 'stretch',
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  center: { textAlign: 'center' },
  reasons: { gap: spacing.sm },
  reason: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  reasonIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonCopy: { flex: 1, gap: 2 },
  errorBox: { borderWidth: 1, borderRadius: radius.sm, padding: spacing.md },
});
