import { View, Pressable, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/src/hooks/useTheme';
import { moodColors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';
import { Mood } from '@/src/stores/journalStore';

interface MoodPickerProps {
  selectedMood: Mood | null;
  onMoodChange: (mood: Mood | null) => void;
  testID?: string;
}

// Ordered from difficult to amazing
const MOODS: Mood[] = ['awful', 'bad', 'okay', 'good', 'great'];
const BUTTON_SIZE = 48;
const CIRCLE_SIZE = 24;
const STAR_SIZE = 26;

/**
 * Horizontal mood picker with colored circles and a star for 'great'.
 * Tap a mood to select, tap again to deselect.
 * Haptic feedback on selection change.
 */
function MoodPicker({
  selectedMood,
  onMoodChange,
  testID,
}: MoodPickerProps): React.ReactElement {
  const { colors } = useTheme();

  function handleMoodPress(mood: Mood): void {
    Haptics.selectionAsync();
    // Tap selected mood to deselect, otherwise select new mood
    onMoodChange(selectedMood === mood ? null : mood);
  }

  return (
    <View style={styles.container} testID={testID}>
      <Text style={[styles.label, { color: colors.neutralGray }]}>
        How was your day?
      </Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood;
          const moodColor = moodColors[mood];
          const isGreat = mood === 'great';

          return (
            <Pressable
              key={mood}
              onPress={() => handleMoodPress(mood)}
              testID={`${testID}-${mood}`}
              style={({ pressed }) => [
                styles.moodButton,
                pressed && styles.pressed,
              ]}
            >
              {isGreat ? (
                <SymbolView
                  name="star.fill"
                  size={STAR_SIZE}
                  weight="medium"
                  tintColor={isSelected ? moodColor : colors.neutralGray200}
                />
              ) : (
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: isSelected ? moodColor : 'transparent',
                      borderColor: isSelected ? moodColor : colors.neutralGray200,
                    },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  label: {
    ...typography.body2,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  moodButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});

export { MoodPicker };
export type { MoodPickerProps };
