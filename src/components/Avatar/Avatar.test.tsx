import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { Avatar } from './Avatar';

// Helper to flatten style arrays
const flattenStyle = (style: any) => StyleSheet.flatten(style);

describe('Avatar', () => {
  describe('rendering with image', () => {
    it('should render image when imageUri is provided', () => {
      const { getByTestId } = render(
        <Avatar name="John Doe" imageUri="https://example.com/photo.jpg" />
      );

      const image = getByTestId('avatar-image');
      expect(image).toBeTruthy();
      expect(image.props.source.uri).toBe('https://example.com/photo.jpg');
    });

    it('should not render initials when image is provided', () => {
      const { queryByTestId } = render(
        <Avatar name="John Doe" imageUri="https://example.com/photo.jpg" />
      );

      expect(queryByTestId('avatar-initials')).toBeNull();
    });
  });

  describe('rendering with initials fallback', () => {
    it('should render initials when no imageUri is provided', () => {
      const { getByTestId, getByText } = render(
        <Avatar name="John Doe" />
      );

      expect(getByTestId('avatar-initials')).toBeTruthy();
      expect(getByText('JD')).toBeTruthy();
    });

    it('should render single initial for single name', () => {
      const { getByText } = render(
        <Avatar name="Madonna" />
      );

      expect(getByText('M')).toBeTruthy();
    });

    it('should handle names with multiple spaces', () => {
      const { getByText } = render(
        <Avatar name="Mary Jane Watson" />
      );

      // Should use first and last name initials
      expect(getByText('MW')).toBeTruthy();
    });

    it('should handle empty name gracefully', () => {
      const { getByText } = render(
        <Avatar name="" />
      );

      expect(getByText('?')).toBeTruthy();
    });

    it('should uppercase initials', () => {
      const { getByText } = render(
        <Avatar name="john doe" />
      );

      expect(getByText('JD')).toBeTruthy();
    });
  });

  describe('sizing', () => {
    it('should use default size of 80', () => {
      const { getByTestId } = render(
        <Avatar name="John Doe" />
      );

      const container = getByTestId('avatar-container');
      const style = flattenStyle(container.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: 80,
          height: 80,
        })
      );
    });

    it('should accept custom size', () => {
      const { getByTestId } = render(
        <Avatar name="John Doe" size={120} />
      );

      const container = getByTestId('avatar-container');
      const style = flattenStyle(container.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: 120,
          height: 120,
        })
      );
    });

    it('should have circular shape (borderRadius = size/2)', () => {
      const { getByTestId } = render(
        <Avatar name="John Doe" size={100} />
      );

      const container = getByTestId('avatar-container');
      const style = flattenStyle(container.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          borderRadius: 50,
        })
      );
    });
  });

  describe('accessibility', () => {
    it('should have accessible label with name', () => {
      const { getByLabelText } = render(
        <Avatar name="John Doe" />
      );

      expect(getByLabelText("John Doe's avatar")).toBeTruthy();
    });
  });
});
