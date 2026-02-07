import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { typography } from '@/src/constants/typography';
import { AnimatedBlobs } from './AnimatedBlobs';
import { OnboardingPage, useSpringEntrance } from './OnboardingPage';

export function OnboardingScreen(): React.ReactElement {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const [animationKey, setAnimationKey] = useState(0);

  const appleButtonStyle = useSpringEntrance(1600, animationKey);
  const termsStyle = useSpringEntrance(1900, animationKey);

  const handleReplay = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnimationKey((k) => k + 1);
  }, []);

  const handleAppleSignIn = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    router.replace('/(tabs)/friends');
  }, [completeOnboarding, router]);

  const appleButtonAppearance = isDark
    ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
    : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceLight }]}>
      <AnimatedBlobs />

      <OnboardingPage animationKey={animationKey} />

      <Pressable
        style={[styles.replayButton, { top: insets.top + 16 }]}
        onPress={handleReplay}
        testID="replay-button"
        hitSlop={12}
      >
        <SymbolView name="arrow.counterclockwise" tintColor={colors.neutralGray} size={20} />
      </Pressable>

      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 24 }]}>
        <Animated.View style={[styles.buttonContainer, appleButtonStyle]}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={appleButtonAppearance}
            cornerRadius={12}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        </Animated.View>

        <Animated.View style={termsStyle}>
          <Text style={[styles.termsText, { color: colors.neutralGray }]}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  replayButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    gap: 16,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: 50,
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  termsText: {
    ...typography.body2,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
