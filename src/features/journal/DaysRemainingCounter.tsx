import { Text, StyleSheet } from 'react-native';

import { useTheme } from '@/src/hooks/useTheme';
import { typography } from '@/src/constants/typography';

interface DaysRemainingCounterProps {
  daysRemaining: number;
  testID?: string;
}

/**
 * Displays "X days left" in the year using mono font.
 */
function DaysRemainingCounter({
  daysRemaining,
  testID,
}: DaysRemainingCounterProps): React.ReactElement {
  const { colors } = useTheme();
  const dayWord = daysRemaining === 1 ? 'day' : 'days';

  return (
    <Text style={[styles.text, { color: colors.neutralGray }]} testID={testID}>
      {daysRemaining} {dayWord} left
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.mono2,
  },
});

export { DaysRemainingCounter };
export type { DaysRemainingCounterProps };
