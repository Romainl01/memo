import { Pressable, View, StyleSheet } from 'react-native';

import { colors } from '@/src/constants/colors';

export type DayDotStatus =
  | 'past-with-entry'
  | 'past-without-entry'
  | 'today'
  | 'future';

interface DayDotProps {
  status: DayDotStatus;
  onPress?: () => void;
  testID?: string;
}

const DOT_SIZE = 10;
const TODAY_RING_SIZE = 16;

/**
 * A single dot representing one day in the year grid.
 *
 * Visual states:
 * - past-with-entry: Orange filled (primary)
 * - past-without-entry: Gray filled
 * - today: Orange with outer ring
 * - future: Very faint gray, not pressable
 */
function DayDot({ status, onPress, testID }: DayDotProps): React.ReactElement {
  const isFuture = status === 'future';
  const isToday = status === 'today';

  return (
    <Pressable
      onPress={onPress}
      disabled={isFuture}
      testID={testID}
      style={styles.container}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      {isToday && <View style={styles.todayRing} />}
      <View style={[styles.dot, { backgroundColor: getDotColor(status) }]} />
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
    width: TODAY_RING_SIZE,
    height: TODAY_RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  todayRing: {
    position: 'absolute',
    width: TODAY_RING_SIZE,
    height: TODAY_RING_SIZE,
    borderRadius: TODAY_RING_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});

export { DayDot };
export type { DayDotProps };
