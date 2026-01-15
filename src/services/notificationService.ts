import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Friend } from '@/src/stores/friendsStore';

// Types
interface FriendForNotification {
  id?: string;
  name: string;
  birthday?: string;
  lastContactAt?: string;
  frequencyDays?: number | null;
}

// ============================================
// Formatting Functions
// ============================================

/**
 * Format birthday notification title
 * - 1 friend: "It's John's birthday 🎉"
 * - 2 friends: "It's John and Jane's birthday 🎉"
 * - 3+ friends: "It's John, Jane and X others' birthday 🎉"
 */
export function formatBirthdayTitle(friends: FriendForNotification[]): string {
  if (friends.length === 0) return '';

  const getFirstName = (name: string) => name.split(' ')[0];

  if (friends.length === 1) {
    return `It's ${getFirstName(friends[0].name)}'s birthday 🎉`;
  }

  if (friends.length === 2) {
    return `It's ${getFirstName(friends[0].name)} and ${getFirstName(friends[1].name)}'s birthday 🎉`;
  }

  // 3+ friends: show first 2 names + "and X others"
  const othersCount = friends.length - 2;
  const othersText = othersCount === 1 ? "1 other's" : `${othersCount} others'`;
  return `It's ${getFirstName(friends[0].name)}, ${getFirstName(friends[1].name)} and ${othersText} birthday 🎉`;
}

/**
 * Format birthday notification body
 */
export function formatBirthdayBody(): string {
  return 'Send wishes, make their day!';
}

/**
 * Format catch-up notification title
 */
export function formatCatchUpTitle(friend: FriendForNotification): string {
  return `Catch'up with ${friend.name}`;
}

/**
 * Format catch-up notification body
 */
export function formatCatchUpBody(daysSinceLastContact: number): string {
  if (daysSinceLastContact === 0) {
    return 'You last checked in today';
  }
  const dayWord = daysSinceLastContact === 1 ? 'day' : 'days';
  return `You last checked in ${daysSinceLastContact} ${dayWord} ago`;
}

// ============================================
// Date Helper Functions
// ============================================

/**
 * Check if a birthday is today
 * Handles leap year: Feb 29 birthdays show on Feb 28 in non-leap years
 */
export function isBirthdayToday(birthday: string | null | undefined): boolean {
  if (!birthday) return false;

  const today = new Date();
  return isBirthdayOnDate(birthday, today);
}

/**
 * Check if a birthday falls on a specific date
 * Handles leap year: Feb 29 birthdays show on Feb 28 in non-leap years
 */
export function isBirthdayOnDate(birthday: string | null | undefined, date: Date): boolean {
  if (!birthday) return false;

  const todayMonth = date.getMonth() + 1; // 1-12
  const todayDay = date.getDate();
  const isLeapYear = isLeapYearDate(date);

  // Parse birthday - supports both "YYYY-MM-DD" and "MM-DD" formats
  let birthMonth: number;
  let birthDay: number;

  if (birthday.length <= 5) {
    // MM-DD format
    const [mm, dd] = birthday.split('-').map(Number);
    birthMonth = mm;
    birthDay = dd;
  } else {
    // YYYY-MM-DD format
    const parts = birthday.split('-').map(Number);
    birthMonth = parts[1];
    birthDay = parts[2];
  }

  // Handle leap year birthday (Feb 29)
  if (birthMonth === 2 && birthDay === 29) {
    if (isLeapYear) {
      // In leap year, show on Feb 29
      return todayMonth === 2 && todayDay === 29;
    } else {
      // In non-leap year, show on Feb 28
      return todayMonth === 2 && todayDay === 28;
    }
  }

  return todayMonth === birthMonth && todayDay === birthDay;
}

/**
 * Check if a date is in a leap year
 */
function isLeapYearDate(date: Date): boolean {
  const year = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get a random time within a window (e.g., 9-10 AM) for tomorrow
 */
export function getRandomTimeInWindow(startHour: number, endHour: number): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Random minute within the hour
  const randomMinute = Math.floor(Math.random() * 60);

  tomorrow.setHours(startHour, randomMinute, 0, 0);
  return tomorrow;
}

