import { Tabs } from "expo-router";
import { GlassTabBar } from "@/src/components/GlassTabBar";

/**
 * Tab navigator layout with custom liquid glass tab bar.
 * Routes: index (Journal), friends, settings
 */
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="friends"
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
