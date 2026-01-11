import React from 'react';
import { render } from '@testing-library/react-native';
import { FriendCard } from './FriendCard';
import { Friend } from '@/src/stores/friendsStore';

describe('FriendCard', () => {
  const baseFriend: Friend = {
    id: 'friend-123',
    name: 'John Doe',
    photoUrl: 'https://example.com/photo.jpg',
    birthday: '1992-12-15',
    frequencyDays: 14,
    lastContactAt: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date().toISOString(),
  };

  describe('rendering', () => {
    it('should render the friend name', () => {
      const { getByText } = render(<FriendCard friend={baseFriend} />);
      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should render the avatar', () => {
      const { getByTestId } = render(<FriendCard friend={baseFriend} />);
      expect(getByTestId('avatar-container')).toBeTruthy();
    });

    it('should render avatar with initials when no photo', () => {
      const friendWithoutPhoto = { ...baseFriend, photoUrl: null };
      const { getByText } = render(<FriendCard friend={friendWithoutPhoto} />);
      expect(getByText('JD')).toBeTruthy();
    });
  });

  describe('check-in status', () => {
    it('should show "on track" status when recently contacted', () => {
      const recentlyContactedFriend = {
        ...baseFriend,
        lastContactAt: new Date().toISOString().split('T')[0], // Today
        frequencyDays: 14,
      };

      const { getByText } = render(<FriendCard friend={recentlyContactedFriend} />);
      // Should show days remaining (14 days for this case)
      expect(getByText(/14 days/i)).toBeTruthy();
    });

    it('should show "due soon" when approaching check-in date', () => {
      const daysAgo = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
      };

      const dueSoonFriend = {
        ...baseFriend,
        lastContactAt: daysAgo(12), // 12 days ago with 14 day frequency = 2 days left
        frequencyDays: 14,
      };

      const { getByText } = render(<FriendCard friend={dueSoonFriend} />);
      expect(getByText(/2 days/i)).toBeTruthy();
    });

    it('should show "overdue" when past check-in date', () => {
      const daysAgo = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
      };

      const overdueFriend = {
        ...baseFriend,
        lastContactAt: daysAgo(20), // 20 days ago with 14 day frequency = 6 days overdue
        frequencyDays: 14,
      };

      const { getByText } = render(<FriendCard friend={overdueFriend} />);
      expect(getByText(/overdue/i)).toBeTruthy();
    });

    it('should show "today" when check-in is due today', () => {
      const daysAgo = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
      };

      const dueTodayFriend = {
        ...baseFriend,
        lastContactAt: daysAgo(14), // Exactly 14 days ago with 14 day frequency
        frequencyDays: 14,
      };

      const { getByText } = render(<FriendCard friend={dueTodayFriend} />);
      expect(getByText(/today/i)).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have accessible label with friend name and status', () => {
      const { getByRole } = render(<FriendCard friend={baseFriend} />);
      // The card is a button with the full label
      const card = getByRole('button');
      expect(card.props.accessibilityLabel).toContain('John Doe');
    });
  });
});
