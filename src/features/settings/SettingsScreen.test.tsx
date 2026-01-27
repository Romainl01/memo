import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { SettingsScreen } from './SettingsScreen';

// Mock expo-symbols
jest.mock('expo-symbols', () => ({
  SymbolView: ({ name, testID }: { name: string; testID?: string }) => {
    const { View } = require('react-native');
    return <View testID={testID || `symbol-${name}`} />;
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.0.0',
    },
  },
}));

// Mock useNotificationPermission hook
const mockRequestPermission = jest.fn();
jest.mock('@/src/hooks/useNotificationPermission', () => ({
  useNotificationPermission: () => ({
    permissionStatus: 'undetermined',
    isGranted: false,
    isDenied: false,
    isLoading: false,
    requestPermission: mockRequestPermission,
  }),
}));

// Mock notification state store
const mockSetNotificationsEnabled = jest.fn();
jest.mock('@/src/stores/notificationStateStore', () => ({
  useNotificationStateStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      notificationsEnabled: true,
      setNotificationsEnabled: mockSetNotificationsEnabled,
    }),
}));

// Mock Linking
jest.spyOn(Linking, 'openSettings').mockImplementation(() => Promise.resolve());

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Section Headers ---
  it('should render the Notifications section header', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('NOTIFICATIONS')).toBeTruthy();
  });

  it('should render the About section header', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('ABOUT')).toBeTruthy();
  });

  // --- Notification Toggle ---
  it('should render the Push Notifications toggle', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Push Notifications')).toBeTruthy();
  });

  // --- About Section ---
  it('should render the Version row with app version', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Version')).toBeTruthy();
    expect(getByText('1.0.0')).toBeTruthy();
  });

  // --- Toggle off behavior ---
  it('should disable at app level when toggling off (not open OS settings)', () => {
    // Set up as granted so toggle is on
    const hook = require('@/src/hooks/useNotificationPermission');
    hook.useNotificationPermission = () => ({
      permissionStatus: 'granted',
      isGranted: true,
      isDenied: false,
      isLoading: false,
      requestPermission: mockRequestPermission,
    });

    const { getByRole } = render(<SettingsScreen />);

    // Toggle off
    fireEvent(getByRole('switch'), 'valueChange', false);

    expect(mockSetNotificationsEnabled).toHaveBeenCalledWith(false);
    expect(Linking.openSettings).not.toHaveBeenCalled();
  });

  // --- Toggle on when already granted ---
  it('should re-enable at app level without requesting OS permission', () => {
    const hook = require('@/src/hooks/useNotificationPermission');
    hook.useNotificationPermission = () => ({
      permissionStatus: 'granted',
      isGranted: true,
      isDenied: false,
      isLoading: false,
      requestPermission: mockRequestPermission,
    });

    // Simulate notificationsEnabled = false (user previously toggled off)
    const store = require('@/src/stores/notificationStateStore');
    store.useNotificationStateStore = (selector: (s: Record<string, unknown>) => unknown) =>
      selector({
        notificationsEnabled: false,
        setNotificationsEnabled: mockSetNotificationsEnabled,
      });

    const { getByRole } = render(<SettingsScreen />);
    fireEvent(getByRole('switch'), 'valueChange', true);

    expect(mockSetNotificationsEnabled).toHaveBeenCalledWith(true);
    expect(mockRequestPermission).not.toHaveBeenCalled();
  });

  // --- Notification Permission States ---
  describe('when notifications are granted', () => {
    beforeEach(() => {
      const hook = require('@/src/hooks/useNotificationPermission');
      hook.useNotificationPermission = () => ({
        permissionStatus: 'granted',
        isGranted: true,
        isDenied: false,
        isLoading: false,
        requestPermission: mockRequestPermission,
      });

      // Reset store mock (may have been overridden by previous tests)
      const store = require('@/src/stores/notificationStateStore');
      store.useNotificationStateStore = (selector: (s: Record<string, unknown>) => unknown) =>
        selector({
          notificationsEnabled: true,
          setNotificationsEnabled: mockSetNotificationsEnabled,
        });
    });

    it('should show toggle as on', () => {
      const { getByRole } = render(<SettingsScreen />);
      expect(getByRole('switch').props.value).toBe(true);
    });
  });

  describe('when notifications are denied', () => {
    beforeEach(() => {
      const hook = require('@/src/hooks/useNotificationPermission');
      hook.useNotificationPermission = () => ({
        permissionStatus: 'denied',
        isGranted: false,
        isDenied: true,
        isLoading: false,
        requestPermission: mockRequestPermission,
      });
    });

    it('should show toggle as off', () => {
      const { getByRole } = render(<SettingsScreen />);
      expect(getByRole('switch').props.value).toBe(false);
    });

    it('should show denied status text', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Denied — tap to open Settings')).toBeTruthy();
    });

    it('should open OS settings when denied row is tapped', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('Denied — tap to open Settings'));
      expect(Linking.openSettings).toHaveBeenCalled();
    });
  });
});
