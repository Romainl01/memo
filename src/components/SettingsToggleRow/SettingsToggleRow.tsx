import { View, Text, Switch, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { useTheme } from '@/src/hooks/useTheme';
import { getCardContainerStyle } from '@/src/constants/colors';

interface SettingsToggleRowProps {
  icon: SFSymbol;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
}

function SettingsToggleRow({
  icon,
  label,
  value,
  onToggle,
  disabled = false,
  testID,
}: SettingsToggleRowProps): React.ReactElement {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        getCardContainerStyle(colors, isDark),
      ]}
      testID={testID}
    >
      <View style={styles.leftSection}>
        <SymbolView name={icon} size={24} tintColor={colors.neutralDark} />
        <Text style={[styles.label, { color: colors.neutralDark }]}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.neutralGray200, true: colors.primary }}
        thumbColor={isDark ? '#FFFFFF' : colors.neutralWhite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
});

export { SettingsToggleRow };
export type { SettingsToggleRowProps };
