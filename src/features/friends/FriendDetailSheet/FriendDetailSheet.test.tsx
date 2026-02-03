import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { FriendDetailSheet } from './FriendDetailSheet';
import { Friend } from '@/src/stores/friendsStore';

// Mock the auto-save hook
jest.mock('@/src/hooks/useAutoSave', () => ({
  useAutoSave: jest.fn(({ onSave }) => ({
    isSaving: false,
    justSaved: false,
    saveNow: () => onSave('test notes'),
  })),
}));

const mockFriend: Friend = {
  id: '123',
  name: 'John Doe',
  photoUrl: null,
  birthday: '1990-05-15',
  frequencyDays: 7,
  lastContactAt: '2024-01-15',
  category: 'friend',
  notes: 'Initial notes about John',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('FriendDetailSheet', () => {
  const defaultProps = {
    friend: mockFriend,
    onEdit: jest.fn(),
    onClose: jest.fn(),
    onNotesChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render friend name', () => {
    const { getByText } = render(<FriendDetailSheet {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('should render avatar', () => {
    const { getByLabelText } = render(<FriendDetailSheet {...defaultProps} />);
    expect(getByLabelText("John Doe's avatar")).toBeTruthy();
  });

  it('should render notes TextInput with placeholder', () => {
    const { getByPlaceholderText } = render(
      <FriendDetailSheet {...defaultProps} friend={{ ...mockFriend, notes: '' }} />
    );
    expect(getByPlaceholderText('Add notes about this friend...')).toBeTruthy();
  });

  it('should display existing notes', () => {
    const { getByDisplayValue } = render(<FriendDetailSheet {...defaultProps} />);
    expect(getByDisplayValue('Initial notes about John')).toBeTruthy();
  });

  it('should call onEdit when edit button is pressed', () => {
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <FriendDetailSheet {...defaultProps} onEdit={onEdit} />
    );

    fireEvent.press(getByTestId('edit-button'));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should have accessible edit button', () => {
    const { getByLabelText } = render(<FriendDetailSheet {...defaultProps} />);
    expect(getByLabelText('Edit friend details')).toBeTruthy();
  });

  it('should call onClose when done button is pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <FriendDetailSheet {...defaultProps} onClose={onClose} />
    );

    fireEvent.press(getByTestId('done-button'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have accessible done button', () => {
    const { getByLabelText } = render(<FriendDetailSheet {...defaultProps} />);
    expect(getByLabelText('Done')).toBeTruthy();
  });
});
