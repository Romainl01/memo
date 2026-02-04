import { useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/hooks/useTheme';
import { getCardContainerStyle } from '@/src/constants/colors';

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

function getDirectionStyles(
  direction: 'up' | 'down',
  alignment: 'left' | 'right'
): { top?: `${number}%`; bottom?: `${number}%`; marginTop?: number; marginBottom?: number; transformOrigin: string } {
  const verticalOrigin = direction === 'down' ? 'top' : 'bottom';
  const transformOrigin = `${verticalOrigin} ${alignment}`;

  if (direction === 'down') {
    return { top: '100%', marginTop: 4, transformOrigin };
  }
  return { bottom: '100%', marginBottom: 4, transformOrigin };
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
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 25,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset for next open
      scaleAnim.setValue(0.97);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  const handleClose = useCallback(() => {
    // Animate out
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [scaleAnim, opacityAnim, onClose]);

  const handleSelect = useCallback(
    (value: T) => {
      Haptics.selectionAsync();
      onSelect(value);
      handleClose();
    },
    [onSelect, handleClose]
  );

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
          getDirectionStyles(direction, alignment),
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        testID={testID}
      >
        {/* Inner Pressable prevents taps from bubbling to backdrop */}
        <Pressable>
          <View
            style={[
              styles.menuContainer,
              getCardContainerStyle(colors, isDark),
            ]}
          >
            {items.map((item, index) => {
              const isSelected = selectedValue === item.value;
              const isLast = index === items.length - 1;

              return (
                <Pressable
                  key={String(item.value)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.menuItemBorder },
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
  },
  menuContainer: {
    borderRadius: MENU_BORDER_RADIUS,
    overflow: 'hidden',
    paddingVertical: MENU_PADDING_VERTICAL,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
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
