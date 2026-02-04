import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/hooks/useTheme';

/**
 * Soft gradient background used across all main screens.
 * Adapts to light/dark mode - warm coral gradient in light, subtle warm dark in dark mode.
 * Positioned absolutely, covering the top 45% of the screen.
 */
export function GradientBackground(): React.ReactElement {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      style={styles.gradient}
      locations={[0, 0.85]}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
});
