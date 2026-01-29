import { StyleSheet, Text, View } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { colors } from '@/src/constants/colors';
import { isToday, formatShortDate } from '@/src/utils/journalDateHelpers';

interface GlassDateChipProps {
  date: string; // YYYY-MM-DD
  showSavedIndicator?: boolean;
  testID?: string;
}

/**
 * Non-interactive liquid glass pill showing the date.
 * Displays "Today" for today's date, otherwise shows "Mon, Jan 29" format.
 * Optionally shows an animated checkmark when content is saved.
 */
function GlassDateChip({
  date,
  showSavedIndicator = false,
  testID,
}: GlassDateChipProps): React.ReactElement {
  const displayText = isToday(date) ? 'Today' : formatShortDate(date);

  return (
    <View testID={testID} style={styles.container}>
      <GlassView style={styles.glass}>
        <View style={styles.content}>
          <Text style={styles.label}>{displayText}</Text>
          {showSavedIndicator && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              testID="saved-checkmark"
              style={styles.checkmarkContainer}
            >
              <SymbolView
                name="checkmark"
                size={14}
                weight="semibold"
                tintColor={colors.feedbackSuccess}
              />
            </Animated.View>
          )}
        </View>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  glass: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  checkmarkContainer: {
    marginLeft: 2,
  },
});

export { GlassDateChip };
export type { GlassDateChipProps };
