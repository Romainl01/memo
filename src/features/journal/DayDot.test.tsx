import { render, fireEvent } from '@testing-library/react-native';

import { DayDot } from './DayDot';

describe('DayDot', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <DayDot status="past-without-entry" testID="day-dot" />
      );

      expect(getByTestId('day-dot')).toBeTruthy();
    });

    it('should render past-with-entry status', () => {
      const { getByTestId } = render(
        <DayDot status="past-with-entry" testID="day-dot" />
      );

      expect(getByTestId('day-dot')).toBeTruthy();
    });

    it('should render today status', () => {
      const { getByTestId } = render(
        <DayDot status="today" testID="day-dot" />
      );

      expect(getByTestId('day-dot')).toBeTruthy();
    });

    it('should render future status', () => {
      const { getByTestId } = render(
        <DayDot status="future" testID="day-dot" />
      );

      expect(getByTestId('day-dot')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should call onPress when past-with-entry dot is pressed', () => {
      const { getByTestId } = render(
        <DayDot status="past-with-entry" onPress={mockOnPress} testID="day-dot" />
      );

      fireEvent.press(getByTestId('day-dot'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress when past-without-entry dot is pressed', () => {
      const { getByTestId } = render(
        <DayDot status="past-without-entry" onPress={mockOnPress} testID="day-dot" />
      );

      fireEvent.press(getByTestId('day-dot'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress when today dot is pressed', () => {
      const { getByTestId } = render(
        <DayDot status="today" onPress={mockOnPress} testID="day-dot" />
      );

      fireEvent.press(getByTestId('day-dot'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onPress when future dot is pressed', () => {
      const { getByTestId } = render(
        <DayDot status="future" onPress={mockOnPress} testID="day-dot" />
      );

      fireEvent.press(getByTestId('day-dot'));

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should work without onPress callback', () => {
      const { getByTestId } = render(
        <DayDot status="past-with-entry" testID="day-dot" />
      );

      expect(() => fireEvent.press(getByTestId('day-dot'))).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have testID when provided', () => {
      const { getByTestId } = render(
        <DayDot status="past-with-entry" testID="custom-id" />
      );

      expect(getByTestId('custom-id')).toBeTruthy();
    });
  });
});
