import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { SwipeableJournalContainer } from './SwipeableJournalContainer';

// Mock the gesture handler and reanimated
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureDetector: ({ children }: { children: React.ReactNode }) => (
      <View testID="gesture-detector">{children}</View>
    ),
    Gesture: {
      Pan: () => ({
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        activeOffsetX: jest.fn().mockReturnThis(),
        failOffsetY: jest.fn().mockReturnThis(),
      }),
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const Animated = {
    View: View,
    createAnimatedComponent: (component: unknown) => component,
  };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((val) => val),
    runOnJS: jest.fn((fn) => fn),
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
  },
  NotificationFeedbackType: {
    Warning: 'warning',
  },
}));

// Mock date helpers
jest.mock('@/src/utils/journalDateHelpers', () => ({
  getPreviousDate: jest.fn((date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }),
  getNextDate: jest.fn((date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }),
  canGoToNextDate: jest.fn(() => true),
  canGoToPreviousDate: jest.fn(() => true),
}));

describe('SwipeableJournalContainer', () => {
  const defaultProps = {
    currentDate: '2026-01-29',
    onDateChange: jest.fn(),
    children: <Text>Journal Content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <SwipeableJournalContainer {...defaultProps} />
      );

      expect(getByText('Journal Content')).toBeTruthy();
    });

    it('should wrap children in gesture detector', () => {
      const { getByTestId } = render(
        <SwipeableJournalContainer {...defaultProps} />
      );

      expect(getByTestId('gesture-detector')).toBeTruthy();
    });

    it('should render with custom testID', () => {
      const { getByTestId } = render(
        <SwipeableJournalContainer {...defaultProps} testID="swipeable" />
      );

      expect(getByTestId('swipeable')).toBeTruthy();
    });
  });
});