/**
 * Calculate days since last contact
 */
export function getDaysSinceLastContact(lastContactAt: string): number {
  const lastContact = new Date(lastContactAt);
  const today = new Date();

  // Reset time to midnight for accurate day comparison
  lastContact.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastContact.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// ============================================
// Notification Service
// ============================================

export const NotificationService = {
  /**
   * Initialize the notification service
   * Sets up handlers and creates Android channel
   */
  async initialize(): Promise<void> {
    // Set how notifications are handled when app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowInForeground: true,
      }),
    });

    // Create Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  },

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllScheduled(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  /**
   * Schedule a birthday notification
   */
  async scheduleBirthdayNotification(
    friends: FriendForNotification[],
    triggerDate: Date
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: formatBirthdayTitle(friends),
        body: formatBirthdayBody(),
        data: {
          type: 'birthday',
          friendIds: friends.map((f) => f.id),
        },
      },
      trigger: triggerDate,
    });
  },

  /**
   * Schedule a catch-up notification
   */
  async scheduleCatchUpNotification(
    friend: FriendForNotification,
    triggerDate: Date
  ): Promise<string> {
    const daysSince = getDaysSinceLastContact(friend.lastContactAt!);

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: formatCatchUpTitle(friend),
        body: formatCatchUpBody(daysSince),
        data: {
          type: 'catchup',
          friendId: friend.id,
        },
      },
      trigger: triggerDate,
    });
  },

  /**
   * Check if a friend is due for catch-up (based on frequency and last contact)
   */
  isFriendDueForCatchUp(friend: Friend): boolean {
    if (!friend.frequencyDays || !friend.lastContactAt) return false;

    const daysSince = getDaysSinceLastContact(friend.lastContactAt);
    return daysSince >= friend.frequencyDays;
  },

  /**
   * Schedule all notifications for tomorrow based on friends list
   * - Birthday notifications are grouped
   * - Catch-up notifications are individual and staggered
   * - If friend has birthday, skip their catch-up notification
   */
  async scheduleAllNotifications(
    friends: Friend[],
    shouldSendBirthdayNotification: () => boolean,
    shouldSendCatchUpNotification: (friendId: string, frequencyDays: number) => boolean
  ): Promise<void> {
    // Cancel all existing scheduled notifications first
    await this.cancelAllScheduled();

    if (friends.length === 0) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find friends with birthdays tomorrow
    const birthdayFriends = friends.filter((f) => f.birthday && isBirthdayOnDate(f.birthday, tomorrow));

    // Find friends due for catch-up (excluding those with birthdays tomorrow)
    const birthdayFriendIds = new Set(birthdayFriends.map((f) => f.id));
    const catchUpFriends = friends.filter((f) => {
      // Skip if this friend has a birthday tomorrow
      if (birthdayFriendIds.has(f.id)) return false;

      // Skip if no frequency set
      if (!f.frequencyDays) return false;

      // Check if due based on last contact
      if (!this.isFriendDueForCatchUp(f)) return false;

      // Check if we should send (not recently notified)
      return shouldSendCatchUpNotification(f.id, f.frequencyDays);
    });

    // Schedule birthday notification (grouped)
    if (birthdayFriends.length > 0 && shouldSendBirthdayNotification()) {
      const birthdayTime = getRandomTimeInWindow(9, 10);
      await this.scheduleBirthdayNotification(birthdayFriends, birthdayTime);
    }

    // Schedule catch-up notifications (individual, staggered)
    for (let i = 0; i < catchUpFriends.length; i++) {
      const friend = catchUpFriends[i];
      // Stagger times randomly within the 9-10 AM window
      const catchUpTime = getRandomTimeInWindow(9, 10);
      await this.scheduleCatchUpNotification(friend, catchUpTime);
    }
  },

  /**
   * Add response listener for when user taps notification
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
