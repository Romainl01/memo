import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar } from '@/src/components/Avatar';
import { Friend } from '@/src/stores/friendsStore';
import { colors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';

interface FriendCardProps {
  friend: Friend;
  onPress?: () => void;
}

type CheckInStatus = 'on-track' | 'due-soon' | 'due-today' | 'overdue';

interface CheckInInfo {
  status: CheckInStatus;
  label: string;
  daysRemaining: number;
}

/**
 * Calculates the check-in status based on last contact and frequency
 */
function getCheckInInfo(lastContactAt: string, frequencyDays: number): CheckInInfo {
  const lastContact = new Date(lastContactAt);
  const today = new Date();

  // Reset time to compare dates only
  lastContact.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysSinceContact = Math.floor(
    (today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysRemaining = frequencyDays - daysSinceContact;

  if (daysRemaining < 0) {
    return {
      status: 'overdue',
      label: `${Math.abs(daysRemaining)} days overdue`,
      daysRemaining,
    };
  }

  if (daysRemaining === 0) {
    return {
      status: 'due-today',
      label: 'Check in today',
      daysRemaining,
    };
  }

  if (daysRemaining <= 3) {
    return {
      status: 'due-soon',
      label: `${daysRemaining} days`,
      daysRemaining,
    };
  }

  return {
    status: 'on-track',
    label: `${daysRemaining} days`,
    daysRemaining,
  };
}

/**
 * Get the color for the status indicator
 */
function getStatusColor(status: CheckInStatus): string {
  switch (status) {
    case 'overdue':
      return colors.feedbackError;
    case 'due-today':
    case 'due-soon':
      return colors.primary; // Orange for attention
    case 'on-track':
    default:
      return colors.feedbackSuccess;
  }
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onPress }) => {
  const checkInInfo = getCheckInInfo(friend.lastContactAt, friend.frequencyDays);
  const statusColor = getStatusColor(checkInInfo.status);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={`${friend.name}, ${checkInInfo.label}`}
      accessibilityRole="button"
    >
      <Avatar
        name={friend.name}
        imageUri={friend.photoUrl ?? undefined}
        size={56}
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {friend.name}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {checkInInfo.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.neutralWhite,
    borderRadius: 16,
    gap: 12,
    // Subtle shadow
    shadowColor: colors.neutralDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.body1,
    color: colors.neutralDark,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
  },
});

export { FriendCard };
export type { FriendCardProps };
