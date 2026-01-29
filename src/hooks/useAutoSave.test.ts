import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAutoSave } from './useAutoSave';

describe('useAutoSave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call save after debounce delay when content changes', async () => {
    const saveFn = jest.fn();
    const { result } = renderHook(() =>
      useAutoSave({
        content: 'initial',
        onSave: saveFn,
        debounceMs: 500,
      })
    );

    // Initially not saving
    expect(result.current.isSaving).toBe(false);
    expect(saveFn).not.toHaveBeenCalled();

    // Fast-forward past debounce time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should have called save
    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith('initial');
    });
  });

  it('should reset debounce timer on content change', async () => {
    const saveFn = jest.fn();
    const { rerender } = renderHook(
      ({ content }: { content: string }) =>
        useAutoSave({
          content,
          onSave: saveFn,
          debounceMs: 500,
        }),
      { initialProps: { content: 'first' } }
    );

    // Advance 300ms (not enough to trigger)
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(saveFn).not.toHaveBeenCalled();

    // Change content - should reset timer
    rerender({ content: 'second' });

    // Advance another 300ms (600ms total, but only 300ms since last change)
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(saveFn).not.toHaveBeenCalled();

    // Advance remaining 200ms
    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith('second');
    });
  });

  it('should set justSaved to true after save and reset after delay', async () => {
    const saveFn = jest.fn();
    const { result } = renderHook(() =>
      useAutoSave({
        content: 'test',
        onSave: saveFn,
        debounceMs: 500,
      })
    );

    expect(result.current.justSaved).toBe(false);

    // Trigger save
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.justSaved).toBe(true);
    });

    // justSaved should reset after 1500ms
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(result.current.justSaved).toBe(false);
    });
  });

  it('should provide saveNow to trigger immediate save', async () => {
    const saveFn = jest.fn();
    const { result } = renderHook(() =>
      useAutoSave({
        content: 'immediate',
        onSave: saveFn,
        debounceMs: 500,
      })
    );

    // Call saveNow before debounce completes
    act(() => {
      result.current.saveNow();
    });

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith('immediate');
    });
  });

  it('should not save empty content', async () => {
    const saveFn = jest.fn();
    renderHook(() =>
      useAutoSave({
        content: '',
        onSave: saveFn,
        debounceMs: 500,
      })
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(saveFn).not.toHaveBeenCalled();
  });

  it('should not save whitespace-only content', async () => {
    const saveFn = jest.fn();
    renderHook(() =>
      useAutoSave({
        content: '   \n\t  ',
        onSave: saveFn,
        debounceMs: 500,
      })
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(saveFn).not.toHaveBeenCalled();
  });
});
