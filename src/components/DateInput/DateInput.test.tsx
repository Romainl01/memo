import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DateInput } from './DateInput';

// Mock the DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: ({ value, onChange, testID }: any) =>
      React.createElement(
        View,
        { testID: testID || 'date-picker' },
        React.createElement(
          Pressable,
          {
            testID: 'mock-picker-confirm',
            onPress: () => {
              // Simulate selecting a new date
              const newDate = new Date('2024-06-15');
              onChange({ type: 'set', nativeEvent: { timestamp: newDate.getTime() } }, newDate);
            },
          },
          React.createElement(Text, null, 'Confirm')
        )
      ),
  };
});

describe('DateInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('rendering', () => {
    it('should render the label', () => {
      const { getByText } = render(
        <DateInput label="Birthday" value={null} onChange={mockOnChange} />
      );

      expect(getByText('Birthday')).toBeTruthy();
    });

    it('should show placeholder when no date is selected', () => {
      const { getByText } = render(
        <DateInput
          label="Birthday"
          value={null}
          onChange={mockOnChange}
          placeholder="Select a date..."
        />
      );

      expect(getByText('Select a date...')).toBeTruthy();
    });

    it('should show default placeholder when none provided', () => {
      const { getByText } = render(
        <DateInput label="Birthday" value={null} onChange={mockOnChange} />
      );

      expect(getByText('Select date')).toBeTruthy();
    });

    it('should display formatted date when value is provided', () => {
      const testDate = new Date('1992-12-15');
      const { getByText } = render(
        <DateInput label="Birthday" value={testDate} onChange={mockOnChange} />
      );

      // Should display in a readable format
      expect(getByText('December 15, 1992')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should show picker when field is pressed', () => {
      const { getByTestId, queryByTestId } = render(
        <DateInput label="Birthday" value={null} onChange={mockOnChange} />
      );

      // Picker should not be visible initially
      expect(queryByTestId('date-picker')).toBeNull();

      // Press the input field
      fireEvent.press(getByTestId('date-input-field'));

      // Picker should now be visible
      expect(getByTestId('date-picker')).toBeTruthy();
    });

    it('should call onChange when date is selected', () => {
      const { getByTestId } = render(
        <DateInput label="Birthday" value={null} onChange={mockOnChange} />
      );

      // Open the picker
      fireEvent.press(getByTestId('date-input-field'));

      // Confirm selection in mock picker
      fireEvent.press(getByTestId('mock-picker-confirm'));

      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
    });
  });

  describe('accessibility', () => {
    it('should have accessible label', () => {
      const { getByLabelText } = render(
        <DateInput label="Birthday" value={null} onChange={mockOnChange} />
      );

      expect(getByLabelText('Birthday')).toBeTruthy();
    });

    it('should have button role for the input field', () => {
      const { getByTestId } = render(
        <DateInput label="Birthday" value={null} onChange={mockOnChange} />
      );

      const field = getByTestId('date-input-field');
      expect(field.props.accessibilityRole).toBe('button');
    });
  });
});
