import { router } from 'expo-router';
import { ClipboardList, MapPin, Megaphone, Search, ShieldCheck } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SectionList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { PendingReports } from '@/components/PendingReports';
import { usePreferences } from '@/lib/preferences';
import { ReportCard } from '@/components/ReportCard';
import {
  AppText,
  Chip,
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
import { spacing, useTheme } from '@/theme';
import type { CommunityReport, ReportFilters } from '@/types';

const ALL = 'all';

export function ReportFeed({ section = 'community', panel }: {
  section?: 'community' | 'mine' | 'updates';
  panel?: string;
}) {
  const { t } = usePreferences();
  const theme = useTheme();
  const { firebaseReady, user } = useAuth();
  const uid = user?.uid;

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

  const visibleReports = useMemo(() => {
    if (section === 'mine') return reports.filter((report) => uid && report.authorUid === uid);
    if (section === 'updates') {
      return reports.filter((report) =>
        report.status === 'in_progress' || report.status === 'resolved' || Boolean(report.officialNotes?.trim())
      );
    }
    return filterReports(reports, filters);
  }, [reports, filters, section, uid]);

  const barangaySections = useMemo(() => {
    const groups = new Map<string, CommunityReport[]>();
    for (const report of visibleReports) {
      const group = groups.get(report.barangay);
      if (group) group.push(report);
      else groups.set(report.barangay, [report]);
    }

    return Array.from(groups, ([barangay, data]) => ({ key: barangay, barangay, data }))
      .sort((a, b) => a.barangay.localeCompare(b.barangay));
  }, [visibleReports]);

  const heading = section === 'mine' ? t('My Reports') : section === 'updates'
    ? t('Municipal updates') : t('Community reports');

  const handleUpvote = useCallback(
    async (reportId: string) => {
      const id = voterId ?? (await getOrCreateDeviceVoterId());
      setVoterId(id);
      setUpvotingId(reportId);
      try {
        await toggleReportUpvote(reportId, id);
      } catch (err) {
        Alert.alert(t('Upvote failed'), t(err instanceof Error ? err.message : 'Please try again.'));
      } finally {
        setUpvotingId(null);
      }
    },
    [voterId, t]
  );

  const openReport = useCallback((reportId: string) => {
    router.push({ pathname: '/report/[id]', params: { id: reportId } });
  }, []);

  const listEmpty = loading ? (
    <LoadingState />
  ) : !firebaseReady ? (
    <EmptyState
      icon={<ShieldCheck size={24} color={theme.colors.primary} />}
      title={t('Backend not configured')}
      message={t(BLOCKED_MESSAGES.notConfigured)}
    />
  ) : error ? (
    <EmptyState
      icon={<ShieldCheck size={24} color={theme.colors.danger} />}
      title={t('Reports unavailable')}
      message={t(error.message)}
      actionLabel={t('I will check my connection')}
      onAction={() => setError(null)}
    />
  ) : section === 'mine' ? (
    <EmptyState
      icon={<ClipboardList size={24} color={theme.colors.primary} />}
      title={t('You haven’t filed any reports yet')}
      message={t('Reports you file will appear here.')}
      actionLabel={t('File a report')}
      onAction={() => router.push('/submit')}
    />
  ) : section === 'updates' ? (
    <EmptyState
      icon={<Megaphone size={24} color={theme.colors.primary} />}
      title={t('No municipal updates yet')}
      message={t('Reports with official notes or progress will appear here.')}
    />
  ) : reports.length === 0 ? (
    <EmptyState
      icon={<ShieldCheck size={24} color={theme.colors.primary} />}
      title={t('No community reports yet')}
      message={t('Be the first resident to log a concern for Paete municipal action.')}
      actionLabel={t('File the first report')}
      onAction={() => router.push('/submit')}
    />
  ) : (
    <EmptyState
      icon={<Search size={24} color={theme.colors.primary} />}
      title={t('No reports match these filters')}
      message={t('Try a different barangay, category, or search term.')}
      actionLabel={t('Reset filters')}
      onAction={() =>
        setFilters({ barangay: ALL, category: ALL, status: ALL, search: '' })
      }
    />
  );

  return (
    <View style={styles.screen}>
      <FeedHeader
        heading={heading}
        panel={panel}
        filters={filters}
        onChangeFilters={setFilters}
        total={visibleReports.length}
      />
      <SectionList
        sections={barangaySections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: group }) => (
          <View accessibilityRole="header" style={styles.barangayHeading}>
            <MapPin size={16} color={theme.colors.primary} />
            <AppText variant="heading">{t(group.barangay)}</AppText>
          </View>
        )}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.column, styles.listContent]}
        ListHeaderComponent={section === 'mine' ? PendingReports : undefined}
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
        SectionSeparatorComponent={() => <View style={styles.sectionSpacer} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

function FeedHeader({
  heading,
  panel,
  filters,
  onChangeFilters,
  total,
}: {
  heading: string;
  panel?: string;
  filters: ReportFilters;
  onChangeFilters: (next: ReportFilters) => void;
  total: number;
}) {
  const { t } = usePreferences();
  const theme = useTheme();

  return (
    <View style={[styles.column, styles.header]}>
      <View style={styles.countRow}>
        <View accessibilityRole="header">
          <AppText variant="heading">{heading}</AppText>
        </View>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {t(total === 1 ? '{count} report' : '{count} reports', { count: total })}
        </AppText>
      </View>
      {panel === 'search' ? (
        <Field
          label={t('Search')}
          accessibilityLabel={t('Search reports')}
          autoFocus
          placeholder={t('Search reports, barangays, or concerns')}
          value={filters.search ?? ''}
          onChangeText={(search) => onChangeFilters({ ...filters, search })}
          returnKeyType="search"
          autoCorrect={false}
        />
      ) : null}
      {panel === 'filters' ? (
        <View style={styles.filters}>
          <ChipRow
            label={t('Barangay')}
            options={[
              { value: ALL, label: t('All Barangays') },
              ...PAETE_BARANGAYS.map((barangay) => ({ value: barangay, label: barangay })),
            ]}
            selected={filters.barangay ?? ALL}
            onSelect={(barangay) => onChangeFilters({ ...filters, barangay })}
          />

          <ChipRow
            label={t('Category')}
            options={[
              { value: ALL, label: t('All Categories') },
              ...CATEGORY_ORDER.map((category) => ({
                value: category,
                label: t(CATEGORIES[category].short),
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
            label={t('Status')}
            options={[
              { value: ALL, label: t('All Statuses') },
              ...STATUS_ORDER.map((status) => ({
                value: status,
                label: t(STATUS_META[status].short),
              })),
            ]}
            selected={filters.status ?? ALL}
            onSelect={(status) =>
              onChangeFilters({ ...filters, status: status as ReportFilters['status'] })
            }
          />
        </View>
      ) : null}
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
  screen: { flex: 1 },
  column: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
  },
  listContent: { flexGrow: 1, paddingBottom: spacing.xl },
  barangayHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md },
  sectionSpacer: { height: spacing.sm },
  separator: { height: spacing.md },
  header: { gap: spacing.md, paddingVertical: spacing.md },
  filters: { gap: spacing.md },
  chipGroup: { gap: spacing.xs },
  chipGroupLabel: { textTransform: 'uppercase' },
  chipRow: { gap: spacing.sm },
  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
});
