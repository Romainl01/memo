import { Redirect } from "expo-router";

/**
 * Root index redirects to the tabs navigator.
 * The Friends tab is set as the initial route in (tabs)/_layout.tsx.
 */
export default function Index() {
  return <Redirect href="/(tabs)/friends" />;
}
