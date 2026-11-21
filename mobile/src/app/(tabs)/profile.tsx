import Constants from 'expo-constants';
import { Image } from 'expo-image';
import {
  BadgeCheck,
  ChevronRight,
  Info,
  LogOut,
  MailCheck,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Divider, SecondaryButton } from '@/components/ui';
import { VERIFICATION_LABELS, VERIFIED_STATUSES } from '@/constants';
import { displayNameFor, useAuth } from '@/lib/auth';
import { radius, spacing, useTheme } from '@/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, loading, verificationStatus, isVerifiedResident, signOut } = useAuth();

  const statusTone = isVerifiedResident
    ? theme.colors.status.resolved
    : verificationStatus === 'pending'
      ? theme.colors.status.pending
      : verificationStatus === 'rejected'
        ? theme.colors.status.urgent
        : { fg: theme.colors.textMuted, bg: theme.colors.surfaceAlt, border: theme.colors.border };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.canvas }]}>
      <View style={styles.content}>
        <AppText variant="label" color={theme.colors.textSubtle} style={styles.eyebrow}>
          Citizen account
        </AppText>

        {loading ? (
          <AppText variant="body" color={theme.colors.textMuted}>
            Checking your session…
          </AppText>
        ) : user ? (
          <>
            <Card style={styles.identityCard}>
              <View style={styles.identityRow}>
                {user.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatar}
                    contentFit="cover"
                    transition={150}
                    alt="Profile photo"
                    accessibilityLabel="Profile photo"
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      styles.avatarFallback,
                      { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
                    ]}
                  >
                    <UserRound size={26} color={theme.colors.textMuted} />
                  </View>
                )}
                <View style={styles.identityCopy}>
                  <AppText variant="heading" numberOfLines={1}>
                    {displayNameFor(user)}
                  </AppText>
                  <View style={styles.emailRow}>
                    <MailCheck size={13} color={theme.colors.textSubtle} />
                    <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
                      {user.email ?? 'No email on file'}
                    </AppText>
                  </View>
                </View>
              </View>

              <Divider />

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: statusTone.bg, borderColor: statusTone.border },
                  ]}
                >
                  <BadgeCheck size={12} color={statusTone.fg} />
                  <AppText variant="label" color={statusTone.fg} style={styles.statusLabel}>
                    {VERIFICATION_LABELS[verificationStatus]}
                  </AppText>
                </View>
              </View>

              <AppText variant="caption" color={theme.colors.textMuted}>
                {isVerifiedResident
                  ? 'You can file community reports for your barangay. Anonymous posts keep your name off the public feed.'
                  : 'Community reports open once your barangay residency is verified. Verification requests are completed on the Civic Paete web portal.'}
              </AppText>
            </Card>

            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <ShieldCheck size={16} color={theme.colors.primary} />
                <View style={styles.infoCopy}>
                  <AppText variant="bodyBold">Verified resident posting</AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    Reports are attributed to the account that filed them, even in anonymous mode.
                  </AppText>
                </View>
              </View>
              {VERIFIED_STATUSES.includes(verificationStatus) ? null : (
                <View style={styles.infoRow}>
                  <Info size={16} color={theme.colors.textSubtle} />
                  <View style={styles.infoCopy}>
                    <AppText variant="bodyBold">Verification is not editable here yet</AppText>
                    <AppText variant="caption" color={theme.colors.textMuted}>
                      Document upload and review live on the mobile roadmap; use the web portal for
                      now.
                    </AppText>
                  </View>
                </View>
              )}
            </Card>

            <SecondaryButton
              label="Sign out"
              onPress={() => void signOut()}
              icon={<LogOut size={16} color={theme.colors.text} />}
            />
          </>
        ) : null}

        <View style={styles.aboutRow}>
          <AppText variant="caption" color={theme.colors.textSubtle}>
            {`Civic Paete mobile · v${Constants.expoConfig?.version ?? '0.1.0'}`}
          </AppText>
          <ChevronRight size={14} color={theme.colors.textSubtle} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  content: { gap: spacing.lg },
  eyebrow: { textTransform: 'uppercase' },
  identityCard: { gap: spacing.md, padding: spacing.lg },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 56, height: 56, borderRadius: radius.md },
  avatarFallback: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  identityCopy: { flex: 1, gap: 2 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusRow: { flexDirection: 'row' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusLabel: { fontSize: 9.5 },
  infoCard: { gap: spacing.md, padding: spacing.lg },
  infoRow: { flexDirection: 'row', gap: spacing.md },
  infoCopy: { flex: 1, gap: 2 },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
