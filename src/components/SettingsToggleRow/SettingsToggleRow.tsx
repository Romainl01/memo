import { View, Text, Switch, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { colors } from '@/src/constants/colors';

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
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.leftSection}>
        <SymbolView name={icon} size={24} tintColor={colors.neutralDark} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.neutralGray200, true: colors.primary }}
        thumbColor={colors.neutralWhite}
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
    borderWidth: 1,
    borderColor: colors.neutralGray200,
    borderRadius: 16,
    backgroundColor: colors.surfaceCard,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.neutralDark,
  },
});

export { SettingsToggleRow };
export type { SettingsToggleRowProps };
