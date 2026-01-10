import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import { GlassButton } from "./GlassButton";

describe("GlassButton", () => {
  describe("rendering", () => {
    it("should render with a label", () => {
      const { getByText } = render(
        <GlassButton label="Add a friend" onPress={() => {}} />
      );

      expect(getByText("Add a friend")).toBeTruthy();
    });

    it("should render with an icon", () => {
      const { getByTestId } = render(
        <GlassButton
          icon={<Text testID="test-icon">+</Text>}
          onPress={() => {}}
        />
      );

      expect(getByTestId("test-icon")).toBeTruthy();
    });

    it("should render with both icon and label", () => {
      const { getByText, getByTestId } = render(
        <GlassButton
          label="Add"
          icon={<Text testID="test-icon">+</Text>}
          onPress={() => {}}
        />
      );

      expect(getByText("Add")).toBeTruthy();
      expect(getByTestId("test-icon")).toBeTruthy();
    });

    it("should render the GlassView container", () => {
      const { getByTestId } = render(
        <GlassButton label="Test" onPress={() => {}} />
      );

      expect(getByTestId("glass-view")).toBeTruthy();
    });
  });

  describe("interactions", () => {
    it("should call onPress when pressed", () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <GlassButton label="Press me" onPress={onPressMock} />
      );

      fireEvent.press(getByText("Press me"));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("should call onPress when icon button is pressed", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <GlassButton
          icon={<Text>+</Text>}
          onPress={onPressMock}
          testID="icon-button"
        />
      );

      fireEvent.press(getByTestId("icon-button"));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("should have testID when provided", () => {
      const { getByTestId } = render(
        <GlassButton
          label="Test"
          onPress={() => {}}
          testID="custom-test-id"
        />
      );

      expect(getByTestId("custom-test-id")).toBeTruthy();
    });
  });
});
