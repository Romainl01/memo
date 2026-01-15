import { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  CrimsonPro_400Regular,
  CrimsonPro_500Medium,
} from '@expo-google-fonts/crimson-pro';
import {
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import { NotificationService } from '@/src/services/notificationService';
import { useFriendsStore } from '@/src/stores/friendsStore';
import { useNotificationStateStore } from '@/src/stores/notificationStateStore';

SplashScreen.preventAutoHideAsync();

/**
 * Returns the appropriate sheet corner radius based on iPhone model.
 * Different iPhone generations have different screen corner radii:
 * - iPhone 14 Pro+, 15 series: 55px
 * - iPhone 12/13/14 standard: 47px
 * - iPhone 11/X era: 40-44px
 */
function getDeviceCornerRadius(screenWidth: number, screenHeight: number): number {
  const height = Math.max(screenWidth, screenHeight);

  // iPhone 15 Pro Max, 15 Plus, 14 Pro Max (932pt height)
  if (height >= 930) return 55;

  // iPhone 14 Plus, 13 Pro Max, 12 Pro Max (926pt height)
  if (height >= 920) return 47;

  // iPhone 11 Pro Max, 11, XR, XS Max (896pt height)
  if (height >= 890) return 40;

  // iPhone 15 Pro, 15, 14 Pro (852pt height)
  if (height >= 850) return 55;

  // iPhone 14, 13, 12 series (844pt height)
  if (height >= 840) return 47;

  // iPhone 13 mini, X, XS, 11 Pro (812pt height)
  if (height >= 810) return 44;

  // Older/smaller devices
  return 38;
}

export default function RootLayout(): React.ReactElement | null {
  const router = useRouter();
  const responseListener = useRef<Notifications.Subscription>();
  const { width, height } = useWindowDimensions();

  const sheetCornerRadius = getDeviceCornerRadius(width, height);

  const friends = useFriendsStore((state) => state.friends);
  const {
    shouldSendBirthdayNotification,
    shouldSendCatchUpNotification,
    hasRequestedPermission,
  } = useNotificationStateStore();

  const [fontsLoaded] = useFonts({
    CrimsonPro_400Regular,
    CrimsonPro_500Medium,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    NotificationService.initialize();

    responseListener.current = NotificationService.addNotificationResponseListener(
      () => {
        router.navigate('/(tabs)/friends');
      }
    );

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (hasRequestedPermission && friends.length > 0) {
      NotificationService.scheduleAllNotifications(
        friends,
        shouldSendBirthdayNotification,
        shouldSendCatchUpNotification
      );
    }
  }, [friends, hasRequestedPermission, shouldSendBirthdayNotification, shouldSendCatchUpNotification]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-friend"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              sheetGrabberVisible: true,
              sheetCornerRadius,
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
