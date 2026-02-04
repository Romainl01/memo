import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { GradientBackground } from '@/src/components/GradientBackground';
import { typography } from '@/src/constants/typography';
import { SettingsScreen as SettingsContent } from '@/src/features/settings/SettingsScreen';

export default function SettingsScreen(): React.ReactElement {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.surfaceLight }]}>
      <GradientBackground />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.neutralDark }]}>Settings</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <SettingsContent />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
  },
  title: {
    ...typography.titleH1,
  },
  content: {
    paddingBottom: 32,
  },
});
