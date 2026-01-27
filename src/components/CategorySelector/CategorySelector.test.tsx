import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategorySelector } from './CategorySelector';
import type { FriendCategory } from '@/src/stores/friendsStore';

describe('CategorySelector', () => {
  const defaultProps = {
    value: 'friend' as FriendCategory,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all 5 category options', () => {
    const { getByText } = render(<CategorySelector {...defaultProps} />);

    expect(getByText('Friend')).toBeTruthy();
    expect(getByText('Family')).toBeTruthy();
    expect(getByText('Work')).toBeTruthy();
    expect(getByText('Partner')).toBeTruthy();
    expect(getByText('Flirt')).toBeTruthy();
  });

  it('should show the selected category as active', () => {
    const { getByTestId } = render(
      <CategorySelector value="family" onChange={defaultProps.onChange} />
    );

    const familyPill = getByTestId('category-pill-family');
    // The selected pill should have the selected style applied
    expect(familyPill).toBeTruthy();
  });

  it('should call onChange with correct value when pill is tapped', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <CategorySelector value="friend" onChange={onChange} />
    );

    fireEvent.press(getByText('Work'));
    expect(onChange).toHaveBeenCalledWith('work');

    fireEvent.press(getByText('Partner'));
    expect(onChange).toHaveBeenCalledWith('partner');
  });

  it('should call onChange when tapping the already selected pill', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <CategorySelector value="friend" onChange={onChange} />
    );

    fireEvent.press(getByText('Friend'));
    expect(onChange).toHaveBeenCalledWith('friend');
  });

  it('should render each category with a testID', () => {
    const { getByTestId } = render(<CategorySelector {...defaultProps} />);

    expect(getByTestId('category-pill-friend')).toBeTruthy();
    expect(getByTestId('category-pill-family')).toBeTruthy();
    expect(getByTestId('category-pill-work')).toBeTruthy();
    expect(getByTestId('category-pill-partner')).toBeTruthy();
    expect(getByTestId('category-pill-flirt')).toBeTruthy();
  });
});
