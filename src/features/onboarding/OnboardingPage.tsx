import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/hooks/useTheme';
import { typography } from '@/src/constants/typography';

interface OnboardingPageProps {
  animationKey: number;
}

const LOGO_SIZE = 120;
const INITIAL_TRANSLATE_Y = 80;
const INITIAL_SCALE = 0.85;
const FADE_IN_DURATION = 900;

export const SPRING_CONFIG = { damping: 12, stiffness: 50, mass: 1.2 };
export const STAGGER = [0, 700, 1200]; // logo, title, subtitle delays in ms

function LogoPlaceholder(): React.ReactElement {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.logo, { backgroundColor: colors.neutralWhite }]}
      testID="onboarding-logo"
    >
      <Text style={[styles.logoText, { color: colors.primary }]}>M</Text>
    </View>
  );
}

export function useSpringEntrance(delay: number, animationKey: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(INITIAL_TRANSLATE_Y);
  const scale = useSharedValue(INITIAL_SCALE);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = INITIAL_TRANSLATE_Y;
    scale.value = INITIAL_SCALE;

    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: FADE_IN_DURATION });
      translateY.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, animationKey, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return animatedStyle;
}

export function OnboardingPage({ animationKey }: OnboardingPageProps): React.ReactElement {
  const { colors } = useTheme();

  const logoStyle = useSpringEntrance(STAGGER[0], animationKey);
  const titleStyle = useSpringEntrance(STAGGER[1], animationKey);
  const subtitleStyle = useSpringEntrance(STAGGER[2], animationKey);

  return (
    <View style={styles.page} testID="onboarding-page">
      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <LogoPlaceholder />
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={[styles.title, { color: colors.neutralDark }]}>
            Say hello to Memo
          </Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text style={[styles.subtitle, { color: colors.neutralGray }]}>
            Stay close to the people who matter — track your moods, reflect on your days, and never forget to reach out
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -60,
    gap: 20,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontFamily: 'CrimsonPro_500Medium',
    fontSize: 56,
    lineHeight: 64,
  },
  title: {
    ...typography.titleH1,
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    textAlign: 'center',
    lineHeight: 24,
  },
});
