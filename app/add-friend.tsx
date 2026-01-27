import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Avatar } from '@/src/components/Avatar';
import { SettingsRow } from '@/src/components/SettingsRow';
import { BirthdayWheelPicker } from '@/src/components/BirthdayWheelPicker';
import type { BirthdayValue } from '@/src/components/BirthdayWheelPicker';
import { GlassMenu } from '@/src/components/GlassMenu';
import { useFriendsStore } from '@/src/stores/friendsStore';
import type { FriendCategory } from '@/src/stores/friendsStore';
import { useNotificationStateStore } from '@/src/stores/notificationStateStore';
import { colors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';
import type { ContactBirthday } from '@/src/hooks/useContacts';

const BUTTON_SIZE = 44;

type FrequencyOption = 7 | 14 | 30 | 90 | null;

const CATEGORY_LABELS: Record<FriendCategory, string> = {
  friend: 'Friend',
  family: 'Family',
  work: 'Work',
  partner: 'Partner',
  flirt: 'Flirt',
};

const CATEGORY_MENU_ITEMS = [
  { label: 'Friend', value: 'friend' as FriendCategory },
  { label: 'Family', value: 'family' as FriendCategory },
  { label: 'Work', value: 'work' as FriendCategory },
  { label: 'Partner', value: 'partner' as FriendCategory },
  { label: 'Flirt', value: 'flirt' as FriendCategory },
];

const FREQUENCY_LABELS: Record<number, string> = {
  7: 'Weekly',
  14: 'Bi-weekly',
  30: 'Monthly',
  90: 'Quarterly',
};

const FREQUENCY_MENU_ITEMS = [
  { label: 'Weekly', value: 7 as FrequencyOption },
  { label: 'Bi-weekly', value: 14 as FrequencyOption },
  { label: 'Monthly', value: 30 as FrequencyOption },
  { label: 'Quarterly', value: 90 as FrequencyOption },
  { label: 'None', value: null as FrequencyOption },
];

/**
 * Formats a BirthdayValue for display
 * Shows year if available: "Oct 20, 1995", otherwise "Oct 20"
 */
function formatBirthdayValue(value: BirthdayValue | null): string {
  if (!value) return 'Pick a date';

  const date = new Date(2000, value.month, value.day);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  if (value.year) {
    return `${month} ${value.day}, ${value.year}`;
  }
  return `${month} ${value.day}`;
}

/**
 * Formats a date for display: "Jan 15, 2025"
 */
function formatDate(date: Date | null): string {
  if (!date) return 'Pick a date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Converts ContactBirthday to BirthdayValue
 */
function contactBirthdayToValue(birthday: ContactBirthday): BirthdayValue {
  return {
    day: birthday.day,
    month: birthday.month,
    year: birthday.year,
  };
}

export default function AddFriendScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const pendingContact = useFriendsStore((state) => state.pendingContact);
  const setPendingContact = useFriendsStore((state) => state.setPendingContact);
  const addFriend = useFriendsStore((state) => state.addFriend);
  const friendsCount = useFriendsStore((state) => state.friends.length);

  const { hasRequestedPermission, setHasRequestedPermission, setPendingPermissionRequest } = useNotificationStateStore();

  // Form state
  const [birthday, setBirthday] = useState<BirthdayValue | null>(null);
  const [lastCatchUp, setLastCatchUp] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState<FrequencyOption>(7); // Default: Weekly
  const [category, setCategory] = useState<FriendCategory>('friend');

  // Picker visibility
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showLastCatchUpPicker, setShowLastCatchUpPicker] = useState(false);

  // Menu state
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFrequencyMenu, setShowFrequencyMenu] = useState(false);

  // Pre-fill birthday from contact if available
  useEffect(() => {
    if (pendingContact?.birthday) {
      setBirthday(contactBirthdayToValue(pendingContact.birthday));
    }
  }, [pendingContact]);

  const isFormValid = birthday !== null && lastCatchUp !== null && frequency !== null;

  const handleSave = useCallback(() => {
    if (!pendingContact || !isFormValid) return;

    // Check if this is the first friend (before adding)
    const isFirstFriend = friendsCount === 0;

    // Success haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Format birthday as YYYY-MM-DD (with year) or MM-DD (without year)
    // birthday is guaranteed non-null here because isFormValid checks it
    const mm = String(birthday.month + 1).padStart(2, '0');
    const dd = String(birthday.day).padStart(2, '0');
    const birthdayString = birthday.year
      ? `${birthday.year}-${mm}-${dd}`
      : `${mm}-${dd}`;

    addFriend({
      name: pendingContact.name,
      photoUrl: pendingContact.imageUri,
      birthday: birthdayString,
      frequencyDays: frequency!,
      lastContactAt: lastCatchUp!.toISOString().split('T')[0],
      category,
    });

    // Schedule notification permission request after sheet closes (first friend only)
    if (isFirstFriend && !hasRequestedPermission) {
      setHasRequestedPermission(true);
      setPendingPermissionRequest(true);
    }

    setPendingContact(null);
    router.back();
  }, [
    pendingContact,
    birthday,
    lastCatchUp,
    frequency,
    category,
    addFriend,
    setPendingContact,
    friendsCount,
    hasRequestedPermission,
    setHasRequestedPermission,
    setPendingPermissionRequest,
  ]);

  const handleBirthdayChange = useCallback((value: BirthdayValue) => {
    setBirthday(value);
  }, []);

  const handleLastCatchUpConfirm = useCallback((selectedDate: Date) => {
    setLastCatchUp(selectedDate);
    setShowLastCatchUpPicker(false);
  }, []);

  const handleLastCatchUpCancel = useCallback(() => {
    setShowLastCatchUpPicker(false);
  }, []);

  const handleCategoryPress = useCallback(() => {
    setShowCategoryMenu(true);
  }, []);

  const handleCategorySelect = useCallback((value: FriendCategory) => {
    setCategory(value);
  }, []);

  const handleFrequencyPress = useCallback(() => {
    setShowFrequencyMenu(true);
  }, []);

  const handleFrequencySelect = useCallback((value: FrequencyOption) => {
    setFrequency(value);
  }, []);

  if (!pendingContact) {
    return (
      <View>
        <Text style={styles.emptyText}>No contact selected</Text>
      </View>
    );
  }

  const birthdayDisplayValue = formatBirthdayValue(birthday);
  const lastCatchUpDisplayValue = formatDate(lastCatchUp);
  const frequencyDisplayValue = frequency ? FREQUENCY_LABELS[frequency] : 'None';

  return (
    <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      {/* Header with save button */}
      <View style={[styles.header, { paddingTop: 16, paddingRight: 16 }]}>
        <View style={styles.headerSpacer} />
        <Pressable
          onPress={handleSave}
          disabled={!isFormValid}
          style={styles.saveButton}
          testID="save-button"
        >
          <GlassView
            style={[styles.glassButton, !isFormValid && styles.glassButtonDisabled]}
            tintColor={isFormValid ? colors.primary : undefined}
            glassEffectStyle="clear"
          >
            <SymbolView
              name="checkmark"
              size={18}
              weight="semibold"
              tintColor={isFormValid ? colors.neutralWhite : colors.neutralGray300}
            />
          </GlassView>
        </Pressable>
      </View>

      {/* Contact info */}
      <View style={styles.contactSection}>
        <Avatar
          name={pendingContact.name}
          imageUri={pendingContact.imageUri ?? undefined}
          size={72}
        />
        <Text style={styles.contactName}>{pendingContact.name}</Text>
      </View>

      {/* Settings rows */}
      <View style={styles.settingsSection}>
        {/* Category row with dropdown menu */}
        <View style={styles.categoryContainer}>
          <SettingsRow
            icon="person.2"
            label="Category"
            value={CATEGORY_LABELS[category]}
            onPress={handleCategoryPress}
            chevronType="dropdown"
            testID="category-row"
          />
          <GlassMenu
            visible={showCategoryMenu}
            onClose={() => setShowCategoryMenu(false)}
            items={CATEGORY_MENU_ITEMS}
            selectedValue={category}
            onSelect={handleCategorySelect}
            testID="category-menu"
          />
        </View>

        <SettingsRow
          icon="gift"
          label="Birthday"
          value={birthdayDisplayValue}
          onPress={() => {
            if (!birthday) {
              // Initialize with today's date when first opening
              const now = new Date();
              setBirthday({ day: now.getDate(), month: now.getMonth(), year: undefined });
            }
            setShowBirthdayPicker(true);
          }}
          chevronType="expand"
          hasValue={birthday !== null}
          testID="birthday-row"
        />

        <SettingsRow
          icon="calendar"
          label="Last catch-up"
          value={lastCatchUpDisplayValue}
          onPress={() => setShowLastCatchUpPicker(true)}
          chevronType="expand"
          hasValue={lastCatchUp !== null}
          testID="last-catchup-row"
        />

        {/* Frequency row with dropdown menu */}
        <View style={styles.frequencyContainer}>
          <SettingsRow
            icon="arrow.trianglehead.2.clockwise"
            label="Frequency"
            value={frequencyDisplayValue}
            onPress={handleFrequencyPress}
            chevronType="dropdown"
            testID="frequency-row"
          />
          <GlassMenu
            visible={showFrequencyMenu}
            onClose={() => setShowFrequencyMenu(false)}
            items={FREQUENCY_MENU_ITEMS}
            selectedValue={frequency}
            onSelect={handleFrequencySelect}
            testID="frequency-menu"
          />
        </View>
      </View>

      {/* Birthday wheel picker modal */}
      <BirthdayWheelPicker
        visible={showBirthdayPicker}
        value={birthday ?? { day: 1, month: 0 }}
        onChange={handleBirthdayChange}
        onDone={() => setShowBirthdayPicker(false)}
      />

      {/* Last catch-up date picker modal */}
      <DateTimePickerModal
        testID="last-catchup-picker"
        isVisible={showLastCatchUpPicker}
        mode="date"
        display="inline"
        date={lastCatchUp ?? new Date()}
        maximumDate={new Date()}
        onConfirm={handleLastCatchUpConfirm}
        onCancel={handleLastCatchUpCancel}
        accentColor={colors.primary}
        buttonTextColorIOS={colors.primary}
        modalStyleIOS={styles.datePickerModal}
        customConfirmButtonIOS={({ onPress, label }) => (
          <Pressable onPress={onPress} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>{label}</Text>
          </Pressable>
        )}
        customCancelButtonIOS={() => null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
  },
  headerSpacer: {
    width: BUTTON_SIZE,
  },
  saveButton: {
    zIndex: 1,
  },
  glassButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassButtonDisabled: {
    opacity: 0.5,
  },
  contactSection: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  contactName: {
    fontFamily: 'CrimsonPro_500Medium',
    fontSize: 32,
    color: colors.neutralDark,
    textAlign: 'center',
  },
  categoryContainer: {
    position: 'relative',
    zIndex: 101,
  },
  settingsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  frequencyContainer: {
    position: 'relative',
    zIndex: 100,
  },
  emptyText: {
    ...typography.body1,
    color: colors.neutralGray,
    textAlign: 'center',
    marginTop: 100,
  },
  datePickerModal: {
    marginBottom: 40,
  },
  confirmButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutralGray200,
  },
  confirmButtonText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
  },
});
