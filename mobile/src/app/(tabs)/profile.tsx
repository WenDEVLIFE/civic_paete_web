import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronDown, ChevronRight, Languages, LogOut, Monitor, ShieldCheck, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Chip } from '@/components/ui';
import { VERIFICATION_LABELS } from '@/constants';
import { displayNameFor, useAuth } from '@/lib/auth';
import { usePreferences } from '@/lib/preferences';
import { radius, spacing, useTheme } from '@/theme';

const appearanceLabels = { system: 'System', light: 'Light', dark: 'Dark' } as const;
const appearanceOptions = ['system', 'light', 'dark'] as const;

export default function ProfileScreen() {
  const { appearance, setAppearance, language, setLanguage, t } = usePreferences();
  const { colors } = useTheme();
  const { user, loading, verificationStatus, isVerifiedResident, signOut } = useAuth();
  const [openSetting, setOpenSetting] = useState<'appearance' | 'language' | null>(null);

  const canVerify = !isVerifiedResident && verificationStatus !== 'pending';
  const verificationColor = isVerifiedResident
    ? colors.status.resolved.fg
    : verificationStatus === 'pending'
      ? colors.status.pending.fg
      : verificationStatus === 'rejected' ? colors.status.urgent.fg : colors.textMuted;

  return (
    <ScrollView style={{ backgroundColor: colors.surface }} contentContainerStyle={styles.container}>
      {loading ? (
        <AppText color={colors.textMuted}>{t('Checking your session…')}</AppText>
      ) : user ? (
        <>
          <View style={styles.identity}>
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
                contentFit="cover"
                transition={150}
                alt={t('Profile photo')}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.surfaceAlt }]}>
                <UserRound size={32} color={colors.textMuted} />
              </View>
            )}
            <View style={styles.identityCopy}>
              <AppText variant="title">{displayNameFor(user)}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {user.email ?? t('No email on file')}
              </AppText>
            </View>
          </View>

          <View style={[styles.group, { borderColor: colors.border }]}>
            <AccountRow
              icon={ShieldCheck}
              label={t(canVerify ? 'Verify residency' : 'Barangay residency verification')}
              detail={t(VERIFICATION_LABELS[verificationStatus])}
              detailColor={verificationColor}
              onPress={canVerify ? () => router.push('/verification') : undefined}
            />
          </View>

          <View style={[styles.group, { borderColor: colors.border }]}>
            <AccountRow
              icon={Languages}
              label={t('App language')}
              detail={language === 'fil' ? 'Filipino' : 'English'}
              expanded={openSetting === 'language'}
              onPress={() => setOpenSetting(openSetting === 'language' ? null : 'language')}
            />
            {openSetting === 'language' && (
              <View style={styles.options}>
                <Chip label="English" active={language === 'en'} onPress={() => setLanguage('en')} />
                <Chip label="Filipino" active={language === 'fil'} onPress={() => setLanguage('fil')} />
              </View>
            )}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <AccountRow
              icon={Monitor}
              label={t('Appearance')}
              detail={t(appearanceLabels[appearance])}
              expanded={openSetting === 'appearance'}
              onPress={() => setOpenSetting(openSetting === 'appearance' ? null : 'appearance')}
            />
            {openSetting === 'appearance' && (
              <View style={styles.options}>
                {appearanceOptions.map((value) => (
                  <Chip
                    key={value}
                    label={t(appearanceLabels[value])}
                    active={appearance === value}
                    onPress={() => setAppearance(value)}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={[styles.group, { borderColor: colors.border }]}>
            <AccountRow icon={LogOut} label={t('Sign out')} danger onPress={() => void signOut()} />
          </View>
        </>
      ) : null}
      <AppText variant="caption" color={colors.textSubtle} style={styles.version}>
        Civic Paete · v{Constants.expoConfig?.version ?? '0.1.0'}
      </AppText>
    </ScrollView>
  );
}

function AccountRow({ icon: Icon, label, detail, detailColor, expanded, danger = false, onPress }: {
  icon: typeof ShieldCheck;
  label: string;
  detail?: string;
  detailColor?: string;
  expanded?: boolean;
  danger?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const Arrow = expanded === undefined ? ChevronRight : ChevronDown;
  const content = (
    <>
      <Icon size={19} color={danger ? colors.danger : colors.textMuted} />
      <View style={styles.rowCopy}>
        <AppText variant="bodyMedium" color={danger ? colors.danger : colors.text}>{label}</AppText>
        {detail ? <AppText variant="caption" color={detailColor ?? colors.textMuted}>{detail}</AppText> : null}
      </View>
      {onPress && !danger ? (
        <Arrow size={16} color={colors.textSubtle} style={expanded ? styles.expanded : undefined} />
      ) : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={expanded === undefined ? undefined : { expanded }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceAlt }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  avatar: { width: 76, height: 76, borderRadius: radius.pill },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  identityCopy: { flex: 1, gap: spacing.xs },
  group: { borderTopWidth: StyleSheet.hairlineWidth },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
  },
  rowCopy: { flex: 1, gap: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 35 },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingLeft: 35,
    paddingBottom: spacing.md,
  },
  expanded: { transform: [{ rotate: '180deg' }] },
  version: { textAlign: 'center', marginTop: spacing.xxl },
});
