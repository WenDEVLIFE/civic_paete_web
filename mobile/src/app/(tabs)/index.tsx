import { useLocalSearchParams } from 'expo-router';

import { ReportFeed } from '@/components/ReportFeed';

export default function CommunityScreen() {
  const { panel } = useLocalSearchParams<{ panel?: string }>();
  return <ReportFeed panel={panel} />;
}
