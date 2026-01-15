import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { useNotificationPermission } from './useNotificationPermission';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

describe('useNotificationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with undetermined permission status', () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.permissionStatus).toBe('undetermined');
    });

    it('should not be loading initially', () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('permission checking', () => {
    it('should check permission on mount', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
        expect(result.current.permissionStatus).toBe('granted');
      });
    });

    it('should update status when permission is denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('denied');
      });
    });
  });

  describe('requestPermission', () => {
    it('should request permission when called', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(result.current.permissionStatus).toBe('granted');
    });

    it('should handle denied permission request', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.permissionStatus).toBe('denied');
    });

    it('should return true when permission is granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermission());

      let granted: boolean = false;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(true);
    });

    it('should return false when permission is denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useNotificationPermission());

      let granted: boolean = true;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(false);
    });

    it('should not request if permission already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      await act(async () => {
        await result.current.requestPermission();
      });

      // Should not call requestPermissionsAsync since already granted
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('should set isLoading during permission request', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });

      let resolveRequest: (value: unknown) => void;
      const requestPromise = new Promise((resolve) => {
        resolveRequest = resolve;
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockReturnValue(requestPromise);

      const { result } = renderHook(() => useNotificationPermission());

      // Start the request but don't await
      act(() => {
        result.current.requestPermission();
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      // Resolve the request
      await act(async () => {
        resolveRequest!({ status: 'granted' });
        await requestPromise;
      });

      // Should no longer be loading
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('helper properties', () => {
    it('should return isGranted true when permission is granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(result.current.isGranted).toBe(true);
      });
    });

    it('should return isGranted false when permission is denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(result.current.isGranted).toBe(false);
      });
    });

    it('should return isDenied true when permission is denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(result.current.isDenied).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('should handle permission check errors gracefully', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission check failed')
      );

      const { result } = renderHook(() => useNotificationPermission());

      // Should not throw, status should remain undetermined
      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('undetermined');
      });
    });

    it('should handle permission request errors gracefully', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Request failed')
      );

      const { result } = renderHook(() => useNotificationPermission());

      let granted: boolean = true;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      // Should return false on error
      expect(granted).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
