import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import { EmptyFriendsScreen } from "./EmptyFriendsScreen";

// Mock Alert
jest.spyOn(Alert, "alert");

describe("EmptyFriendsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the app title", () => {
      const { getByText } = render(<EmptyFriendsScreen />);

      expect(getByText("Pia")).toBeTruthy();
    });

    it("should render the hero title", () => {
      const { getByText } = render(<EmptyFriendsScreen />);

      expect(getByText("Keep your closest within reach")).toBeTruthy();
    });

    it("should render the hero subtitle", () => {
      const { getByText } = render(<EmptyFriendsScreen />);

      expect(
        getByText(
          "Add friends to stay in touch, share memories, and never miss a birthday"
        )
      ).toBeTruthy();
    });

    it("should render the add friend CTA button", () => {
      const { getByText } = render(<EmptyFriendsScreen />);

      expect(getByText("Add a friend")).toBeTruthy();
    });

    it("should render the plus icon button", () => {
      const { getByTestId } = render(<EmptyFriendsScreen />);

      expect(getByTestId("add-friend-button")).toBeTruthy();
    });

    it("should render the plus SF Symbol", () => {
      const { getByTestId } = render(<EmptyFriendsScreen />);

      expect(getByTestId("symbol-plus")).toBeTruthy();
    });
  });

  describe("interactions", () => {
    it("should show alert when plus button is pressed", () => {
      const { getByTestId } = render(<EmptyFriendsScreen />);

      fireEvent.press(getByTestId("add-friend-button"));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Coming Soon",
        "Add friend feature will be available soon!"
      );
    });

    it("should show alert when add friend CTA is pressed", () => {
      const { getByTestId } = render(<EmptyFriendsScreen />);

      fireEvent.press(getByTestId("add-friend-cta"));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Coming Soon",
        "Add friend feature will be available soon!"
      );
    });
  });
});
