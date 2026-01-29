import { render } from '@testing-library/react-native';
import { DaysRemainingCounter } from './DaysRemainingCounter';

describe('DaysRemainingCounter', () => {
  describe('rendering', () => {
    it('should render "365 left" for 365 days', () => {
      const { getByText } = render(<DaysRemainingCounter daysRemaining={365} />);

      expect(getByText('365 left')).toBeTruthy();
    });

    it('should render "1 left" for singular day', () => {
      const { getByText } = render(<DaysRemainingCounter daysRemaining={1} />);

      expect(getByText('1 left')).toBeTruthy();
    });

    it('should render "100 left" for 100 days', () => {
      const { getByText } = render(<DaysRemainingCounter daysRemaining={100} />);

      expect(getByText('100 left')).toBeTruthy();
    });

    it('should render "0 left" for 0 days', () => {
      const { getByText } = render(<DaysRemainingCounter daysRemaining={0} />);

      expect(getByText('0 left')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have testID when provided', () => {
      const { getByTestId } = render(
        <DaysRemainingCounter daysRemaining={100} testID="counter" />
      );

      expect(getByTestId('counter')).toBeTruthy();
    });
  });
});
