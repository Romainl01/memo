import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/hooks/useTheme';
import { lightAurora, darkAurora, type AuroraPalette } from './onboardingColors';

interface OrbConfig {
  size: number;
  left: number;
  top: number;
  driftX: number;
  driftY: number;
  cycle: number;
  scaleMax: number;
  colorKey: 'orb1' | 'orb2' | 'orb3' | 'orb4';
}

const EASING = Easing.inOut(Easing.ease);

const ORBS: OrbConfig[] = [
  { size: 500, left: -80, top: -100, driftX: 140, driftY: 100, cycle: 9000, scaleMax: 1.2, colorKey: 'orb1' },
  { size: 450, left: 120, top: 200, driftX: -120, driftY: 80, cycle: 8000, scaleMax: 1.15, colorKey: 'orb2' },
  { size: 400, left: -40, top: 500, driftX: 160, driftY: -120, cycle: 10000, scaleMax: 1.2, colorKey: 'orb3' },
  { size: 350, left: 160, top: 100, driftX: -100, driftY: 130, cycle: 11000, scaleMax: 1.15, colorKey: 'orb4' },
];

const ORB_OPACITY_LIGHT = 0.8;
const ORB_OPACITY_DARK = 0.65;

interface OrbProps {
  config: OrbConfig;
  palette: AuroraPalette;
  isDark: boolean;
}

function Orb({ config, palette, isDark }: OrbProps): React.ReactElement {
  const orbOpacity = isDark ? ORB_OPACITY_DARK : ORB_OPACITY_LIGHT;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timingOptions = { duration: config.cycle, easing: EASING };
    const scaleDuration = config.cycle * 0.8;

    translateX.value = withRepeat(
      withSequence(
        withTiming(config.driftX, timingOptions),
        withTiming(0, timingOptions)
      ),
      -1,
      true
    );
    translateY.value = withRepeat(
      withSequence(
        withTiming(config.driftY, timingOptions),
        withTiming(0, timingOptions)
      ),
      -1,
      true
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(config.scaleMax, { duration: scaleDuration, easing: EASING }),
        withTiming(1, { duration: scaleDuration, easing: EASING })
      ),
      -1,
      true
    );
  }, [config, translateX, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          left: config.left,
          top: config.top,
          backgroundColor: palette[config.colorKey],
          opacity: orbOpacity,
        },
        animatedStyle,
      ]}
    />
  );
}

export function AnimatedBlobs(): React.ReactElement {
  const { isDark } = useTheme();
  const palette = isDark ? darkAurora : lightAurora;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[palette.gradientStart, palette.gradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      {ORBS.map((config, index) => (
        <Orb key={index} config={config} palette={palette} isDark={isDark} />
      ))}
      <BlurView
        intensity={50}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
  },
});
