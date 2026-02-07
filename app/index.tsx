import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/src/stores/onboardingStore';

/**
 * Root index — conditional redirect based on onboarding state.
 * Waits for the store to hydrate from AsyncStorage before deciding.
 * The splash screen remains visible until hydration completes (handled in _layout.tsx).
 */
export default function Index(): React.ReactElement | null {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const hasHydrated = useOnboardingStore((s) => s._hasHydrated);

  if (!hasHydrated) return null;
  if (!hasCompleted) return <Redirect href="/(onboarding)" />;
  return <Redirect href="/(tabs)/friends" />;
}
