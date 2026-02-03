import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

interface SheetBackgroundProps {
  children: React.ReactNode;
}

/**
 * Background wrapper for form sheets that provides liquid glass effect on iOS 26+
 * and falls back to BlurView for older iOS versions.
 */
function SheetBackground({ children }: SheetBackgroundProps): React.ReactElement {
  if (isLiquidGlassAvailable()) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <BlurView tint="systemMaterial" intensity={80} style={styles.container}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { SheetBackground };
export type { SheetBackgroundProps };
