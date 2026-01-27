import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import type { FriendCategory } from '@/src/stores/friendsStore';
import { colors } from '@/src/constants/colors';

interface CategoryOption {
  value: FriendCategory;
  label: string;
  icon: SFSymbol;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'friend', label: 'Friend', icon: 'person' },
  { value: 'family', label: 'Family', icon: 'house' },
  { value: 'work', label: 'Work', icon: 'briefcase' },
  { value: 'partner', label: 'Partner', icon: 'heart.fill' },
  { value: 'flirt', label: 'Flirt', icon: 'sparkles' },
];

interface CategorySelectorProps {
  value: FriendCategory;
  onChange: (value: FriendCategory) => void;
  style?: StyleProp<ViewStyle>;
}

function CategorySelector({ value, onChange, style }: CategorySelectorProps): React.ReactElement {
  return (
    <View style={[styles.container, style]}>
      {CATEGORY_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            testID={`category-pill-${option.value}`}
            onPress={() => onChange(option.value)}
            style={[
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillUnselected,
            ]}
          >
            <SymbolView
              name={option.icon}
              size={14}
              tintColor={isSelected ? colors.neutralWhite : colors.neutralGray}
            />
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelUnselected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillUnselected: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.neutralGray200,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.neutralWhite,
  },
  labelUnselected: {
    color: colors.neutralDark,
  },
});

export { CategorySelector, CATEGORY_OPTIONS };
export type { CategorySelectorProps };
