import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { GlassTabBar } from "./GlassTabBar";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Helper to create mock navigation props
const createMockProps = (
  currentIndex: number = 0
): BottomTabBarProps => ({
  state: {
    index: currentIndex,
    routes: [
      { key: "index-key", name: "index", params: undefined },
      { key: "friends-key", name: "friends", params: undefined },
      { key: "settings-key", name: "settings", params: undefined },
    ],
    key: "tab-key",
    routeNames: ["index", "friends", "settings"],
    type: "tab",
    stale: false,
    history: [],
    preloadedRouteKeys: [],
  },
  navigation: {
    emit: jest.fn(() => ({ defaultPrevented: false })),
    navigate: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => false),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
  } as unknown as BottomTabBarProps["navigation"],
  descriptors: {},
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
});

describe("GlassTabBar", () => {
  describe("rendering", () => {
    it("should render all three tabs", () => {
      const { getByText } = render(<GlassTabBar {...createMockProps()} />);

      expect(getByText("Journal")).toBeTruthy();
      expect(getByText("Friends")).toBeTruthy();
      expect(getByText("Settings")).toBeTruthy();
    });

    it("should render SF Symbol icons for each tab", () => {
      const { getByTestId } = render(<GlassTabBar {...createMockProps(0)} />);

      // First tab (Journal) is focused, so it shows filled icon
      expect(getByTestId("symbol-book.fill")).toBeTruthy();
      // Other tabs show outline icons
      expect(getByTestId("symbol-person.2")).toBeTruthy();
      expect(getByTestId("symbol-gearshape")).toBeTruthy();
    });

    it("should show filled icon for focused tab", () => {
      const { getByTestId } = render(<GlassTabBar {...createMockProps(1)} />);

      // Friends tab (index 1) is focused
      expect(getByTestId("symbol-person.2.fill")).toBeTruthy();
      // Others show outline icons
      expect(getByTestId("symbol-book")).toBeTruthy();
      expect(getByTestId("symbol-gearshape")).toBeTruthy();
    });

    it("should render GlassView background", () => {
      const { getByTestId } = render(<GlassTabBar {...createMockProps()} />);

      expect(getByTestId("glass-view")).toBeTruthy();
    });
  });

  describe("interactions", () => {
    it("should emit tabPress event when tab is pressed", () => {
      const mockProps = createMockProps(0);
      const { getByText } = render(<GlassTabBar {...mockProps} />);

      fireEvent.press(getByText("Friends"));

      expect(mockProps.navigation.emit).toHaveBeenCalledWith({
        type: "tabPress",
        target: "friends-key",
        canPreventDefault: true,
      });
    });

    it("should navigate to tab when pressed and not focused", () => {
      const mockProps = createMockProps(0);
      const { getByText } = render(<GlassTabBar {...mockProps} />);

      fireEvent.press(getByText("Settings"));

      expect(mockProps.navigation.navigate).toHaveBeenCalledWith("settings");
    });

    it("should not navigate when pressing already focused tab", () => {
      const mockProps = createMockProps(0);
      const { getByText } = render(<GlassTabBar {...mockProps} />);

      fireEvent.press(getByText("Journal"));

      expect(mockProps.navigation.navigate).not.toHaveBeenCalled();
    });

    it("should not navigate when event is prevented", () => {
      const mockProps = createMockProps(0);
      (mockProps.navigation.emit as jest.Mock).mockReturnValue({
        defaultPrevented: true,
      });
      const { getByText } = render(<GlassTabBar {...mockProps} />);

      fireEvent.press(getByText("Friends"));

      expect(mockProps.navigation.navigate).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("should have correct accessibility labels", () => {
      const { getByLabelText } = render(<GlassTabBar {...createMockProps()} />);

      expect(getByLabelText("Journal")).toBeTruthy();
      expect(getByLabelText("Friends")).toBeTruthy();
      expect(getByLabelText("Settings")).toBeTruthy();
    });

    it("should mark focused tab as selected", () => {
      const { getByLabelText } = render(<GlassTabBar {...createMockProps(1)} />);

      const friendsTab = getByLabelText("Friends");
      expect(friendsTab.props.accessibilityState).toEqual({ selected: true });
    });
  });
});
