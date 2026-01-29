import { useCallback, useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  getPreviousDate,
  getNextDate,
  canGoToNextDate,
  canGoToPreviousDate,
} from '@/src/utils/journalDateHelpers';

interface SwipeableJournalContainerProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  onSwipeStart?: () => void;
  children: React.ReactNode;
  testID?: string;
}

const SWIPE_THRESHOLD_RATIO = 0.3; // 30% of screen width
const SWIPE_VELOCITY_THRESHOLD = 500;
const RUBBER_BAND_FACTOR = 0.3; // How much to resist at edges

/**
 * Swipeable container for journal entries.
 * Swipe right → previous day (into the past)
 * Swipe left → next day (towards today)
 * Provides haptic feedback and rubber-band effect at boundaries.
 */
function SwipeableJournalContainer({
  currentDate,
  onDateChange,
  onSwipeStart,
  children,
  testID,
}: SwipeableJournalContainerProps): React.ReactElement {
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);

  // Pre-compute boundary states as shared values (worklet-safe)
  const canGoPrevious = useSharedValue(canGoToPreviousDate(currentDate));
  const canGoNext = useSharedValue(canGoToNextDate(currentDate));

  // Update shared values when date changes
  useEffect(() => {
    canGoPrevious.value = canGoToPreviousDate(currentDate);
    canGoNext.value = canGoToNextDate(currentDate);
  }, [currentDate, canGoPrevious, canGoNext]);

  const swipeThreshold = screenWidth * SWIPE_THRESHOLD_RATIO;

  const triggerHaptic = useCallback((type: 'navigate' | 'boundary') => {
    if (type === 'navigate') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, []);

  const handleSwipeStart = useCallback(() => {
    onSwipeStart?.();
  }, [onSwipeStart]);

  const navigateToPrevious = useCallback(() => {
    if (canGoToPreviousDate(currentDate)) {
      triggerHaptic('navigate');
      onDateChange(getPreviousDate(currentDate));
    } else {
      triggerHaptic('boundary');
    }
  }, [currentDate, onDateChange, triggerHaptic]);

  const navigateToNext = useCallback(() => {
    if (canGoToNextDate(currentDate)) {
      triggerHaptic('navigate');
      onDateChange(getNextDate(currentDate));
    } else {
      triggerHaptic('boundary');
    }
  }, [currentDate, onDateChange, triggerHaptic]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Start recognizing after 20px horizontal movement
    .failOffsetY([-20, 20]) // Fail if vertical movement detected (for scrolling)
    .onStart(() => {
      'worklet';
      runOnJS(handleSwipeStart)();
    })
    .onUpdate((event) => {
      'worklet';
      // Apply rubber-band effect at edges
      if (event.translationX > 0 && !canGoPrevious.value) {
        // Swiping right but can't go to previous
        translateX.value = event.translationX * RUBBER_BAND_FACTOR;
      } else if (event.translationX < 0 && !canGoNext.value) {
        // Swiping left but can't go to next
        translateX.value = event.translationX * RUBBER_BAND_FACTOR;
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      'worklet';
      const swipedPastThreshold = Math.abs(translateX.value) > swipeThreshold;
      const fastSwipe = Math.abs(event.velocityX) > SWIPE_VELOCITY_THRESHOLD;

      if (swipedPastThreshold || fastSwipe) {
        if (translateX.value > 0) {
          // Swiped right → go to previous day
          runOnJS(navigateToPrevious)();
        } else {
          // Swiped left → go to next day
          runOnJS(navigateToNext)();
        }
      }

      // Spring back to center
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]} testID={testID}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { SwipeableJournalContainer };
export type { SwipeableJournalContainerProps };
