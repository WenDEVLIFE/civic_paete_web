import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { randomUUID } from 'expo-crypto';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { auth } from '@/lib/firebase';
import { createReport } from '@/services/reportService';
import type { CreateReportInput } from '@/types';

type Draft = CreateReportInput & { authorUid: string; imageUri: string };
type PendingReport = { id: string; draft: Draft; needsAttention?: boolean };

const prefix = (uid: string) => `civic-paete.outbox.${uid}.`;
const keyFor = (uid: string, id: string) => prefix(uid) + id;
const listeners = new Set<() => void>();
const active = new Map<string, Promise<void>>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToOutbox(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export async function readOutbox(uid: string): Promise<PendingReport[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter((key) => key.startsWith(prefix(uid)));
  if (!keys.length) return [];
  return (await AsyncStorage.multiGet(keys)).flatMap(([, value]) =>
    value ? [JSON.parse(value) as PendingReport] : []
  );
}

export async function queueReport(draft: Draft): Promise<string | null> {
  const id = randomUUID();
  if (Platform.OS === 'web') return createReport(draft, id);
  const directory = new Directory(Paths.document, 'report-outbox');
  directory.create({ idempotent: true });
  const original = new File(draft.imageUri);
  const extension = /^\.[a-z0-9]{1,8}$/i.test(original.extension) ? original.extension : '';
  const photo = new File(directory, `${id}${extension}`);

  try {
    await original.copy(photo);
    await AsyncStorage.setItem(keyFor(draft.authorUid, id), JSON.stringify({
      id,
      draft: { ...draft, imageUri: photo.uri },
    } satisfies PendingReport));
  } catch (error) {
    if (photo.exists) photo.delete();
    throw error;
  }
  notify();
  return null;
}

export async function flushOutbox(uid: string, retryFailed = false): Promise<void> {
  const current = active.get(uid);
  if (current) return retryFailed ? current.then(() => flushOutbox(uid, true)) : current;
  const work = (async () => {
    const network = await NetInfo.fetch();
    if (network.isConnected !== true || network.isInternetReachable === false) return;

    for (const pending of await readOutbox(uid)) {
      if (auth?.currentUser?.uid !== uid) return;
      if (pending.needsAttention && !retryFailed) continue;
      const key = keyFor(uid, pending.id);
      try {
        await createReport(pending.draft, pending.id);
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === 'unavailable' || code === 'deadline-exceeded' || code === 'storage/retry-limit-exceeded') {
          continue;
        }
        const latestNetwork = await NetInfo.fetch();
        if (latestNetwork.isConnected === false || latestNetwork.isInternetReachable === false) return;
        await AsyncStorage.setItem(key, JSON.stringify({ ...pending, needsAttention: true }));
        notify();
        continue;
      }
      await AsyncStorage.removeItem(key);
      try {
        const photo = new File(pending.draft.imageUri);
        if (photo.exists) photo.delete();
      } catch (error) {
        console.warn('Could not remove submitted report photo from device:', error);
      }
      notify();
    }
  })().finally(() => active.delete(uid));
  active.set(uid, work);
  return work;
}
