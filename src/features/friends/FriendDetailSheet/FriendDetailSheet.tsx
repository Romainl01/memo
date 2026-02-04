import { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { Avatar } from '@/src/components/Avatar';
import { useAutoSave } from '@/src/hooks/useAutoSave';
import { useTheme } from '@/src/hooks/useTheme';
import type { Friend } from '@/src/stores/friendsStore';
import { typography } from '@/src/constants/typography';

const BUTTON_SIZE = 44;

interface FriendDetailSheetProps {
  friend: Friend;
  onEdit: () => void;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
}

function FriendDetailSheet({
  friend,
  onEdit,
  onClose,
  onNotesChange,
}: FriendDetailSheetProps): React.ReactElement {
  const { colors } = useTheme();
  const [notes, setNotes] = useState(friend.notes);

  useAutoSave({
    content: notes,
    onSave: onNotesChange,
    debounceMs: 500,
    allowEmpty: true,
  });

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  return (
    <View style={styles.container}>
      {/* Header with edit and done buttons */}
      <View style={styles.header}>
        {/* Edit button - left side, neutral */}
        <Pressable
          onPress={onEdit}
          accessibilityLabel="Edit friend details"
          accessibilityRole="button"
          testID="edit-button"
        >
          <GlassView style={styles.glassButton} glassEffectStyle="clear">
            <SymbolView
              name="pencil"
              size={18}
              weight="semibold"
              tintColor={colors.neutralDark}
            />
          </GlassView>
        </Pressable>

        {/* Done button - right side, primary style, closes sheet */}
        <Pressable
          onPress={handleClose}
          accessibilityLabel="Done"
          accessibilityRole="button"
          testID="done-button"
        >
          <GlassView
            style={styles.glassButton}
            tintColor={colors.primary}
            glassEffectStyle="clear"
          >
            <SymbolView
              name="checkmark"
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
        <Text style={[styles.name, { color: colors.neutralDark }]}>{friend.name}</Text>
      </View>

      {/* Notes section */}
      <View style={styles.notesSection}>
        <View style={[styles.notesContainer, { backgroundColor: colors.notesBackground }]}>
          <TextInput
            style={[styles.notesInput, { color: colors.neutralDark }]}
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
    textAlign: 'center',
  },
  notesSection: {
    paddingHorizontal: 16,
  },
  notesContainer: {
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
  },
  notesInput: {
    ...typography.mono1,
    flex: 1,
    minHeight: 140,
    padding: 0,
  },
});

export { FriendDetailSheet };
export type { FriendDetailSheetProps };
