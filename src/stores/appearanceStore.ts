import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * User's appearance preference for the app theme.
 * - 'system': Follow device settings
 * - 'light': Always use light theme
 * - 'dark': Always use dark theme
 */
export type AppearanceMode = 'system' | 'light' | 'dark';

interface AppearanceState {
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      mode: 'system',

      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'appearance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
