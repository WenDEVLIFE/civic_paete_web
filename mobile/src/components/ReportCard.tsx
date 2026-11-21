import { Image } from 'expo-image';
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Shield,
  ThumbsUp,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { AppText, Card, StatusPill } from '@/components/ui';
import { CATEGORIES } from '@/constants';
import { radius, spacing, useTheme } from '@/theme';
import type { CommunityReport } from '@/types';

function PipelineGlyph({
  status,
  color,
}: {
  status: CommunityReport['status'];
  color: string;
}) {
  if (status === 'resolved') return <CheckCircle2 size={13} color={color} />;
  if (status === 'in_progress') return <Clock size={13} color={color} />;
  return <Shield size={13} color={color} />;
}

export function ReportCard({
  report,
  onPress,
  onUpvote,
  upvoting = false,
}: {
  report: CommunityReport;
  onPress: () => void;
  onUpvote?: () => void;
  upvoting?: boolean;
}) {
  const theme = useTheme();
  const category = CATEGORIES[report.category];
  const authorLabel = report.isAnonymous
    ? report.anonymousAlias || 'Protected Citizen'
    : report.authorName || 'Paete Resident';

  return (
    <Card onPress={onPress} accessibilityLabel={`Open report: ${report.title}`}>
      {report.imageUrl ? (
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: report.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={180}
            alt={`Photo evidence for ${report.title}`}
            accessibilityLabel={`Photo evidence for ${report.title}`}
          />
          <View style={styles.imagePill}>
            <StatusPill status={report.status} />
          </View>
        </View>
      ) : null}

      <View style={styles.body}>
        <View style={styles.categoryRow}>
          <View style={[styles.categoryBadge, { borderColor: theme.colors.border }]}>
            <CategoryIcon category={report.category} size={13} color={theme.colors.primary} />
            <AppText variant="label" color={theme.colors.primary} style={styles.categoryLabel}>
              {category.short}
            </AppText>
          </View>
          {!report.imageUrl ? <StatusPill status={report.status} /> : null}
          <View style={styles.flexSpacer} />
          <AppText variant="caption" color={theme.colors.textSubtle}>
            {report.date}
          </AppText>
        </View>

        <AppText variant="heading" numberOfLines={2}>
          {report.title}
        </AppText>

        <AppText variant="body" color={theme.colors.textMuted} numberOfLines={2}>
          {report.description}
        </AppText>

        {report.officialNotes ? (
          <View
            style={[
              styles.officialNote,
              { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
            ]}
          >
            <PipelineGlyph status={report.status} color={theme.colors.primary} />
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.officialNoteText}>
              {report.officialNotes}
            </AppText>
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <MapPin size={13} color={theme.colors.textSubtle} />
          <AppText variant="caption" color={theme.colors.textMuted}>
            Brgy. {report.barangay}
          </AppText>
          <View style={[styles.metaDot, { backgroundColor: theme.colors.borderStrong }]} />
          <AppText variant="caption" color={theme.colors.textSubtle} numberOfLines={1} style={styles.author}>
            {authorLabel}
          </AppText>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Upvote ${report.title}`}
            accessibilityState={{ busy: upvoting }}
            disabled={upvoting || !onUpvote}
            onPress={onUpvote}
            style={({ pressed }) => [
              styles.action,
              { borderColor: theme.colors.border, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThumbsUp size={14} color={theme.colors.primary} />
            <AppText variant="bodyBold" color={theme.colors.primary} style={styles.actionLabel}>
              {report.upvotes}
            </AppText>
          </Pressable>

          {report.imageUrl ? <StatusPill status={report.status} /> : <View />}

          <View style={styles.flexSpacer} />

          <View style={styles.actionGhost}>
            <MessageSquare size={14} color={theme.colors.textSubtle} />
            <AppText variant="caption" color={theme.colors.textSubtle}>
              Open thread
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 168, backgroundColor: '#0A1931' },
  imagePill: { position: 'absolute', top: spacing.md, left: spacing.md },
  body: { padding: spacing.lg, gap: spacing.sm },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryLabel: { fontSize: 9.5 },
  flexSpacer: { flex: 1 },
  officialNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  officialNoteText: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaDot: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 2 },
  author: { flex: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  actionLabel: { fontSize: 12.5 },
  actionGhost: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
