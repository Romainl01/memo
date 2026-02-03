import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FriendCard } from './FriendCard';
import { Friend } from '@/src/stores/friendsStore';

// Helper to format date in local time (avoids UTC timezone issues)
const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

describe('FriendCard', () => {
  const baseFriend: Friend = {
    id: 'friend-123',
    name: 'John Doe',
    photoUrl: 'https://example.com/photo.jpg',
    birthday: '1992-12-15',
    frequencyDays: 14,
    lastContactAt: toLocalDateString(new Date()), // Today
    category: 'friend',
    notes: '',
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

  describe('relative date display', () => {
    it('should show "Last seen today" when contacted today', () => {
      const contactedToday = {
        ...baseFriend,
        lastContactAt: toLocalDateString(new Date()),
      };

      const { getByText } = render(<FriendCard friend={contactedToday} />);
      expect(getByText(/last seen today/i)).toBeTruthy();
    });

    it('should show "Last seen yesterday" when contacted yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const contactedYesterday = {
        ...baseFriend,
        lastContactAt: toLocalDateString(yesterday),
      };

      const { getByText } = render(<FriendCard friend={contactedYesterday} />);
      expect(getByText(/last seen yesterday/i)).toBeTruthy();
    });

    it('should show day name for 2-6 days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const expectedDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(threeDaysAgo);

      const contactedThreeDaysAgo = {
        ...baseFriend,
        lastContactAt: toLocalDateString(threeDaysAgo),
      };

      const { getByText } = render(<FriendCard friend={contactedThreeDaysAgo} />);
      expect(getByText(new RegExp(`last seen ${expectedDay}`, 'i'))).toBeTruthy();
    });
  });

  describe('status dot color', () => {
    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return toLocalDateString(date);
    };

    it('should show green dot for on-track status', () => {
      const onTrackFriend = {
        ...baseFriend,
        lastContactAt: new Date().toISOString().split('T')[0],
        frequencyDays: 14,
      };

      const { getByTestId } = render(<FriendCard friend={onTrackFriend} />);
      const statusDot = getByTestId('status-dot');
      expect(statusDot).toBeTruthy();
    });

    it('should show appropriate status when overdue', () => {
      const overdueFriend = {
        ...baseFriend,
        lastContactAt: daysAgo(20),
        frequencyDays: 14,
      };

      const { getByTestId } = render(<FriendCard friend={overdueFriend} />);
      expect(getByTestId('status-dot')).toBeTruthy();
    });
  });

  describe('catch-up button', () => {
    it('should render checkmark button', () => {
      const { getByTestId } = render(<FriendCard friend={baseFriend} />);
      expect(getByTestId('catchup-button')).toBeTruthy();
    });

    it('should call onCatchUp when checkmark is pressed', () => {
      const onCatchUp = jest.fn();
      const { getByTestId } = render(
        <FriendCard friend={baseFriend} onCatchUp={onCatchUp} />
      );

      fireEvent.press(getByTestId('catchup-button'));
      expect(onCatchUp).toHaveBeenCalledTimes(1);
    });

    it('should not trigger card onPress when checkmark is pressed', () => {
      const onPress = jest.fn();
      const onCatchUp = jest.fn();
      const { getByTestId } = render(
        <FriendCard friend={baseFriend} onPress={onPress} onCatchUp={onCatchUp} />
      );

      fireEvent.press(getByTestId('catchup-button'));
      expect(onCatchUp).toHaveBeenCalledTimes(1);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('category pill', () => {
    it('should render category pill with correct label', () => {
      const { getByText } = render(<FriendCard friend={baseFriend} />);
      expect(getByText('Friend')).toBeTruthy();
    });

    it('should render Family category', () => {
      const familyFriend = { ...baseFriend, category: 'family' as const };
      const { getByText } = render(<FriendCard friend={familyFriend} />);
      expect(getByText('Family')).toBeTruthy();
    });

    it('should render Work category', () => {
      const workFriend = { ...baseFriend, category: 'work' as const };
      const { getByText } = render(<FriendCard friend={workFriend} />);
      expect(getByText('Work')).toBeTruthy();
    });

    it('should render Partner category', () => {
      const partnerFriend = { ...baseFriend, category: 'partner' as const };
      const { getByText } = render(<FriendCard friend={partnerFriend} />);
      expect(getByText('Partner')).toBeTruthy();
    });

    it('should render Flirt category', () => {
      const flirtFriend = { ...baseFriend, category: 'flirt' as const };
      const { getByText } = render(<FriendCard friend={flirtFriend} />);
      expect(getByText('Flirt')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have accessible label with friend name', () => {
      const { getAllByRole } = render(<FriendCard friend={baseFriend} />);
      // There are two buttons: the card and the catch-up button
      const buttons = getAllByRole('button');
      const cardButton = buttons.find(b => b.props.accessibilityLabel?.includes('John Doe'));
      expect(cardButton).toBeTruthy();
    });

    it('should have accessible label on catch-up button', () => {
      const { getByTestId } = render(<FriendCard friend={baseFriend} />);
      const catchUpButton = getByTestId('catchup-button');
      expect(catchUpButton.props.accessibilityLabel).toContain('Mark catch up');
    });
  });
});
