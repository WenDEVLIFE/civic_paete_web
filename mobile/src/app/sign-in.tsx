import { Image } from 'expo-image';
import { BadgeCheck, ShieldCheck, UserRoundCheck } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import civicLogo from '../../assets/images/logo.png';
import { AppText, PrimaryButton } from '@/components/ui';
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
  const { firebaseReady, googleReady, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in could not complete.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={civicLogo}
          alt="Civic Paete"
          contentFit="contain"
          style={styles.mark}
        />

        <AppText variant="title" style={styles.center}>
          Sign in to Civic Paete
        </AppText>
        <AppText variant="body" color={theme.colors.textMuted} style={styles.center}>
          Sign in with Google to connect your Paete residency verification to your reports and
          community replies.
        </AppText>
        <PrimaryButton
          label={signingIn ? 'Opening Google…' : 'Continue with Google'}
          loading={signingIn}
          disabled={!googleReady || !firebaseReady}
          onPress={handleSignIn}
        />

        {!googleReady || !firebaseReady ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: theme.colors.dangerSurface, borderColor: theme.colors.danger },
            ]}
          >
            <AppText variant="caption" color={theme.colors.danger}>
              {firebaseReady ? BLOCKED_MESSAGES.googleNotConfigured : BLOCKED_MESSAGES.notConfigured}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
    alignItems: 'stretch',
  },
  mark: {
    width: 144,
    height: 144,
    borderRadius: radius.lg,
    alignSelf: 'center',
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
