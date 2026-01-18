import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar } from '@/src/components/Avatar';
import { Friend } from '@/src/stores/friendsStore';
import { getDaysRemaining } from '@/src/utils';
import { colors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';

interface FriendCardProps {
  friend: Friend;
  onPress?: () => void;
}

type CheckInStatus = 'on-track' | 'due-soon' | 'due-today' | 'overdue';

function getCheckInStatus(daysRemaining: number): CheckInStatus {
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining === 0) return 'due-today';
  if (daysRemaining <= 3) return 'due-soon';
  return 'on-track';
}

function getStatusLabel(daysRemaining: number, status: CheckInStatus): string {
  if (status === 'overdue') return `${Math.abs(daysRemaining)} days overdue`;
  if (status === 'due-today') return 'Check in today';
  return `${daysRemaining} days`;
}

function getStatusColor(status: CheckInStatus): string {
  switch (status) {
    case 'overdue':
      return colors.feedbackError;
    case 'due-today':
    case 'due-soon':
      return colors.primary;
    case 'on-track':
      return colors.feedbackSuccess;
  }
}

function FriendCard({ friend, onPress }: FriendCardProps): React.ReactElement {
  const daysRemaining = getDaysRemaining(friend.lastContactAt, friend.frequencyDays);
  const status = getCheckInStatus(daysRemaining);
  const statusLabel = getStatusLabel(daysRemaining, status);
  const statusColor = getStatusColor(status);

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${friend.name}, ${statusLabel}`}
      accessibilityRole="button"
      style={styles.shadowWrapper}
    >
      <View style={styles.container}>
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
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surfaceCard,
    borderRadius: 16,
    overflow: 'hidden',
    gap: 12,
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
