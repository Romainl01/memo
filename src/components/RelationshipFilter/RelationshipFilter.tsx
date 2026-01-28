import { ScrollView, View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/constants/colors';
import type { FriendCategory, CategoryCounts } from '@/src/stores/friendsStore';
import { RELATIONSHIP_LABELS } from '@/src/stores/friendsStore';

interface RelationshipFilterProps {
  value: FriendCategory | null;
  onChange: (category: FriendCategory | null) => void;
  counts: CategoryCounts;
  style?: StyleProp<ViewStyle>;
}

type FilterOption = {
  value: FriendCategory | null;
  label: string;
  accessibilityLabel: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: null, label: 'All', accessibilityLabel: 'Show all friends' },
  { value: 'friend', label: 'Friend', accessibilityLabel: 'Filter by Friend' },
  { value: 'family', label: 'Family', accessibilityLabel: 'Filter by Family' },
  { value: 'work', label: 'Work', accessibilityLabel: 'Filter by Work' },
  { value: 'partner', label: 'Partner', accessibilityLabel: 'Filter by Partner' },
  { value: 'flirt', label: 'Flirt', accessibilityLabel: 'Filter by Flirt' },
];

function RelationshipFilter({
  value,
  onChange,
  counts,
  style,
}: RelationshipFilterProps): React.ReactElement {
  const handlePress = (category: FriendCategory | null) => {
    Haptics.selectionAsync();
    onChange(category);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        testID="filter-scroll-view"
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const countKey = option.value ?? 'all';
          const count = counts[countKey];

          return (
            <Pressable
              key={option.value ?? 'all'}
              testID={`filter-pill-${option.value ?? 'all'}`}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => handlePress(option.value)}
              accessibilityRole="button"
              accessibilityLabel={option.accessibilityLabel}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {option.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.neutralGray200,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutralDark,
  },
  pillTextSelected: {
    color: colors.neutralWhite,
  },
});

export { RelationshipFilter };
export type { RelationshipFilterProps };
