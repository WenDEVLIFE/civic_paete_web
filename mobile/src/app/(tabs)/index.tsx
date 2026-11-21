import { router } from 'expo-router';
import { Plus, Search, ShieldCheck } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReportCard } from '@/components/ReportCard';
import {
  AppText,
  Chip,
  CivicPattern,
  EmptyState,
  Field,
  LoadingState,
  Reveal,
} from '@/components/ui';
import {
  BLOCKED_MESSAGES,
  CATEGORIES,
  CATEGORY_ORDER,
  PAETE_BARANGAYS,
  STATUS_META,
  STATUS_ORDER,
} from '@/constants';
import { useAuth } from '@/lib/auth';
import {
  filterReports,
  getOrCreateDeviceVoterId,
  subscribeToReports,
  toggleReportUpvote,
} from '@/services/reportService';
import { radius, spacing, useTheme } from '@/theme';
import type { CommunityReport, ReportFilters } from '@/types';

const ALL = 'all';

export default function FeedScreen() {
  const theme = useTheme();
  const { firebaseReady } = useAuth();

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    barangay: ALL,
    category: ALL,
    status: ALL,
    search: '',
  });

  useEffect(() => {
    getOrCreateDeviceVoterId()
      .then(setVoterId)
      .catch((err) => console.warn('Could not persist the device voter id:', err));
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    setLoading(true);
    return subscribeToReports(
      {},
      (next) => {
        setReports(next);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  }, [firebaseReady]);

  const visibleReports = useMemo(() => filterReports(reports, filters), [reports, filters]);

  const handleUpvote = useCallback(
    async (reportId: string) => {
      const id = voterId ?? (await getOrCreateDeviceVoterId());
      setVoterId(id);
      setUpvotingId(reportId);
      try {
        await toggleReportUpvote(reportId, id);
      } catch (err) {
        Alert.alert('Upvote failed', err instanceof Error ? err.message : 'Please try again.');
      } finally {
        setUpvotingId(null);
      }
    },
    [voterId]
  );

  const openReport = useCallback((reportId: string) => {
    router.push({ pathname: '/report/[id]', params: { id: reportId } });
  }, []);

  const listEmpty = loading ? (
    <LoadingState />
  ) : !firebaseReady ? (
    <EmptyState
      icon={<ShieldCheck size={24} color={theme.colors.primary} />}
      title="Backend not configured"
      message={BLOCKED_MESSAGES.notConfigured}
    />
  ) : error ? (
    <EmptyState
      icon={<ShieldCheck size={24} color={theme.colors.danger} />}
      title="Community feed unavailable"
      message={error.message}
      actionLabel="I will check my connection"
      onAction={() => setError(null)}
    />
  ) : reports.length === 0 ? (
    <EmptyState
      icon={<ShieldCheck size={24} color={theme.colors.primary} />}
      title="No community reports yet"
      message="Be the first resident to log a concern for Paete municipal action."
      actionLabel="File the first report"
      onAction={() => router.push('/submit')}
    />
  ) : (
    <EmptyState
      icon={<Search size={24} color={theme.colors.primary} />}
      title="No reports match these filters"
      message="Try a different barangay, category, or search term."
      actionLabel="Reset filters"
      onAction={() =>
        setFilters({ barangay: ALL, category: ALL, status: ALL, search: '' })
      }
    />
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.canvas }]}>
      <CivicPattern />
      <FlatList
        data={visibleReports}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <FeedHeader
            filters={filters}
            onChangeFilters={setFilters}
            total={visibleReports.length}
          />
        }
        ListEmptyComponent={listEmpty}
        renderItem={({ item, index }) => (
          <Reveal index={index}>
            <ReportCard
              report={item}
              onPress={() => openReport(item.id)}
              onUpvote={() => handleUpvote(item.id)}
              upvoting={upvotingId === item.id}
            />
          </Reveal>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="File a community report"
        onPress={() => router.push('/submit')}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: pressed ? theme.colors.primaryPressed : theme.colors.primary,
            shadowColor: theme.colors.primary,
          },
        ]}
      >
        <Plus size={18} color={theme.colors.onPrimary} strokeWidth={2.6} />
        <AppText variant="bodyBold" color={theme.colors.onPrimary}>
          File a report
        </AppText>
      </Pressable>
    </SafeAreaView>
  );
}

function FeedHeader({
  filters,
  onChangeFilters,
  total,
}: {
  filters: ReportFilters;
  onChangeFilters: (next: ReportFilters) => void;
  total: number;
}) {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View
          style={[
            styles.brandMark,
            { backgroundColor: theme.colors.navy, borderColor: theme.colors.borderStrong },
          ]}
        >
          <ShieldCheck size={16} color={theme.colors.wave} strokeWidth={2.4} />
        </View>
        <View style={styles.brandCopy}>
          <AppText variant="label" color={theme.colors.wave} style={styles.brandName}>
            Civic Paete
          </AppText>
          <AppText variant="caption" color={theme.colors.textSubtle}>
            Community Reporting · Paete, Laguna
          </AppText>
        </View>
      </View>

      <View style={styles.headline}>
        <AppText variant="title">Community concerns</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          Every report is triaged with the barangay and the Paete Municipal Hall. Verified
          residents can post; everyone can follow progress.
        </AppText>
      </View>

      <Field
        label="Search"
        placeholder="Search reports, barangays, or concerns"
        value={filters.search ?? ''}
        onChangeText={(search) => onChangeFilters({ ...filters, search })}
        returnKeyType="search"
        autoCorrect={false}
      />

      <ChipRow
        label="Barangay"
        options={[
          { value: ALL, label: 'All Barangays' },
          ...PAETE_BARANGAYS.map((barangay) => ({ value: barangay, label: barangay })),
        ]}
        selected={filters.barangay ?? ALL}
        onSelect={(barangay) => onChangeFilters({ ...filters, barangay })}
      />

      <ChipRow
        label="Category"
        options={[
          { value: ALL, label: 'All Categories' },
          ...CATEGORY_ORDER.map((category) => ({
            value: category,
            label: CATEGORIES[category].short,
          })),
        ]}
        selected={filters.category ?? ALL}
        onSelect={(category) =>
          onChangeFilters({
            ...filters,
            category: category as ReportFilters['category'],
          })
        }
      />

      <ChipRow
        label="Status"
        options={[
          { value: ALL, label: 'All Statuses' },
          ...STATUS_ORDER.map((status) => ({
            value: status,
            label: STATUS_META[status].short,
          })),
        ]}
        selected={filters.status ?? ALL}
        onSelect={(status) =>
          onChangeFilters({ ...filters, status: status as ReportFilters['status'] })
        }
      />

      <View style={styles.countRow}>
        <AppText variant="label" color={theme.colors.textSubtle}>
          {`${total} ${total === 1 ? 'report' : 'reports'}`}
        </AppText>
        <View style={[styles.liveDot, { backgroundColor: theme.colors.status.resolved.fg }]} />
      </View>
    </View>
  );
}

function ChipRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.chipGroup}>
      <AppText variant="label" color={theme.colors.textSubtle} style={styles.chipGroupLabel}>
        {label}
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        keyboardShouldPersistTaps="handled"
      >
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            active={selected === option.value}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 132,
    flexGrow: 1,
  },
  separator: { height: spacing.md },
  header: { gap: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCopy: { gap: 1 },
  brandName: { textTransform: 'uppercase', letterSpacing: 2.2 },
  headline: { gap: spacing.xs },
  chipGroup: { gap: spacing.xs },
  chipGroupLabel: { textTransform: 'uppercase' },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    borderRadius: radius.pill,
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
