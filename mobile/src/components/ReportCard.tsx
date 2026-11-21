import { Image } from 'expo-image';
import {
  CheckCircle2,
  Clock,
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
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open report: ${report.title}`}
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.body}>
          <View style={styles.byline}>
            <View style={[styles.categoryIcon, { backgroundColor: theme.colors.glow }]}>
              <CategoryIcon category={report.category} size={19} color={theme.colors.primary} />
            </View>
            <View style={styles.bylineCopy}>
              <AppText variant="subtitle" numberOfLines={1}>{authorLabel}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Brgy. {report.barangay} · {report.date}
              </AppText>
            </View>
            <StatusPill status={report.status} />
          </View>

          <AppText variant="label" color={theme.colors.primary}>{category.short}</AppText>
          <AppText variant="heading" numberOfLines={2}>{report.title}</AppText>
          <AppText variant="body" color={theme.colors.textMuted} numberOfLines={3}>
            {report.description}
          </AppText>
        </View>

        {report.imageUrl ? (
          <Image
            source={{ uri: report.imageUrl }}
            style={[styles.image, { backgroundColor: theme.colors.surfaceAlt }]}
            contentFit="cover"
            transition={180}
            alt={`Photo evidence for ${report.title}`}
          />
        ) : null}
      </Pressable>

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

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Upvote ${report.title}, ${report.upvotes} votes`}
          accessibilityState={{ busy: upvoting, disabled: upvoting || !onUpvote }}
          disabled={upvoting || !onUpvote}
          onPress={onUpvote}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <ThumbsUp size={17} color={theme.colors.primary} />
          <AppText variant="caption" color={theme.colors.primary}>
            {report.upvotes} {report.upvotes === 1 ? 'upvote' : 'upvotes'}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open thread for ${report.title}`}
          onPress={onPress}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <MessageSquare size={17} color={theme.colors.textMuted} />
          <AppText variant="caption" color={theme.colors.textMuted}>Open thread</AppText>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.xs },
  byline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bylineCopy: { flex: 1, minWidth: 96 },
  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', aspectRatio: 4 / 3 },
  officialNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm,
    margin: spacing.md,
  },
  officialNoteText: { flex: 1 },
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
  },
  pressed: { opacity: 0.7 },
});
