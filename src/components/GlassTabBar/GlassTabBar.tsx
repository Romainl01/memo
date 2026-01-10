import { View, Text, Pressable, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import type { SFSymbol } from "sf-symbols-typescript";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/src/constants/colors";

type TabConfig = {
  name: string;
  label: string;
  icon: SFSymbol;
  iconFilled: SFSymbol;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  index: {
    name: "index",
    label: "Journal",
    icon: "book",
    iconFilled: "book.fill",
  },
  friends: {
    name: "friends",
    label: "Friends",
    icon: "person.2",
    iconFilled: "person.2.fill",
  },
  settings: {
    name: "settings",
    label: "Settings",
    icon: "gearshape",
    iconFilled: "gearshape.fill",
  },
};

/**
 * Custom liquid glass tab bar using iOS 26+ GlassView.
 * Integrates with @react-navigation/bottom-tabs.
 *
 * TODO: Add fallback icons for Android/Web using @expo/vector-icons
 * expo-symbols (SF Symbols) only works on iOS. Need to conditionally
 * render Ionicons or MaterialIcons based on Platform.OS.
 */
export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <GlassView style={styles.glassBackground}>
        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name] || {
              name: route.name,
              label: route.name,
              icon: "questionmark" as SFSymbol,
              iconFilled: "questionmark.circle.fill" as SFSymbol,
            };

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tab}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={config.label}
              >
                {isFocused && <View style={styles.selectionIndicator} />}
                <SymbolView
                  name={isFocused ? config.iconFilled : config.icon}
                  size={22}
                  weight={isFocused ? "semibold" : "regular"}
                  tintColor={isFocused ? colors.primary : colors.neutralDark}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.label,
                    isFocused ? styles.labelFocused : styles.labelUnfocused,
                  ]}
                >
                  {config.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 25,
  },
  glassBackground: {
    borderRadius: 1000,
    overflow: "hidden",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    width: 102,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 7,
    paddingHorizontal: 8,
    position: "relative",
  },
  selectionIndicator: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EDEDED",
    borderRadius: 100,
  },
  icon: {
    width: 28,
    height: 28,
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 1,
    textAlign: "center",
    zIndex: 1,
  },
  labelFocused: {
    fontFamily: "Inter_500Medium",
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: -0.1,
  },
  labelUnfocused: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    color: colors.neutralDark,
  },
});
