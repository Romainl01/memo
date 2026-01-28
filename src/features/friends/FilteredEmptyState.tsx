import { View, Text, StyleSheet } from 'react-native';
import { GlassButton } from '@/src/components/GlassButton';
import { colors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';
import type { FriendCategory } from '@/src/stores/friendsStore';
import { RELATIONSHIP_LABELS } from '@/src/stores/friendsStore';

interface FilteredEmptyStateProps {
  category: FriendCategory;
  onAddFriend: () => void;
}

function FilteredEmptyState({ category, onAddFriend }: FilteredEmptyStateProps): React.ReactElement {
  const categoryLabel = RELATIONSHIP_LABELS[category];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>No {categoryLabel} friends yet</Text>
      <Text style={styles.subtitle}>Add someone from your contacts to this category</Text>
      <GlassButton
        onPress={onAddFriend}
        label="Add a friend"
        testID="filtered-empty-add-button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  title: {
    ...typography.titleH2,
    color: colors.neutralGray300,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: colors.neutralGray,
    textAlign: 'center',
  },
});

export { FilteredEmptyState };
export type { FilteredEmptyStateProps };
