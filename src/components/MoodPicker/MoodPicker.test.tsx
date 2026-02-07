import { render, fireEvent } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { MoodPicker } from './MoodPicker';
import { Mood } from '@/src/stores/journalStore';

jest.mock('expo-haptics');
jest.mock('expo-symbols', () => ({
  SymbolView: 'SymbolView',
}));

describe('MoodPicker', () => {
  const mockOnMoodChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the question label', () => {
    const { getByText } = render(
      <MoodPicker
        selectedMood={null}
        onMoodChange={mockOnMoodChange}
        testID="mood-picker"
      />
    );

    expect(getByText('How was your day?')).toBeTruthy();
  });

  it('should render all 5 mood options', () => {
    const { getByTestId } = render(
      <MoodPicker
        selectedMood={null}
        onMoodChange={mockOnMoodChange}
        testID="mood-picker"
      />
    );

    expect(getByTestId('mood-picker-awful')).toBeTruthy();
    expect(getByTestId('mood-picker-bad')).toBeTruthy();
    expect(getByTestId('mood-picker-okay')).toBeTruthy();
    expect(getByTestId('mood-picker-good')).toBeTruthy();
    expect(getByTestId('mood-picker-great')).toBeTruthy();
  });

  it('should call onMoodChange when mood is selected', () => {
    const { getByTestId } = render(
      <MoodPicker
        selectedMood={null}
        onMoodChange={mockOnMoodChange}
        testID="mood-picker"
      />
    );

    fireEvent.press(getByTestId('mood-picker-good'));

    expect(mockOnMoodChange).toHaveBeenCalledWith('good');
  });

  it('should trigger haptic feedback on press', () => {
    const { getByTestId } = render(
      <MoodPicker
        selectedMood={null}
        onMoodChange={mockOnMoodChange}
        testID="mood-picker"
      />
    );

    fireEvent.press(getByTestId('mood-picker-okay'));

    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('should deselect when pressing already selected mood', () => {
    const { getByTestId } = render(
      <MoodPicker
        selectedMood="great"
        onMoodChange={mockOnMoodChange}
        testID="mood-picker"
      />
    );

    fireEvent.press(getByTestId('mood-picker-great'));

    expect(mockOnMoodChange).toHaveBeenCalledWith(null);
  });

  it('should switch moods when different mood is selected', () => {
    const { getByTestId } = render(
      <MoodPicker
        selectedMood="great"
        onMoodChange={mockOnMoodChange}
        testID="mood-picker"
      />
    );

    fireEvent.press(getByTestId('mood-picker-bad'));

    expect(mockOnMoodChange).toHaveBeenCalledWith('bad');
  });

  it.each<Mood>(['awful', 'bad', 'okay', 'good', 'great'])(
    'should correctly handle %s mood selection',
    (mood) => {
      const { getByTestId } = render(
        <MoodPicker
          selectedMood={null}
          onMoodChange={mockOnMoodChange}
          testID="mood-picker"
        />
      );

      fireEvent.press(getByTestId(`mood-picker-${mood}`));

      expect(mockOnMoodChange).toHaveBeenCalledWith(mood);
    }
  );
});
