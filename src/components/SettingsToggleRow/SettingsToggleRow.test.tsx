import { render, fireEvent } from '@testing-library/react-native';
import type { SFSymbol } from 'sf-symbols-typescript';
import { SettingsToggleRow } from './SettingsToggleRow';

// Mock expo-symbols
jest.mock('expo-symbols', () => ({
  SymbolView: ({ name, testID }: { name: string; testID?: string }) => {
    const { View } = require('react-native');
    return <View testID={testID || `symbol-${name}`} />;
  },
}));

describe('SettingsToggleRow', () => {
  const defaultProps = {
    icon: 'bell' as SFSymbol,
    label: 'Push Notifications',
    value: true,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the label', () => {
    const { getByText } = render(<SettingsToggleRow {...defaultProps} />);

    expect(getByText('Push Notifications')).toBeTruthy();
  });

  it('should render the icon', () => {
    const { getByTestId } = render(<SettingsToggleRow {...defaultProps} />);

    expect(getByTestId('symbol-bell')).toBeTruthy();
  });

  it('should render a switch with the correct value', () => {
    const { getByRole } = render(
      <SettingsToggleRow {...defaultProps} value={true} />
    );

    const toggle = getByRole('switch');
    expect(toggle.props.value).toBe(true);
  });

  it('should call onToggle when switch is toggled', () => {
    const onToggleMock = jest.fn();
    const { getByRole } = render(
      <SettingsToggleRow {...defaultProps} value={false} onToggle={onToggleMock} />
    );

    fireEvent(getByRole('switch'), 'valueChange', true);

    expect(onToggleMock).toHaveBeenCalledWith(true);
  });

  it('should disable the switch when disabled prop is true', () => {
    const { getByRole } = render(
      <SettingsToggleRow {...defaultProps} disabled={true} />
    );

    expect(getByRole('switch').props.disabled).toBe(true);
  });

  it('should use testID when provided', () => {
    const { getByTestId } = render(
      <SettingsToggleRow {...defaultProps} testID="notif-toggle" />
    );

    expect(getByTestId('notif-toggle')).toBeTruthy();
  });
});
