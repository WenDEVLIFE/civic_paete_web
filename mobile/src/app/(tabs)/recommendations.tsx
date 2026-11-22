import { collection, onSnapshot } from 'firebase/firestore';
import { Lightbulb, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText, EmptyState, LoadingState } from '@/components/ui';
import { requireDb } from '@/lib/firebase';
import { usePreferences } from '@/lib/preferences';
import { radius, spacing, useTheme } from '@/theme';

const priorities = ['High Priority', 'Moderate Priority', 'Advisory'];

type Recommendation = { id: string; action: string; trigger?: string; location?: string; barangay?: string; priority?: string };

export default function RecommendationsScreen() {
  const { colors } = useTheme();
  const { t } = usePreferences();
  const [items, setItems] = useState<Recommendation[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => onSnapshot(collection(requireDb(), 'insights'), (snapshot) => {
    const recommendations = snapshot.docs.map((item) => ({
      ...(item.data() as Omit<Recommendation, 'id'>), id: item.id,
    })).filter((item) => item.action);
    const rank = (priority?: string) => priorities.indexOf(priority ?? 'Advisory');
    setItems(recommendations.sort((a, b) => rank(a.priority) - rank(b.priority)));
    setFailed(false);
  }, () => setFailed(true)), []);

  return (
    <FlatList
      data={items ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<AppText variant="title">{t('Recommendations')}</AppText>}
      ListEmptyComponent={failed ? (
        <AppText color={colors.danger}>{t('Recommendations unavailable')}</AppText>
      ) : items === null ? (
        <LoadingState label={t('Loading recommendations…')} />
      ) : (
        <EmptyState icon={<Lightbulb color={colors.primary} />} title={t('No recommendations yet')}
          message={t('Municipal recommendations will appear here when available.')} />
      )}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.location}>
            <MapPin size={15} color={colors.primary} />
            <AppText variant="caption" color={colors.primary} style={styles.locationText}>{item.location || item.barangay || 'Paete'}</AppText>
          </View>
          <AppText variant="bodyBold">{item.action}</AppText>
          {item.trigger ? <AppText variant="caption" color={colors.textMuted}>{item.trigger}</AppText> : null}
          {item.priority ? <AppText variant="label" color={colors.primary}>{t(item.priority)}</AppText> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.sm },
  card: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  location: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  locationText: { flex: 1 },
});
