import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilteredEmptyState } from './FilteredEmptyState';

describe('FilteredEmptyState', () => {
  const mockOnAddFriend = jest.fn();

  beforeEach(() => {
    mockOnAddFriend.mockClear();
  });

  describe('rendering', () => {
    it('should display category name in message', () => {
      const { getByText } = render(
        <FilteredEmptyState category="family" onAddFriend={mockOnAddFriend} />
      );

      expect(getByText('No Family friends yet')).toBeTruthy();
    });

    it('should display correct category name for each category', () => {
      const { rerender, getByText } = render(
        <FilteredEmptyState category="work" onAddFriend={mockOnAddFriend} />
      );
      expect(getByText('No Work friends yet')).toBeTruthy();

      rerender(<FilteredEmptyState category="partner" onAddFriend={mockOnAddFriend} />);
      expect(getByText('No Partner friends yet')).toBeTruthy();

      rerender(<FilteredEmptyState category="flirt" onAddFriend={mockOnAddFriend} />);
      expect(getByText('No Flirt friends yet')).toBeTruthy();
    });

    it('should display subtitle text', () => {
      const { getByText } = render(
        <FilteredEmptyState category="family" onAddFriend={mockOnAddFriend} />
      );

      expect(getByText('Add someone from your contacts to this category')).toBeTruthy();
    });

    it('should render "Add a friend" button', () => {
      const { getByText } = render(
        <FilteredEmptyState category="family" onAddFriend={mockOnAddFriend} />
      );

      expect(getByText('Add a friend')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should call onAddFriend when button is pressed', () => {
      const { getByTestId } = render(
        <FilteredEmptyState category="family" onAddFriend={mockOnAddFriend} />
      );

      fireEvent.press(getByTestId('filtered-empty-add-button'));
      expect(mockOnAddFriend).toHaveBeenCalledTimes(1);
    });
  });
});
