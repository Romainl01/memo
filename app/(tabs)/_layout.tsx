import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useTheme } from '@/src/hooks/useTheme';

export const unstable_settings = {
  initialRouteName: 'friends',
};

/**
 * Native tab navigator using iOS Liquid Glass effect.
 * Note: In Expo Go, liquid glass on NativeTabs can be flaky.
 * For reliable glass effects, use a development build (npx expo run:ios).
 */
export default function TabLayout(): React.ReactElement {
  const { colors } = useTheme();

  return (
    <NativeTabs tintColor={colors.primary}>
      <NativeTabs.Trigger name='index'>
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Journal</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='friends'>
        <Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} />
        <Label>Friends</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='settings'>
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
