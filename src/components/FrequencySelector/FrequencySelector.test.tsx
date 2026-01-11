import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FrequencySelector, FrequencyOption } from './FrequencySelector';

describe('FrequencySelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('rendering', () => {
    it('should render all frequency options', () => {
      const { getByText } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      expect(getByText('Weekly')).toBeTruthy();
      expect(getByText('2 Weeks')).toBeTruthy();
      expect(getByText('Monthly')).toBeTruthy();
      expect(getByText('Quarterly')).toBeTruthy();
    });

    it('should render a label when provided', () => {
      const { getByText } = render(
        <FrequencySelector
          value={null}
          onChange={mockOnChange}
          label="Stay in touch"
        />
      );

      expect(getByText('Stay in touch')).toBeTruthy();
    });
  });

  describe('selection', () => {
    it('should call onChange with 7 when Weekly is pressed', () => {
      const { getByText } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      fireEvent.press(getByText('Weekly'));
      expect(mockOnChange).toHaveBeenCalledWith(7);
    });

    it('should call onChange with 14 when 2 Weeks is pressed', () => {
      const { getByText } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      fireEvent.press(getByText('2 Weeks'));
      expect(mockOnChange).toHaveBeenCalledWith(14);
    });

    it('should call onChange with 30 when Monthly is pressed', () => {
      const { getByText } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      fireEvent.press(getByText('Monthly'));
      expect(mockOnChange).toHaveBeenCalledWith(30);
    });

    it('should call onChange with 90 when Quarterly is pressed', () => {
      const { getByText } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      fireEvent.press(getByText('Quarterly'));
      expect(mockOnChange).toHaveBeenCalledWith(90);
    });
  });

  describe('selected state', () => {
    it('should mark Weekly as selected when value is 7', () => {
      const { getByTestId } = render(
        <FrequencySelector value={7} onChange={mockOnChange} />
      );

      const weeklyPill = getByTestId('frequency-pill-7');
      expect(weeklyPill.props.accessibilityState.selected).toBe(true);
    });

    it('should mark Monthly as selected when value is 30', () => {
      const { getByTestId } = render(
        <FrequencySelector value={30} onChange={mockOnChange} />
      );

      const monthlyPill = getByTestId('frequency-pill-30');
      expect(monthlyPill.props.accessibilityState.selected).toBe(true);
    });

    it('should not mark unselected options as selected', () => {
      const { getByTestId } = render(
        <FrequencySelector value={7} onChange={mockOnChange} />
      );

      const monthlyPill = getByTestId('frequency-pill-30');
      expect(monthlyPill.props.accessibilityState.selected).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have accessible role button for each option', () => {
      const { getByTestId } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      const weeklyPill = getByTestId('frequency-pill-7');
      expect(weeklyPill.props.accessibilityRole).toBe('button');
    });

    it('should have accessible label for each option', () => {
      const { getByLabelText } = render(
        <FrequencySelector value={null} onChange={mockOnChange} />
      );

      expect(getByLabelText('Check in weekly')).toBeTruthy();
      expect(getByLabelText('Check in every 2 weeks')).toBeTruthy();
      expect(getByLabelText('Check in monthly')).toBeTruthy();
      expect(getByLabelText('Check in quarterly')).toBeTruthy();
    });
  });
});
