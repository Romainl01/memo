import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/src/hooks/useTheme';
import { getCardContainerStyle } from '@/src/constants/colors';
import { useJournalStore, JournalEntry } from '@/src/stores/journalStore';
import { generateYearDates, isToday, isPastOrToday } from '@/src/utils/journalDateHelpers';
import { DayDot, DayDotStatus } from './DayDot';

const GAP = 5;
const MIN_COLUMNS = 14;
const MAX_COLUMNS = 28;
const CONTAINER_PADDING = 16;
const CONTAINER_BORDER_RADIUS = 16;

interface YearGridProps {
  year: number;
  /** Available width for the grid */
  availableWidth: number;
  /** Available height for the grid */
  availableHeight: number;
  onDayPress: (date: string) => void;
  testID?: string;
}

/**
 * Calculates the optimal grid layout to fit all days within available space.
 * Tries different column counts and picks the one that maximizes cell size.
 */
function calculateGridLayout(
  totalDays: number,
  availableWidth: number,
  availableHeight: number
): { columns: number; cellSize: number } {
  let bestColumns = MIN_COLUMNS;
  let bestCellSize = 0;

  for (let cols = MIN_COLUMNS; cols <= MAX_COLUMNS; cols++) {
    const rows = Math.ceil(totalDays / cols);

    // Calculate max cell size that fits in width
    const maxCellFromWidth = (availableWidth - (cols - 1) * GAP) / cols;
    // Calculate max cell size that fits in height
    const maxCellFromHeight = (availableHeight - (rows - 1) * GAP) / rows;

    // Cell size is limited by the smaller dimension
    const cellSize = Math.min(maxCellFromWidth, maxCellFromHeight);

    if (cellSize > bestCellSize) {
      bestCellSize = cellSize;
      bestColumns = cols;
    }
  }

  return { columns: bestColumns, cellSize: Math.floor(bestCellSize) };
}

/**
 * The inner grid of dots - extracted to ensure consistent rendering
 */
interface DotGridProps {
  dates: string[];
  cellSize: number;
  gridWidth: number;
  entries: Record<string, JournalEntry>;
  onDayPress: (date: string) => void;
}

function DotGrid({
  dates,
  cellSize,
  gridWidth,
  entries,
  onDayPress,
}: DotGridProps): React.ReactElement {
  return (
    <View style={[styles.grid, { width: gridWidth, gap: GAP }]}>
      {dates.map((date) => (
        <DayDot
          key={date}
          size={cellSize}
          status={getDotStatus(date, entries)}
          onPress={() => onDayPress(date)}
          testID={`day-dot-${date}`}
        />
      ))}
    </View>
  );
}

/**
 * A dense grid showing all 365 days of the year as colored dots.
 * Dynamically calculates layout to fit entire year on screen.
 */
function YearGrid({
  year,
  availableWidth,
  availableHeight,
  onDayPress,
  testID,
}: YearGridProps): React.ReactElement {
  const { colors, isDark } = useTheme();
  const entries = useJournalStore((state) => state.entries);
  const dates = generateYearDates(year);

  // Subtract padding from available space for grid calculation
  const innerWidth = availableWidth - CONTAINER_PADDING * 2;
  const innerHeight = availableHeight - CONTAINER_PADDING * 2;

  const { columns, cellSize } = calculateGridLayout(
    dates.length,
    innerWidth,
    innerHeight
  );

  const gridWidth = columns * cellSize + (columns - 1) * GAP;

  return (
    <View
      testID={testID}
      style={[styles.gridContainer, getCardContainerStyle(colors, isDark)]}
    >
      <DotGrid
        dates={dates}
        cellSize={cellSize}
        gridWidth={gridWidth}
        entries={entries}
        onDayPress={onDayPress}
      />
    </View>
  );
}

function getDotStatus(
  date: string,
  entries: Record<string, JournalEntry>
): DayDotStatus {
  if (isToday(date)) {
    return 'today';
  }

  if (!isPastOrToday(date)) {
    return 'future';
  }

  return date in entries ? 'past-with-entry' : 'past-without-entry';
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: CONTAINER_PADDING,
    borderRadius: CONTAINER_BORDER_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export { YearGrid };
export type { YearGridProps };
