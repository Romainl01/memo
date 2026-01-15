import { useState, useEffect, useCallback, useRef } from 'react';
import * as Contacts from 'expo-contacts';

export type PermissionStatus = 'undetermined' | 'granted' | 'denied';

export interface ContactBirthday {
  day: number;
  month: number; // 0-indexed (January = 0)
  year?: number; // Optional - contact may not have year set
}

export interface SelectedContact {
  id: string;
  name: string;
  imageUri: string | null;
  birthday: ContactBirthday | null;
}

interface UseContactsReturn {
  permissionStatus: PermissionStatus;
  isPicking: boolean;
  requestPermission: () => Promise<boolean>;
  pickContact: () => Promise<SelectedContact | null>;
}

export function useContacts(): UseContactsReturn {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
  const [isPicking, setIsPicking] = useState(false);
  const isPickingRef = useRef(false);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Contacts.getPermissionsAsync();
    setPermissionStatus(status as PermissionStatus);
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Contacts.requestPermissionsAsync();
    setPermissionStatus(status as PermissionStatus);
    return status === 'granted';
  }, []);

  const pickContact = useCallback(async (): Promise<SelectedContact | null> => {
    if (isPickingRef.current) return null;

    try {
      isPickingRef.current = true;
      setIsPicking(true);

      if (permissionStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      const contact = await Contacts.presentContactPickerAsync();

      if (!contact) return null;

      // Extract birthday if available
      let birthday: ContactBirthday | null = null;
      if (contact.birthday) {
        birthday = {
          day: contact.birthday.day,
          month: contact.birthday.month,
          year: contact.birthday.year ?? undefined,
        };
      }

      return {
        id: contact.id,
        name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown',
        imageUri: contact.imageAvailable && contact.image?.uri ? contact.image.uri : null,
        birthday,
      };
    } catch {
      return null;
    } finally {
      isPickingRef.current = false;
      setIsPicking(false);
    }
  }, [permissionStatus, requestPermission]);

  return {
    permissionStatus,
    isPicking,
    requestPermission,
    pickContact,
  };
}
