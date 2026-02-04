import { useState } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { useNotificationPermission } from '@/src/hooks/useNotificationPermission';
import { useNotificationStateStore } from '@/src/stores/notificationStateStore';
import { useAppearanceStore, AppearanceMode } from '@/src/stores/appearanceStore';
import { useTheme } from '@/src/hooks/useTheme';
import { SettingsToggleRow } from '@/src/components/SettingsToggleRow';
import { SettingsRow } from '@/src/components/SettingsRow/SettingsRow';
import { GlassMenu, GlassMenuItem } from '@/src/components/GlassMenu';

const appVersion = Constants.expoConfig?.version ?? '0.0.0';

const APPEARANCE_LABELS: Record<AppearanceMode, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

const APPEARANCE_MENU_ITEMS: GlassMenuItem<AppearanceMode>[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

function SettingsScreen(): React.ReactElement {
  const { colors } = useTheme();

  const {
    isGranted,
    isDenied,
    requestPermission,
  } = useNotificationPermission();

  const notificationsEnabled = useNotificationStateStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useNotificationStateStore((s) => s.setNotificationsEnabled);

  const appearanceMode = useAppearanceStore((s) => s.mode);
  const setAppearanceMode = useAppearanceStore((s) => s.setMode);

  const [showAppearanceMenu, setShowAppearanceMenu] = useState(false);

  const isToggleOn = isGranted && notificationsEnabled;

  const handleNotificationToggle = async (newValue: boolean): Promise<void> => {
    if (!newValue) {
      setNotificationsEnabled(false);
      return;
    }

    const hasPermission = isGranted || (await requestPermission());
    if (hasPermission) {
      setNotificationsEnabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeader, { color: colors.neutralGray300 }]}>APPEARANCE</Text>
      <View style={[styles.section, styles.menuContainer]}>
        <SettingsRow
          icon="moon"
          label="Appearance"
          value={APPEARANCE_LABELS[appearanceMode]}
          onPress={() => setShowAppearanceMenu(true)}
          chevronType="dropdown"
          testID="appearance-row"
        />
        <GlassMenu
          visible={showAppearanceMenu}
          onClose={() => setShowAppearanceMenu(false)}
          items={APPEARANCE_MENU_ITEMS}
          selectedValue={appearanceMode}
          onSelect={setAppearanceMode}
          direction="down"
          testID="appearance-menu"
        />
      </View>
      <Text style={[styles.sectionHeader, { color: colors.neutralGray300 }]}>NOTIFICATIONS</Text>
      <View style={styles.section}>
        <SettingsToggleRow
          icon="bell"
          label="Push Notifications"
          value={isToggleOn}
          onToggle={handleNotificationToggle}
          testID="notifications-toggle"
        />
        {isDenied && (
          <Pressable onPress={Linking.openSettings}>
            <Text style={[styles.deniedText, { color: colors.feedbackError }]}>Denied — tap to open Settings</Text>
          </Pressable>
        )}
      </View>

      <Text style={[styles.sectionHeader, { color: colors.neutralGray300 }]}>ABOUT</Text>
      <View style={styles.section}>
        <SettingsRow
          icon="info.circle"
          label="Version"
          value={appVersion}
          hasValue
          testID="version-row"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  sectionHeader: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  section: {
    gap: 8,
  },
  menuContainer: {
    position: 'relative',
    zIndex: 100,
  },
  deniedText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export { SettingsScreen };
