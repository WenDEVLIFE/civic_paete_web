import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  BadgeCheck,
  ChevronRight,
  LogOut,
  MailCheck,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { usePreferences } from '@/lib/preferences';
import { LanguageOptions } from '@/components/LanguageOptions';
import { AppText, Card, Chip, Divider, PrimaryButton, SecondaryButton } from '@/components/ui';
import { VERIFICATION_LABELS } from '@/constants';
import { displayNameFor, useAuth } from '@/lib/auth';
import { radius, spacing, useTheme } from '@/theme';

export default function ProfileScreen() {
  const { appearance, setAppearance, t } = usePreferences();
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
    <ScrollView style={{ backgroundColor: theme.colors.canvas }} contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <AppText variant="label" color={theme.colors.textSubtle} style={styles.eyebrow}>
          {t('Citizen account')}
        </AppText>

        {loading ? (
          <AppText variant="body" color={theme.colors.textMuted}>
            {t('Checking your session…')}
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
                    alt={t('Profile photo')}
                    accessibilityLabel={t('Profile photo')}
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
                      {user.email ?? t('No email on file')}
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
                    {t(VERIFICATION_LABELS[verificationStatus])}
                  </AppText>
                </View>
              </View>

              <AppText variant="caption" color={theme.colors.textMuted}>
                {isVerifiedResident
                  ? t('You can file community reports for your barangay. Anonymous posts keep your name off the public feed.')
                  : verificationStatus === 'pending'
                    ? t('Your request is under review. Check back here for updates.')
                    : t('Verify your barangay residency to file community reports.')}
              </AppText>
            </Card>

            {!isVerifiedResident && verificationStatus !== 'pending' ? (
              <PrimaryButton
                label={verificationStatus === 'rejected' ? t('Submit a new verification request') : t('Verify residency')}
                onPress={() => router.push('/verification')}
              />
            ) : null}

            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <ShieldCheck size={16} color={theme.colors.primary} />
                <View style={styles.infoCopy}>
                  <AppText variant="bodyBold">{t('Verified resident posting')}</AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {t('Reports are attributed to the account that filed them, even in anonymous mode.')}
                  </AppText>
                </View>
              </View>
            </Card>

            <Card style={styles.preferencesCard}>
              <View style={styles.preferenceGroup}>
                <AppText variant="bodyBold">{t('Appearance')}</AppText>
                <View style={styles.preferenceOptions}>
                  <Chip label={t('System')} active={appearance === 'system'} onPress={() => setAppearance('system')} />
                  <Chip label={t('Light')} active={appearance === 'light'} onPress={() => setAppearance('light')} />
                  <Chip label={t('Dark')} active={appearance === 'dark'} onPress={() => setAppearance('dark')} />
                </View>
              </View>
              <Divider />
              <LanguageOptions />
            </Card>

            <SecondaryButton
              label={t('Sign out')}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
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
  preferencesCard: { gap: spacing.lg, padding: spacing.lg },
  preferenceGroup: { gap: spacing.sm },
  preferenceOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
