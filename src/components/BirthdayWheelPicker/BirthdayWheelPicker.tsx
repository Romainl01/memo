import { useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/constants/colors';

export interface BirthdayValue {
  day: number;
  month: number; // 0-indexed (January = 0)
  year?: number;
}

interface BirthdayWheelPickerProps {
  value: BirthdayValue;
  onChange: (value: BirthdayValue) => void;
  visible: boolean;
  onDone: () => void;
}

// ─── WheelColumn ────────────────────────────────────────────────
// A single scrollable column that snaps to items, mimicking UIPickerView.

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface WheelColumnProps<T extends string | number> {
  items: { label: string; value: T }[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  width?: number;
  testID?: string;
}

function WheelColumn<T extends string | number>({
  items,
  selectedValue,
  onValueChange,
  width,
  testID,
}: WheelColumnProps<T>): React.ReactElement {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const lastReportedIndex = useRef(-1);

  const selectedIndex = useMemo(
    () => Math.max(0, items.findIndex((item) => item.value === selectedValue)),
    [items, selectedValue],
  );

  // Scroll to the selected item when it changes externally (not from user scroll)
  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
      lastReportedIndex.current = selectedIndex;
    }
  }, [selectedIndex]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isUserScrolling.current = false;
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      if (clampedIndex !== lastReportedIndex.current) {
        lastReportedIndex.current = clampedIndex;
        Haptics.selectionAsync();
        onValueChange(items[clampedIndex].value);
      }
    },
    [items, onValueChange],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  // Padding so first/last items can be centered
  const verticalPadding = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

  return (
    <View style={[styles.wheelColumn, width != null ? { width } : { flex: 1 }]} testID={testID}>
      {/* Selection highlight bar */}
      <View style={styles.selectionHighlight} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: verticalPadding }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        testID={testID ? `${testID}-scroll` : undefined}
      >
        {items.map((item, i) => (
          <View key={`${item.value}-${i}`} style={styles.wheelItem}>
            <Text
              style={[
                styles.wheelItemText,
                item.value === selectedValue && styles.wheelItemTextSelected,
              ]}
              testID={testID ? `${testID}-item-${item.value}` : undefined}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Constants ──────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MIN_YEAR = 1920;
const CURRENT_YEAR = new Date().getFullYear();

/** Returns the number of days in a given month (0-indexed). */
function daysInMonth(month: number, year?: number): number {
  const y = year ?? 2001;
  return new Date(y, month + 1, 0).getDate();
}

// ─── BirthdayWheelPicker ────────────────────────────────────────

export function BirthdayWheelPicker({ value, onChange, visible, onDone }: BirthdayWheelPickerProps): React.ReactElement {
  const maxDays = useMemo(() => daysInMonth(value.month, value.year), [value.month, value.year]);

  const dayItems = useMemo(() => {
    const items: { label: string; value: number }[] = [];
    for (let d = 1; d <= maxDays; d++) items.push({ label: String(d), value: d });
    return items;
  }, [maxDays]);

  const monthItems = useMemo(
    () => MONTH_NAMES.map((name, index) => ({ label: name, value: index })),
    [],
  );

  const yearItems = useMemo(() => {
    const items: { label: string; value: string }[] = [{ label: '----', value: 'none' }];
    for (let y = CURRENT_YEAR; y >= MIN_YEAR; y--) items.push({ label: String(y), value: String(y) });
    return items;
  }, []);

  const handleDayChange = useCallback(
    (day: number) => {
      onChange({ ...value, day });
    },
    [value, onChange],
  );

  const handleMonthChange = useCallback(
    (month: number) => {
      const max = daysInMonth(month, value.year);
      const day = Math.min(value.day, max);
      onChange({ ...value, month, day });
    },
    [value, onChange],
  );

  const handleYearChange = useCallback(
    (rawValue: string) => {
      const year = rawValue === 'none' ? undefined : Number(rawValue);
      const month = value.month;
      const max = daysInMonth(month, year);
      const day = Math.min(value.day, max);
      onChange({ ...value, year, day });
    },
    [value, onChange],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      testID="birthday-modal"
    >
      <View style={styles.overlay}>
        {/* Backdrop — tap to dismiss */}
        <Pressable
          style={styles.backdrop}
          onPress={onDone}
          testID="birthday-backdrop"
        />

        {/* Bottom panel */}
        <View style={styles.panel}>
          {/* Toolbar */}
          <View style={styles.toolbar}>
            <Pressable onPress={onDone} testID="birthday-done-button">
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>

          {/* Wheels */}
          <View style={styles.wheelRow}>
            <WheelColumn
              items={dayItems}
              selectedValue={value.day}
              onValueChange={handleDayChange}
              width={64}
              testID="day-picker"
            />
            <WheelColumn
              items={monthItems}
              selectedValue={value.month}
              onValueChange={handleMonthChange}
              testID="month-picker"
            />
            <WheelColumn
              items={yearItems}
              selectedValue={value.year != null ? String(value.year) : 'none'}
              onValueChange={handleYearChange}
              width={96}
              testID="year-picker"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutralGray200,
  },
  doneText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  wheelRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  wheelColumn: {
    height: WHEEL_HEIGHT,
    overflow: 'hidden',
  },
  selectionHighlight: {
    position: 'absolute',
    top: (WHEEL_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: colors.neutralGray200,
    borderRadius: 8,
    opacity: 0.4,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 20,
    color: colors.neutralGray,
  },
  wheelItemTextSelected: {
    color: colors.neutralDark,
    fontWeight: '600',
  },
});
