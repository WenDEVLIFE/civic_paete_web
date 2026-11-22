import { CloudOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, SecondaryButton } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { usePreferences } from '@/lib/preferences';
import { flushOutbox, readOutbox, subscribeToOutbox } from '@/services/reportOutbox';
import { radius, spacing, useTheme } from '@/theme';

export function PendingReports() {
  const uid = useAuth().user?.uid;
  const { t } = usePreferences();
  const { colors } = useTheme();
  const [items, setItems] = useState<Awaited<ReturnType<typeof readOutbox>>>([]);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!uid) return;
    let active = true;
    const refresh = () => {
      void readOutbox(uid).then((reports) => {
        if (active) setItems(reports);
      }).catch(console.warn);
    };
    const unsubscribe = subscribeToOutbox(refresh);
    refresh();
    return () => { active = false; unsubscribe(); };
  }, [uid]);

  if (!uid || !items.length) return null;

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.heading}>
        <CloudOff size={18} color={colors.primary} />
        <AppText variant="heading">{t('Pending submissions')}</AppText>
      </View>
      <AppText variant="caption" color={colors.textMuted}>{t('Saved on this device. Open the app while online to send queued reports.')}</AppText>
      {items.map(({ id, draft, needsAttention }) => (
        <View key={id} style={[styles.report, { borderColor: colors.border }]}>
          <AppText variant="bodyBold">{draft.title}</AppText>
          <AppText variant="caption" color={needsAttention ? colors.danger : colors.textMuted}>
            {t(needsAttention ? 'Submission failed. Try sending again.' : 'Pending submission')}
          </AppText>
        </View>
      ))}
      {items.some((item) => item.needsAttention) && (
        <SecondaryButton label={t('Retry submissions')} disabled={retrying} onPress={() => {
          setRetrying(true);
          void flushOutbox(uid, true).catch(console.warn).finally(() => setRetrying(false));
        }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: spacing.md, gap: spacing.sm, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  report: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.sm },
});
