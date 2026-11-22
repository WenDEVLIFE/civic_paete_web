import { Image } from 'expo-image';
import { router, useGlobalSearchParams, usePathname } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { House, Plus, Search, SlidersHorizontal, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import civicLogo from '../../../assets/images/logo.png';
import { usePreferences } from '@/lib/preferences';
import { AppText } from '@/components/ui';
import { radius, spacing, useTheme } from '@/theme';

export default function TabsLayout() {
  const { t } = usePreferences();
  const { colors } = useTheme();
  const isCommunity = usePathname() === '/';
  const { panel } = useGlobalSearchParams<{ panel?: string }>();

  const togglePanel = (next: 'search' | 'filters') => {
    if (isCommunity) {
      router.setParams({ panel: panel === next ? 'closed' : next });
    } else {
      router.navigate({ pathname: '/', params: { panel: next } });
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.navy }]}>
      <Tabs style={styles.screen}>
        <View style={styles.masthead}>
          <Image source={civicLogo} alt="" style={styles.logo} />
          <AppText variant="heading" color={colors.onPrimary} style={styles.brand} numberOfLines={1}>
            Civic Paete
          </AppText>
          <HeaderAction label={t('File a report')} icon={Plus} onPress={() => router.push('/submit')} />
          <HeaderAction
            label={t('Search reports')}
            icon={Search}
            active={isCommunity && panel === 'search'}
            onPress={() => togglePanel('search')}
          />
          <HeaderAction
            label={t('Filter reports')}
            icon={SlidersHorizontal}
            active={isCommunity && panel === 'filters'}
            onPress={() => togglePanel('filters')}
          />
        </View>
        <TabList style={[styles.nav, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TabTrigger
            name="community"
            href="/"
            accessibilityRole="tab"
            accessibilityState={{ selected: isCommunity }}
            style={[styles.tab, isCommunity && { backgroundColor: colors.glow }]}
          >
            <House size={18} color={isCommunity ? colors.primary : colors.textMuted} />
            <AppText variant="subtitle" color={isCommunity ? colors.primary : colors.textMuted}>{t('Community')}</AppText>
          </TabTrigger>
          <TabTrigger
            name="account"
            href="/profile"
            accessibilityRole="tab"
            accessibilityState={{ selected: !isCommunity }}
            style={[styles.tab, !isCommunity && { backgroundColor: colors.glow }]}
          >
            <UserRound size={18} color={!isCommunity ? colors.primary : colors.textMuted} />
            <AppText variant="subtitle" color={!isCommunity ? colors.primary : colors.textMuted}>{t('My Account')}</AppText>
          </TabTrigger>
        </TabList>
        <TabSlot style={{ backgroundColor: colors.canvas }} />
      </Tabs>
    </SafeAreaView>
  );
}

function HeaderAction({
  label,
  icon: Icon,
  active,
  onPress,
}: {
  label: string;
  icon: typeof Plus;
  active?: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={active === undefined ? undefined : { expanded: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        {
          backgroundColor: active ? colors.primaryFill : colors.navySurface,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Icon size={20} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  brand: { flex: 1 },
  logo: { width: 40, height: 40, borderRadius: radius.sm },
  action: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  nav: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: radius.sm,
  },
});
