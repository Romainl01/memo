import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { RelationshipFilter } from './RelationshipFilter';
import type { FriendCategory, CategoryCounts } from '@/src/stores/friendsStore';

jest.mock('expo-haptics');

describe('RelationshipFilter', () => {
  const mockOnChange = jest.fn();
  const defaultCounts: CategoryCounts = {
    all: 10,
    friend: 4,
    family: 3,
    work: 2,
    partner: 1,
    flirt: 0,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    (Haptics.selectionAsync as jest.Mock).mockClear();
  });

  describe('rendering', () => {
    it('should render "All" pill first', () => {
      const { getAllByTestId } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      const pills = getAllByTestId(/^filter-pill-/);
      expect(pills[0].props.testID).toBe('filter-pill-all');
    });

    it('should render all category pills with counts', () => {
      const { getByText } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      expect(getByText('All (10)')).toBeTruthy();
      expect(getByText('Friend (4)')).toBeTruthy();
      expect(getByText('Family (3)')).toBeTruthy();
      expect(getByText('Work (2)')).toBeTruthy();
      expect(getByText('Partner (1)')).toBeTruthy();
      expect(getByText('Flirt (0)')).toBeTruthy();
    });

    it('should render pills in horizontal scroll view', () => {
      const { getByTestId } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      const scrollView = getByTestId('filter-scroll-view');
      expect(scrollView.props.horizontal).toBe(true);
    });
  });

  describe('selection', () => {
    it('should show "All" as selected when value is null', () => {
      const { getByTestId } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      const allPill = getByTestId('filter-pill-all');
      expect(allPill.props.accessibilityState.selected).toBe(true);
    });

    it('should show selected category pill as selected', () => {
      const { getByTestId } = render(
        <RelationshipFilter value="family" onChange={mockOnChange} counts={defaultCounts} />
      );

      const familyPill = getByTestId('filter-pill-family');
      expect(familyPill.props.accessibilityState.selected).toBe(true);

      const allPill = getByTestId('filter-pill-all');
      expect(allPill.props.accessibilityState.selected).toBe(false);
    });

    it('should call onChange with null when "All" is pressed', () => {
      const { getByTestId } = render(
        <RelationshipFilter value="friend" onChange={mockOnChange} counts={defaultCounts} />
      );

      fireEvent.press(getByTestId('filter-pill-all'));
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should call onChange with category when category pill is pressed', () => {
      const { getByTestId } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      fireEvent.press(getByTestId('filter-pill-family'));
      expect(mockOnChange).toHaveBeenCalledWith('family');
    });
  });

  describe('haptic feedback', () => {
    it('should trigger haptic feedback when a pill is pressed', () => {
      const { getByTestId } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      fireEvent.press(getByTestId('filter-pill-work'));
      expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have accessible role button for each pill', () => {
      const { getByTestId } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      const allPill = getByTestId('filter-pill-all');
      expect(allPill.props.accessibilityRole).toBe('button');

      const familyPill = getByTestId('filter-pill-family');
      expect(familyPill.props.accessibilityRole).toBe('button');
    });

    it('should have accessible labels for each pill', () => {
      const { getByLabelText } = render(
        <RelationshipFilter value={null} onChange={mockOnChange} counts={defaultCounts} />
      );

      expect(getByLabelText('Show all friends')).toBeTruthy();
      expect(getByLabelText('Filter by Friend')).toBeTruthy();
      expect(getByLabelText('Filter by Family')).toBeTruthy();
    });
  });
});
