import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mood options for journal entries
 * Ordered from difficult to amazing: awful → bad → okay → good → great
 */
export type Mood = 'awful' | 'bad' | 'okay' | 'good' | 'great';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: Mood | null; // Optional mood for the day
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

interface JournalState {
  entries: Record<string, JournalEntry>; // keyed by date (YYYY-MM-DD)
  getEntryByDate: (date: string) => JournalEntry | undefined;
  upsertEntry: (date: string, content: string, mood?: Mood | null) => void;
  setMood: (date: string, mood: Mood | null) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: {},

      getEntryByDate: (date) => {
        const { entries } = get();
        return entries[date];
      },

      upsertEntry: (date, content, mood) => {
        const { entries } = get();
        const existing = entries[date];
        const now = new Date().toISOString();

        const entry: JournalEntry = existing
          ? {
              ...existing,
              content,
              // Only update mood if explicitly provided (not undefined)
              mood: mood !== undefined ? mood : existing.mood,
              updatedAt: now,
            }
          : {
              id: generateId(),
              date,
              content,
              mood: mood ?? null,
              createdAt: now,
              updatedAt: now,
            };

        set({ entries: { ...entries, [date]: entry } });
      },

      setMood: (date, mood) => {
        const { entries, getEntryByDate, upsertEntry } = get();
        const existing = getEntryByDate(date);

        if (existing) {
          set({
            entries: {
              ...entries,
              [date]: { ...existing, mood, updatedAt: new Date().toISOString() },
            },
          });
        } else {
          // Create empty entry with mood
          upsertEntry(date, '', mood);
        }
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        entries: state.entries,
      }),
    }
  )
);
