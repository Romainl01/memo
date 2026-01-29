import { Pressable, View, StyleSheet } from 'react-native';

import { colors } from '@/src/constants/colors';

export type DayDotStatus =
  | 'past-with-entry'
  | 'past-without-entry'
  | 'today'
  | 'future';

interface DayDotProps {
  status: DayDotStatus;
  /** Size of the cell containing the dot */
  size: number;
  onPress?: () => void;
  testID?: string;
}

/**
 * A single dot representing one day in the year grid.
 *
 * Visual states:
 * - past-with-entry: Orange filled (primary)
 * - past-without-entry: Gray filled
 * - today: Orange with outer ring
 * - future: Very faint gray, not pressable
 */
function DayDot({ status, size, onPress, testID }: DayDotProps): React.ReactElement {
  const isFuture = status === 'future';
  const isToday = status === 'today';

  // Dot is 70% of cell size
  const dotSize = Math.max(4, size * 0.7);

  return (
    <Pressable
      onPress={onPress}
      disabled={isFuture}
      testID={testID}
      style={[styles.container, { width: size, height: size }]}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      {isToday && (
        <View
          style={[
            styles.todayRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      )}
      <View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: getDotColor(status),
        }}
      />
    </Pressable>
  );
}

function getDotColor(status: DayDotStatus): string {
  switch (status) {
    case 'past-with-entry':
    case 'today':
      return colors.primary;
    case 'past-without-entry':
      return colors.neutralGray200;
    case 'future':
      return 'rgba(217, 219, 225, 0.3)';
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
});

export { DayDot };
export type { DayDotProps };
