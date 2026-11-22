import { router } from 'expo-router';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { Bell, MessageCircle } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText, EmptyState, LoadingState } from '@/components/ui';
import { STATUS_META } from '@/constants';
import { useAuth } from '@/lib/auth';
import { requireDb } from '@/lib/firebase';
import { usePreferences } from '@/lib/preferences';
import { radius, spacing, useTheme } from '@/theme';
import type { ReportStatus } from '@/types';

type Update = {
  id: string;
  reportId?: string;
  reportTitle?: string;
  projectId?: string;
  kind?: 'comment' | 'status';
  status?: ReportStatus;
  actorName?: string;
  officerNotes?: string;
  title?: string;
  body?: string;
  read: boolean;
  date?: Date;
};

const projectStatusLabels: Record<string, string> = {
  ongoing: 'Project ongoing',
  completed: 'Project completed',
  planned: 'Project planned',
  bidding: 'Project in bidding',
};

type Project = { title: string; status: string };

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { language, t } = usePreferences();
  const uid = useAuth().user?.uid;
  const [updates, setUpdates] = useState<Update[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [projects, setProjects] = useState<Record<string, Project | undefined>>({});
  const projectIds = useMemo(() => [...new Set(updates?.flatMap((item) => item.projectId ? [item.projectId] : []))]
    .sort().join('\n'), [updates]);

  useEffect(() => {
    if (!uid) return;
    const inbox = query(collection(requireDb(), 'users', uid, 'notifications'), orderBy('createdAt', 'desc'));
    return onSnapshot(inbox, (snapshot) => {
      setUpdates(snapshot.docs.map((item) => ({
        ...(item.data() as Omit<Update, 'id'>),
        id: item.id,
        date: item.data().createdAt?.toDate?.(),
      })));
      setFailed(false);
    }, () => setFailed(true));
  }, [uid]);

  useEffect(() => {
    if (!projectIds) return;
    const subscriptions = projectIds.split('\n').map((id) => onSnapshot(
      doc(requireDb(), 'transparency_projects', id), (snapshot) => {
        const data = snapshot.data();
        setProjects((current) => ({ ...current, [id]: data ? { title: data.title, status: data.status } : undefined }));
      }, console.warn
    ));
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [projectIds]);

  function openUpdate(item: Update) {
    if (uid && !item.read) {
      void updateDoc(doc(requireDb(), 'users', uid, 'notifications', item.id), { read: true })
        .catch(console.warn);
    }
    if (item.reportId) router.push({ pathname: '/report/[id]', params: { id: item.reportId } });
  }

  return (
    <FlatList
      data={updates ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<AppText variant="title">{t('Notification history')}</AppText>}
      ListEmptyComponent={failed ? (
        <AppText color={colors.danger}>{t('Notifications unavailable')}</AppText>
      ) : updates === null ? (
        <LoadingState label={t('Loading notifications…')} />
      ) : (
        <EmptyState icon={<Bell color={colors.primary} />} title={t('No notifications yet')}
          message={t('Official responses and progress on your reports will appear here.')} />
      )}
      renderItem={({ item }) => {
        const Icon = item.kind === 'comment' ? MessageCircle : Bell;
        const project = item.projectId ? projects[item.projectId] : undefined;
        const status = item.status && STATUS_META[item.status]?.short;
        return (
          <Pressable accessibilityRole="button" onPress={() => openUpdate(item)}
            style={[styles.row, { backgroundColor: item.read ? colors.surface : colors.glow, borderColor: colors.border }]}>
            <View style={[styles.icon, { backgroundColor: colors.surfaceAlt }]}>
              <Icon size={20} color={colors.primary} />
            </View>
            <View style={styles.details}>
              <AppText variant="bodyBold">{item.title || t(item.kind === 'comment' ? 'Official response' : 'Report status updated')}</AppText>
              {item.reportTitle ? <AppText variant="caption">{item.reportTitle}</AppText> : null}
              {status ? <AppText variant="caption" color={colors.primary}>{t(status)}</AppText> : null}
              {project?.title ? (
                <View style={[styles.project, { borderColor: colors.border }]}>
                  <AppText variant="bodyBold">{project.title}</AppText>
                  {projectStatusLabels[project.status] && (
                    <AppText variant="caption" color={colors.primary}>{t(projectStatusLabels[project.status])}</AppText>
                  )}
                </View>
              ) : null}
              {item.actorName ? <AppText variant="caption" color={colors.textMuted}>{item.actorName}</AppText> : null}
              {item.officerNotes || item.body ? <AppText>{item.officerNotes || item.body}</AppText> : null}
              {item.date ? (
                <AppText variant="caption" color={colors.textMuted}>
                  {item.date.toLocaleString(language === 'fil' ? 'fil-PH' : 'en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
                </AppText>
              ) : null}
            </View>
            {!item.read && <View accessibilityLabel={t('Unread')} style={[styles.dot, { backgroundColor: colors.primary }]} />}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
  details: { flex: 1, gap: spacing.xs },
  project: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7 },
});
