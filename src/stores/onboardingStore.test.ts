import { useOnboardingStore } from './onboardingStore';

describe('onboardingStore', () => {
  beforeEach(() => {
    useOnboardingStore.setState({
      hasCompletedOnboarding: false,
      _hasHydrated: false,
    });
  });

  it('should start with hasCompletedOnboarding as false', () => {
    const { hasCompletedOnboarding } = useOnboardingStore.getState();
    expect(hasCompletedOnboarding).toBe(false);
  });

  it('should start with _hasHydrated as false', () => {
    const { _hasHydrated } = useOnboardingStore.getState();
    expect(_hasHydrated).toBe(false);
  });

  describe('completeOnboarding', () => {
    it('should set hasCompletedOnboarding to true', () => {
      const { completeOnboarding } = useOnboardingStore.getState();
      completeOnboarding();
      expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
    });
  });

  describe('reset', () => {
    it('should set hasCompletedOnboarding back to false', () => {
      useOnboardingStore.setState({ hasCompletedOnboarding: true });
      const { reset } = useOnboardingStore.getState();
      reset();
      expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(false);
    });
  });
});
