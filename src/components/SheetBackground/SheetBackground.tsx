import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

interface SheetBackgroundProps {
  children: React.ReactNode;
}

/**
 * Detects if we're running in Expo Go.
 * Expo Go reports isLiquidGlassAvailable() as true but can't actually render
 * liquid glass on formSheets properly, so we need to fall back to BlurView.
 */
function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

/**
 * Background wrapper for form sheets that provides liquid glass effect on iOS 26+
 * and falls back to BlurView for Expo Go or older iOS versions.
 *
 * The native formSheet presentation with contentStyle: { backgroundColor: 'transparent' }
 * only provides liquid glass in custom development builds on iOS 26+. In Expo Go,
 * we need to manually add a blur background.
 */
function SheetBackground({ children }: SheetBackgroundProps): React.ReactElement {
  const liquidGlassAvailable = isLiquidGlassAvailable();
  const inExpoGo = isExpoGo();

  useEffect(() => {
    console.log('[SheetBackground] Mount');
    console.log('  - isLiquidGlassAvailable:', liquidGlassAvailable);
    console.log('  - isExpoGo:', inExpoGo);
    console.log('  - Using:', inExpoGo ? 'BlurView (Expo Go fallback)' : 'native liquid glass');
    return () => {
      console.log('[SheetBackground] Unmount');
    };
  }, [liquidGlassAvailable, inExpoGo]);

  // In Expo Go, liquid glass doesn't work properly on formSheets even though
  // isLiquidGlassAvailable() returns true. Fall back to BlurView.
  const shouldUseBlurFallback = inExpoGo || !liquidGlassAvailable;

  // On iOS 26+ with a dev build, liquid glass is handled natively by the sheet
  // Just render children with transparent background
  if (!shouldUseBlurFallback) {
    return <View style={styles.container}>{children}</View>;
  }

  // Fallback: Use BlurView to simulate the frosted glass look
  return (
    <BlurView
      tint="systemMaterial"
      intensity={80}
      style={styles.blurContainer}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

export { SheetBackground };
export type { SheetBackgroundProps };
