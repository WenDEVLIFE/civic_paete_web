import { Tabs } from 'expo-router/js-tabs';
import { House, UserRound } from 'lucide-react-native';

import { fonts, useTheme } from '@/theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyBold,
          fontSize: 11,
        },
        sceneStyle: { backgroundColor: theme.colors.canvas },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} strokeWidth={2.1} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Account',
          tabBarIcon: ({ color, size }) => <UserRound size={size} color={color} strokeWidth={2.1} />,
        }}
      />
    </Tabs>
  );
}
