import { StyleSheet, View } from 'react-native';

import { AppText, Chip } from '@/components/ui';
import { usePreferences } from '@/lib/preferences';
import { spacing } from '@/theme';

export function LanguageOptions() {
  const { language, setLanguage, t } = usePreferences();

  return (
    <View style={styles.group}>
      <AppText variant="bodyBold">{t('App language')}</AppText>
      <View style={styles.options}>
        <Chip label="English" active={language === 'en'} onPress={() => setLanguage('en')} />
        <Chip label="Filipino" active={language === 'fil'} onPress={() => setLanguage('fil')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
