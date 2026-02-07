import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OnboardingScreen } from './OnboardingScreen';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import * as Haptics from 'expo-haptics';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    back: jest.fn(),
    navigate: jest.fn(),
  }),
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({
      hasCompletedOnboarding: false,
      _hasHydrated: true,
    });
  });

  it('should render the onboarding page', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(getByTestId('onboarding-page')).toBeTruthy();
  });

  it('should render the welcome title', () => {
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('meet memo')).toBeTruthy();
  });

  it('should render the welcome subtitle', () => {
    const { getByText } = render(<OnboardingScreen />);
    expect(
      getByText(/Stay close to the people who matter/)
    ).toBeTruthy();
  });

  it('should render the logo', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(getByTestId('onboarding-logo')).toBeTruthy();
  });

  it('should render the Apple sign-in button', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(getByTestId('apple-sign-in-button')).toBeTruthy();
  });

  it('should render the replay button', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(getByTestId('replay-button')).toBeTruthy();
  });

  it('should trigger haptic feedback when replay is pressed', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    fireEvent.press(getByTestId('replay-button'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('should render terms and privacy text', () => {
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText(/Terms of Service/)).toBeTruthy();
    expect(getByText(/Privacy Policy/)).toBeTruthy();
  });

  it('should complete onboarding and navigate when Apple button is pressed', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    fireEvent.press(getByTestId('apple-sign-in-button'));

    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/friends');
  });
});
