import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  ThumbsUp,
  UserRound,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePreferences } from '@/lib/preferences';
import { CategoryIcon } from '@/components/CategoryIcon';
import {
  AppText,
  Divider,
  EmptyState,
  LoadingState,
  PrimaryButton,
  StatusPill,
} from '@/components/ui';
import { CATEGORIES } from '@/constants';
import { displayNameFor, useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { useReportCommentPermission } from '@/lib/useReportCommentPermission';
import {
  addReportComment,
  getOrCreateDeviceVoterId,
  subscribeToReportById,
  subscribeToReportComments,
  subscribeToReportUpvoteStatus,
  toggleReportUpvote,
} from '@/services/reportService';
import { radius, spacing, useTheme } from '@/theme';
import type { DetailedReport, ReportComment } from '@/types';

export default function ReportDetailScreen() {
  const { t } = usePreferences();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { user } = useAuth();
  const canComment = useReportCommentPermission(user, db);

  const [report, setReport] = useState<DetailedReport | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [upvoting, setUpvoting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    return subscribeToReportById(
      id,
      (next) => {
        setReport(next);
        setLoaded(true);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoaded(true);
      }
    );
  }, [id]);

  useEffect(() => {
    if (!id) return;
    return subscribeToReportComments(id, setComments);
  }, [id]);

  useEffect(() => {
    getOrCreateDeviceVoterId().then(setVoterId).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!id || !voterId) return;
    return subscribeToReportUpvoteStatus(id, voterId, setHasUpvoted);
  }, [id, voterId]);

  const handleUpvote = async () => {
    if (!id) return;
    const voter = voterId ?? (await getOrCreateDeviceVoterId());
    setVoterId(voter);
    setUpvoting(true);
    try {
      await toggleReportUpvote(id, voter);
    } catch (err) {
      Alert.alert(t('Upvote failed'), t(err instanceof Error ? err.message : 'Please try again.'));
    } finally {
      setUpvoting(false);
    }
  };

  const handleComment = async () => {
    if (!id || !user || !canComment || postingComment || !commentText.trim()) return;

    setPostingComment(true);
    try {
      await addReportComment(id, {
        content: commentText,
        authorName: displayNameFor(user),
        authorAvatar: user.photoURL ?? undefined,
        authorRole: 'official',
        isOfficial: true,
        authorUid: user.uid,
      });
      setCommentText('');
    } catch (err) {
      Alert.alert(
        t('Comment not posted'),
        t(err instanceof Error ? err.message : 'Please try again.')
      );
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.canvas }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('Go back')}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: pressed ? theme.colors.surfaceAlt : theme.colors.surface,
              },
            ]}
          >
            <ArrowLeft size={18} color={theme.colors.text} />
          </Pressable>
          <AppText variant="label" color={theme.colors.textSubtle} style={styles.topBarLabel}>
            {t('Report detail')}
          </AppText>
        </View>

        {!loaded ? (
          <LoadingState label={t('Loading report…')} />
        ) : error || !report ? (
          <EmptyState
            icon={<ShieldCheck size={24} color={theme.colors.danger} />}
            title={t('Report unavailable')}
            message={t(error?.message ?? 'This report may have been removed by the municipality.')}
            actionLabel={t('Back to community')}
            onAction={() => router.replace('/')}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {report.imageUrl ? (
              <Image
                source={{ uri: report.imageUrl }}
                style={styles.hero}
                contentFit="cover"
                transition={200}
                alt={t('Photo evidence for {title}', { title: report.title })}
                accessibilityLabel={t('Photo evidence for {title}', { title: report.title })}
              />
            ) : null}

            <View style={styles.metaRow}>
              <StatusPill status={report.status} />
              <View style={[styles.categoryBadge, { borderColor: theme.colors.border }]}>
                <CategoryIcon category={report.category} size={13} color={theme.colors.primary} />
                <AppText variant="label" color={theme.colors.primary} style={styles.categoryLabel}>
                  {t(CATEGORIES[report.category].short)}
                </AppText>
              </View>
              <View style={styles.flexSpacer} />
              <AppText variant="caption" color={theme.colors.textSubtle}>
                {report.date}
              </AppText>
            </View>

            <AppText variant="title">{report.title}</AppText>

            <View style={styles.submittedRow}>
              <UserRound size={14} color={theme.colors.textSubtle} />
              <AppText variant="caption" color={theme.colors.textMuted}>
                {report.isAnonymous
                  ? report.anonymousAlias || t('Protected Citizen')
                  : report.authorName || report.authorRealName || t('Paete Resident')}
              </AppText>
              {report.isAnonymous ? (
                <View style={[styles.anonTag, { borderColor: theme.colors.border }]}>
                  <AppText variant="label" color={theme.colors.textSubtle} style={styles.anonTagText}>
                    {t('Anonymous')}
                  </AppText>
                </View>
              ) : null}
            </View>

            <AppText variant="body">{report.description}</AppText>

            <View
              style={[
                styles.locationCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <MapPin size={16} color={theme.colors.primary} />
              <View style={styles.flex}>
                <AppText variant="bodyBold">{`Barangay ${report.barangay}`}</AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {report.locationDetails || t('Location detail not provided')}
                </AppText>
              </View>
            </View>

            {report.officialNotes ? (
              <View
                style={[
                  styles.officialCard,
                  { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
                ]}
              >
                <AppText variant="label" color={theme.colors.primary}>
                  {t('Municipal update')}
                </AppText>
                <AppText variant="body" color={theme.colors.textMuted}>
                  {report.officialNotes}
                </AppText>
                {report.officialActorName ? (
                  <AppText variant="caption" color={theme.colors.textSubtle}>
                    {`${report.officialActorName}${report.officialActorRole ? ` · ${report.officialActorRole}` : ''}`}
                  </AppText>
                ) : null}
              </View>
            ) : null}

            {report.timeline && report.timeline.length > 0 ? (
              <View style={styles.section}>
                <AppText variant="heading">{t('Status timeline')}</AppText>
                <View style={styles.timeline}>
                  {report.timeline.map((event, index) => {
                    const Icon =
                      event.status === 'completed'
                        ? CheckCircle2
                        : event.status === 'current'
                          ? Clock
                          : Circle;
                    const color =
                      event.status === 'completed'
                        ? theme.colors.status.resolved.fg
                        : event.status === 'current'
                          ? theme.colors.status.in_progress.fg
                          : theme.colors.textSubtle;
                    return (
                      <View key={`${event.title}-${index}`} style={styles.timelineRow}>
                        <View style={styles.timelineGutter}>
                          <Icon size={16} color={color} />
                          {index < report.timeline!.length - 1 ? (
                            <View
                              style={[styles.timelineLine, { backgroundColor: theme.colors.border }]}
                            />
                          ) : null}
                        </View>
                        <View style={styles.timelineCopy}>
                          <AppText variant="bodyBold">{event.title}</AppText>
                          <AppText variant="caption" color={theme.colors.textSubtle}>
                            {`${event.departmentOrActor} · ${event.timestamp}`}
                          </AppText>
                          {event.notes ? (
                            <AppText variant="caption" color={theme.colors.textMuted}>
                              {event.notes}
                            </AppText>
                          ) : null}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: hasUpvoted, busy: upvoting }}
              onPress={handleUpvote}
              disabled={upvoting}
              style={({ pressed }) => [
                styles.upvoteButton,
                {
                  borderColor: hasUpvoted ? theme.colors.primary : theme.colors.border,
                  backgroundColor: hasUpvoted
                    ? theme.colors.glow
                    : pressed
                      ? theme.colors.surfaceAlt
                      : theme.colors.surface,
                },
              ]}
            >
              <ThumbsUp
                size={17}
                color={theme.colors.primary}
                fill={hasUpvoted ? theme.colors.primary : 'transparent'}
              />
              <AppText variant="bodyBold" color={theme.colors.primary}>
                {`${hasUpvoted ? t('Liked') : t('Like')} · ${report.upvotes}`}
              </AppText>
            </Pressable>

            <Divider />

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <MessageSquare size={16} color={theme.colors.textMuted} />
                <AppText variant="heading">{t('Community thread ({count})', { count: comments.length })}</AppText>
              </View>

              {comments.length === 0 ? (
                <AppText variant="caption" color={theme.colors.textSubtle}>
                  {t('No comments yet.')}
                </AppText>
              ) : (
                <View style={styles.comments}>
                  {comments.map((comment) => (
                    <View
                      key={comment.id}
                      style={[
                        styles.comment,
                        {
                          backgroundColor: theme.colors.surface,
                          borderColor: comment.isOfficial
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                    >
                      <View style={styles.commentHead}>
                        <AppText variant="bodyBold">{comment.authorName}</AppText>
                        {comment.isOfficial ? (
                          <View
                            style={[styles.officialTag, { backgroundColor: theme.colors.glow }]}
                          >
                            <ShieldCheck size={11} color={theme.colors.primary} />
                            <AppText variant="label" color={theme.colors.primary} style={styles.officialTagText}>
                              {t('Official')}
                            </AppText>
                          </View>
                        ) : null}
                        <View style={styles.flexSpacer} />
                        <AppText variant="caption" color={theme.colors.textSubtle}>
                          {t(comment.timestamp)}
                        </AppText>
                      </View>
                      <AppText variant="body" color={theme.colors.textMuted}>
                        {comment.content}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {canComment ? (
                <View
                  style={[
                    styles.composer,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <TextInput
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder={t('Write an official comment…')}
                    placeholderTextColor={theme.colors.textSubtle}
                    multiline
                    style={[styles.composerInput, { color: theme.colors.text }]}
                    accessibilityLabel={t('Write a comment')}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('Post comment')}
                    disabled={postingComment || !commentText.trim()}
                    onPress={handleComment}
                    style={({ pressed }) => [
                      styles.sendButton,
                      {
                        backgroundColor:
                          postingComment || !commentText.trim()
                            ? theme.colors.surfaceSunken
                            : pressed
                              ? theme.colors.primaryPressed
                              : theme.colors.primaryFill,
                      },
                    ]}
                  >
                    <Send size={16} color={theme.colors.onPrimary} />
                  </Pressable>
                </View>
              ) : null}
            </View>

            <PrimaryButton
              label={t('Back to community')}
              onPress={() => router.replace('/')}
              style={styles.bottomAction}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarLabel: { textTransform: 'uppercase' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.lg },
  hero: { width: '100%', height: 220, borderRadius: radius.lg },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  submittedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -spacing.sm },
  anonTag: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1 },
  anonTagText: { fontSize: 9 },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  officialCard: {
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  section: { gap: spacing.md },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  timeline: { gap: spacing.sm },
  timelineRow: { flexDirection: 'row', gap: spacing.md },
  timelineGutter: { alignItems: 'center', width: 20 },
  timelineLine: { width: 1.5, flex: 1, marginTop: 4 },
  timelineCopy: { flex: 1, gap: 2, paddingBottom: spacing.sm },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    minHeight: 50,
  },
  comments: { gap: spacing.sm },
  comment: { gap: spacing.xs, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  commentHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  officialTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  officialTagText: { fontSize: 9 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomAction: { marginTop: spacing.sm },
});
