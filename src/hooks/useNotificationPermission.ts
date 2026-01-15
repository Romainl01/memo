import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface UseNotificationPermissionResult {
  permissionStatus: PermissionStatus;
  isLoading: boolean;
  isGranted: boolean;
  isDenied: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useNotificationPermission(): UseNotificationPermissionResult {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(false);

  // Check current permission status on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status as PermissionStatus);
      } catch {
        // Keep undetermined on error
      }
    };

    checkPermission();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    // If already granted, no need to request
    if (permissionStatus === 'granted') {
      return true;
    }

    setIsLoading(true);

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status as PermissionStatus);
      return status === 'granted';
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [permissionStatus]);

  return {
    permissionStatus,
    isLoading,
    isGranted: permissionStatus === 'granted',
    isDenied: permissionStatus === 'denied',
    requestPermission,
  };
}
