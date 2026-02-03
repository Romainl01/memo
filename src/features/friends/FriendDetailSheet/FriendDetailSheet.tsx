import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { Avatar } from '@/src/components/Avatar';
import { useAutoSave } from '@/src/hooks/useAutoSave';
import type { Friend } from '@/src/stores/friendsStore';
import { colors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';

const BUTTON_SIZE = 44;

interface FriendDetailSheetProps {
  friend: Friend;
  onEdit: () => void;
  onNotesChange: (notes: string) => void;
}

function FriendDetailSheet({
  friend,
  onEdit,
  onNotesChange,
}: FriendDetailSheetProps): React.ReactElement {
  const [notes, setNotes] = useState(friend.notes);

  useAutoSave({
    content: notes,
    onSave: onNotesChange,
    debounceMs: 500,
    allowEmpty: true,
  });

  return (
    <View style={styles.container}>
      {/* Header with edit button */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Pressable
          onPress={onEdit}
          accessibilityLabel="Edit friend details"
          accessibilityRole="button"
          testID="edit-button"
        >
          <GlassView
            style={styles.glassButton}
            tintColor={colors.primary}
            glassEffectStyle="clear"
          >
            <SymbolView
              name="pencil"
              size={18}
              weight="semibold"
              tintColor={colors.neutralWhite}
            />
          </GlassView>
        </Pressable>
      </View>

      {/* Avatar and name */}
      <View style={styles.profileSection}>
        <Avatar
          name={friend.name}
          imageUri={friend.photoUrl ?? undefined}
          size={72}
        />
        <Text style={styles.name}>{friend.name}</Text>
      </View>

      {/* Notes section */}
      <View style={styles.notesSection}>
        <View style={styles.notesContainer}>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this friend..."
            placeholderTextColor={colors.neutralGray300}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: BUTTON_SIZE,
  },
  glassButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  name: {
    ...typography.titleH1,
    color: colors.neutralDark,
    textAlign: 'center',
  },
  notesSection: {
    paddingHorizontal: 16,
  },
  notesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  notesInput: {
    ...typography.body1,
    color: colors.neutralDark,
    flex: 1,
    minHeight: 80,
    padding: 0,
  },
});

export { FriendDetailSheet };
export type { FriendDetailSheetProps };
