import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as Contacts from 'expo-contacts';
import { useContacts } from './useContacts';

// Mock expo-contacts
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  presentContactPickerAsync: jest.fn(),
}));

describe('useContacts', () => {
  const mockContact = {
    id: 'contact-123',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    imageAvailable: true,
    image: { uri: 'file://contact-photo.jpg' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('permission handling', () => {
    it('should start with unknown permission status', () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });

      const { result } = renderHook(() => useContacts());

      expect(result.current.permissionStatus).toBe('undetermined');
    });

    it('should check permission on mount', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(Contacts.getPermissionsAsync).toHaveBeenCalled();
        expect(result.current.permissionStatus).toBe('granted');
      });
    });

    it('should request permission when requestPermission is called', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(Contacts.requestPermissionsAsync).toHaveBeenCalled();
      expect(result.current.permissionStatus).toBe('granted');
    });

    it('should handle denied permission', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.permissionStatus).toBe('denied');
    });
  });

  describe('contact picker', () => {
    it('should start with isPicking as false', () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useContacts());

      expect(result.current.isPicking).toBe(false);
    });

    it('should open picker and return selected contact', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockResolvedValue(mockContact);

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(Contacts.presentContactPickerAsync).toHaveBeenCalled();
      expect(selectedContact).toEqual({
        id: 'contact-123',
        name: 'John Doe',
        imageUri: 'file://contact-photo.jpg',
        birthday: null,
      });
    });

    it('should return null if no contact is selected (user cancelled)', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(selectedContact).toBeNull();
    });

    it('should request permission before picking if not granted', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockResolvedValue(mockContact);

      const { result } = renderHook(() => useContacts());

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(Contacts.requestPermissionsAsync).toHaveBeenCalled();
      expect(selectedContact).toBeTruthy();
    });

    it('should return null if permission is denied', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('denied');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(selectedContact).toBeNull();
    });

    it('should handle contact without image', async () => {
      const contactWithoutImage = {
        id: 'contact-456',
        name: 'Jane Smith',
        imageAvailable: false,
      };

      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockResolvedValue(contactWithoutImage);

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(selectedContact).toEqual({
        id: 'contact-456',
        name: 'Jane Smith',
        imageUri: null,
        birthday: null,
      });
    });

    it('should extract birthday from contact when available', async () => {
      const contactWithBirthday = {
        id: 'contact-789',
        name: 'Bob Wilson',
        imageAvailable: false,
        birthday: {
          day: 15,
          month: 9, // October (0-indexed)
          year: 1990,
        },
      };

      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockResolvedValue(contactWithBirthday);

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(selectedContact).toEqual({
        id: 'contact-789',
        name: 'Bob Wilson',
        imageUri: null,
        birthday: {
          day: 15,
          month: 9,
          year: 1990,
        },
      });
    });

    it('should handle birthday without year', async () => {
      const contactWithBirthdayNoYear = {
        id: 'contact-101',
        name: 'Alice Brown',
        imageAvailable: false,
        birthday: {
          day: 25,
          month: 11, // December (0-indexed)
        },
      };

      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockResolvedValue(contactWithBirthdayNoYear);

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      expect(selectedContact).toEqual({
        id: 'contact-101',
        name: 'Alice Brown',
        imageUri: null,
        birthday: {
          day: 25,
          month: 11,
          year: undefined,
        },
      });
    });

    it('should handle errors gracefully', async () => {
      (Contacts.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Contacts.presentContactPickerAsync as jest.Mock).mockRejectedValue(
        new Error('Picker failed')
      );

      const { result } = renderHook(() => useContacts());

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('granted');
      });

      let selectedContact;
      await act(async () => {
        selectedContact = await result.current.pickContact();
      });

      // Should return null on error, not throw
      expect(selectedContact).toBeNull();
      expect(result.current.isPicking).toBe(false);
    });
  });
});
