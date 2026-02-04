import { useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/hooks/useTheme';

export interface GlassMenuItem<T> {
  label: string;
  value: T;
}

interface GlassMenuProps<T> {
  /** Whether the menu is visible */
  visible: boolean;
  /** Callback when menu should close */
  onClose: () => void;
  /** Menu items to display */
  items: GlassMenuItem<T>[];
  /** Currently selected value (shows checkmark) */
  selectedValue?: T;
  /** Callback when an item is selected */
  onSelect: (value: T) => void;
  /** Direction the menu opens: 'up' (default) or 'down' */
  direction?: 'up' | 'down';
  /** Horizontal alignment of the menu: 'left' or 'right' (default) */
  alignment?: 'left' | 'right';
  /** Test ID for the menu container */
  testID?: string;
}

const MENU_BORDER_RADIUS = 16;
const ITEM_HEIGHT = 48;
const MENU_PADDING_VERTICAL = 6;
const MENU_WIDTH = 160;

// Animation constants - smooth expansion from anchor point
const SCALE_START = 0.01; // Near-zero for dramatic expansion effect
const OPEN_DURATION = 350; // Deliberate, noticeable expansion
const CLOSE_DURATION = 280; // Smooth close
const EASING_OUT = Easing.out(Easing.cubic); // Smooth deceleration, no bounce

const DIRECTION_STYLES = {
  down: { top: '100%' as const, marginTop: 4 },
  up: { bottom: '100%' as const, marginBottom: 4 },
} as const;

/**
 * Calculate the transform origin offset for scale animation.
 * Uses the translate-scale-translate pattern from react-native-anchor-point.
 *
 * The menu expands from the corner nearest to the trigger:
 * - direction='down' + alignment='right' → top-right corner
 * - direction='down' + alignment='left'  → top-left corner
 * - direction='up'   + alignment='right' → bottom-right corner
 * - direction='up'   + alignment='left'  → bottom-left corner
 *
 * Formula: offset = center - anchor (NOT anchor - center!)
 * This matches the react-native-anchor-point library implementation.
 */
function getAnchorOffset(
  direction: 'up' | 'down',
  alignment: 'left' | 'right',
  menuHeight: number
): { offsetX: number; offsetY: number } {
  const centerX = MENU_WIDTH / 2;
  const centerY = menuHeight / 2;

  // Anchor at corner nearest to trigger
  const anchorX = alignment === 'left' ? 0 : MENU_WIDTH;
  const anchorY = direction === 'down' ? 0 : menuHeight;

  // CRITICAL: offset = center - anchor (not anchor - center)
  // This matches the react-native-anchor-point library formula
  return {
    offsetX: centerX - anchorX,
    offsetY: centerY - anchorY,
  };
}

export function GlassMenu<T>({
  visible,
  onClose,
  items,
  selectedValue,
  onSelect,
  direction = 'up',
  alignment = 'right',
  testID,
}: GlassMenuProps<T>): React.ReactElement | null {
  const { colors, isDark } = useTheme();

  // Reanimated shared values
  const scale = useSharedValue(SCALE_START);
  const opacity = useSharedValue(0);

  // Calculate menu height for transform origin
  const menuHeight = items.length * ITEM_HEIGHT + MENU_PADDING_VERTICAL * 2;
  const { offsetX, offsetY } = getAnchorOffset(direction, alignment, menuHeight);

  useEffect(() => {
    if (visible) {
      // Reset to initial state before animating (ensures clean start on every open)
      scale.value = SCALE_START;
      opacity.value = 0;

      scale.value = withTiming(1, { duration: OPEN_DURATION, easing: EASING_OUT });
      opacity.value = withTiming(1, { duration: OPEN_DURATION, easing: EASING_OUT });
    }
  }, [visible, scale, opacity]);

  const handleClose = useCallback(() => {
    scale.value = withTiming(SCALE_START, { duration: CLOSE_DURATION, easing: EASING_OUT });
    opacity.value = withTiming(0, { duration: CLOSE_DURATION, easing: EASING_OUT }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onClose)();
      }
    });
  }, [scale, opacity, onClose]);

  const handleSelect = useCallback(
    (value: T) => {
      Haptics.selectionAsync();
      onSelect(value);
      handleClose();
    },
    [onSelect, handleClose]
  );

  // Scale from anchor point using translate-scale-translate pattern
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: -offsetX },
      { translateY: -offsetY },
      { scale: scale.value },
      { translateX: offsetX },
      { translateY: offsetY },
    ],
  }));

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Backdrop - covers parent container to catch outside taps */}
      <Pressable style={styles.backdrop} onPress={handleClose} />

      {/* Menu - positioned absolutely relative to the row */}
      <Animated.View
        style={[
          styles.menuWrapper,
          alignment === 'left' ? { left: 0 } : { right: 0 },
          DIRECTION_STYLES[direction],
          animatedStyle,
        ]}
        testID={testID}
      >
        {/* Inner Pressable prevents taps from bubbling to backdrop */}
        <Pressable>
          {/* Separate clipping layer - clips BlurView to rounded corners without clipping shadow */}
          <View style={styles.menuClip}>
            <BlurView
              tint={isDark ? 'dark' : 'extraLight'}
              intensity={80}
              style={styles.menuContainer}
            >
              {items.map((item) => {
                const isSelected = selectedValue === item.value;

                return (
                  <Pressable
                    key={String(item.value)}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && { backgroundColor: colors.menuItemPressed },
                    ]}
                    onPress={() => handleSelect(item.value)}
                    testID={`${testID}-item-${item.value}`}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        { color: colors.neutralDark },
                        isSelected && { fontFamily: 'Inter_500Medium', color: colors.primary },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <SymbolView
                        name="checkmark"
                        size={18}
                        weight="semibold"
                        tintColor={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </BlurView>
          </View>
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    // Extend far beyond the container to cover the entire screen
    top: -2000,
    left: -2000,
    right: -2000,
    bottom: -2000,
    zIndex: 999,
  },
  menuWrapper: {
    position: 'absolute',
    width: MENU_WIDTH,
    zIndex: 1000,
    borderRadius: MENU_BORDER_RADIUS,
    borderCurve: 'continuous',
    // NO overflow: hidden here - allows boxShadow to render outside bounds
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  menuClip: {
    // Separate layer for content clipping - clips BlurView to rounded corners
    borderRadius: MENU_BORDER_RADIUS,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  menuContainer: {
    paddingVertical: MENU_PADDING_VERTICAL,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: ITEM_HEIGHT,
  },
  menuItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
  },
});
