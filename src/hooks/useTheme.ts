import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppearanceStore, AppearanceMode } from '@/src/stores/appearanceStore';
import { lightColors, darkColors, ThemeColors } from '@/src/constants/colors';

export type ResolvedTheme = 'light' | 'dark';

interface UseThemeResult {
  /** User's selected appearance mode (system/light/dark) */
  mode: AppearanceMode;
  /** The actual theme being applied (light or dark) */
  resolvedTheme: ResolvedTheme;
  /** Color palette for the current theme */
  colors: ThemeColors;
  /** Convenience boolean for dark mode checks */
  isDark: boolean;
}

/**
 * Hook that resolves the current theme based on user preference and system settings.
 *
 * When mode is 'system', follows the device's color scheme.
 * When mode is 'light' or 'dark', uses that theme regardless of system setting.
 *
 * @returns Theme information including resolved colors
 */
export function useTheme(): UseThemeResult {
  const mode = useAppearanceStore((state) => state.mode);
  const systemColorScheme = useColorScheme();

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemColorScheme]);

  const colors = useMemo(() => {
    return resolvedTheme === 'dark' ? darkColors : lightColors;
  }, [resolvedTheme]);

  const isDark = resolvedTheme === 'dark';

  return { mode, resolvedTheme, colors, isDark };
}
