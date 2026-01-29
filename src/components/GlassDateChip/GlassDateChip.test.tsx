import React from 'react';
import { render } from '@testing-library/react-native';
import { GlassDateChip } from './GlassDateChip';
import { toDateString } from '@/src/utils/journalDateHelpers';

// Mock the date helpers to control "today"
jest.mock('@/src/utils/journalDateHelpers', () => ({
  ...jest.requireActual('@/src/utils/journalDateHelpers'),
  isToday: jest.fn(),
  formatShortDate: jest.fn(),
}));

import { isToday, formatShortDate } from '@/src/utils/journalDateHelpers';

const mockIsToday = isToday as jest.Mock;
const mockFormatShortDate = formatShortDate as jest.Mock;

describe('GlassDateChip', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should display "Today" for today\'s date', () => {
      mockIsToday.mockReturnValue(true);
      mockFormatShortDate.mockReturnValue('Wed, Jan 29');

      const { getByText } = render(<GlassDateChip date="2026-01-29" />);

      expect(getByText('Today')).toBeTruthy();
    });

    it('should display formatted date for other dates', () => {
      mockIsToday.mockReturnValue(false);
      mockFormatShortDate.mockReturnValue('Mon, Jan 27');

      const { getByText } = render(<GlassDateChip date="2026-01-27" />);

      expect(getByText('Mon, Jan 27')).toBeTruthy();
    });

    it('should render the GlassView container', () => {
      mockIsToday.mockReturnValue(false);
      mockFormatShortDate.mockReturnValue('Tue, Jan 28');

      const { getByTestId } = render(
        <GlassDateChip date="2026-01-28" testID="date-chip" />
      );

      expect(getByTestId('date-chip')).toBeTruthy();
    });
  });

  describe('saved indicator', () => {
    it('should not show checkmark by default', () => {
      mockIsToday.mockReturnValue(true);

      const { queryByTestId } = render(<GlassDateChip date="2026-01-29" />);

      expect(queryByTestId('saved-checkmark')).toBeNull();
    });

    it('should show checkmark when showSavedIndicator is true', () => {
      mockIsToday.mockReturnValue(true);

      const { getByTestId } = render(
        <GlassDateChip date="2026-01-29" showSavedIndicator />
      );

      expect(getByTestId('saved-checkmark')).toBeTruthy();
    });
  });
});
