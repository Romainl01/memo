import React from 'react';
import { render } from '@testing-library/react-native';
import { FriendsList } from './FriendsList';
import { useFriendsStore } from '@/src/stores/friendsStore';

describe('FriendsList', () => {
  beforeEach(() => {
    useFriendsStore.setState({ friends: [] });
  });

  describe('empty state', () => {
    it('should render empty message when no friends', () => {
      const { getByText } = render(<FriendsList />);
      expect(getByText(/no friends yet/i)).toBeTruthy();
    });
  });

  describe('with friends', () => {
    const today = new Date().toISOString().split('T')[0];

    beforeEach(() => {
      useFriendsStore.setState({
        friends: [
          {
            id: '1',
            name: 'Alice Smith',
            photoUrl: null,
            birthday: '1990-01-01',
            frequencyDays: 7,
            lastContactAt: today,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Bob Johnson',
            photoUrl: 'https://example.com/bob.jpg',
            birthday: '1985-06-15',
            frequencyDays: 14,
            lastContactAt: today,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    });

    it('should render all friends', () => {
      const { getByText } = render(<FriendsList />);
      expect(getByText('Alice Smith')).toBeTruthy();
      expect(getByText('Bob Johnson')).toBeTruthy();
    });

    it('should not render empty message', () => {
      const { queryByText } = render(<FriendsList />);
      expect(queryByText(/no friends yet/i)).toBeNull();
    });
  });

  describe('sorting', () => {
    it('should sort friends by urgency (most urgent first)', () => {
      const daysAgo = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
      };

      useFriendsStore.setState({
        friends: [
          {
            id: '1',
            name: 'On Track Friend',
            photoUrl: null,
            birthday: '1990-01-01',
            frequencyDays: 30,
            lastContactAt: daysAgo(5), // 25 days remaining
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Overdue Friend',
            photoUrl: null,
            birthday: '1985-06-15',
            frequencyDays: 7,
            lastContactAt: daysAgo(10), // 3 days overdue
            createdAt: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Due Soon Friend',
            photoUrl: null,
            birthday: '1988-03-20',
            frequencyDays: 14,
            lastContactAt: daysAgo(12), // 2 days remaining
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const { getAllByRole } = render(<FriendsList />);
      const cards = getAllByRole('button');

      // Should be sorted: Overdue (-3), Due Soon (2), On Track (25)
      expect(cards[0].props.accessibilityLabel).toContain('Overdue Friend');
      expect(cards[1].props.accessibilityLabel).toContain('Due Soon Friend');
      expect(cards[2].props.accessibilityLabel).toContain('On Track Friend');
    });
  });
});
