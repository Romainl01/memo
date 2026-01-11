import React from 'react';
import { View, Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/src/constants/colors';

interface AvatarProps {
  name: string;
  imageUri?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Extracts initials from a name
 * "John Doe" -> "JD"
 * "Madonna" -> "M"
 * "Mary Jane Watson" -> "MW" (first and last)
 */
function getInitials(name: string): string {
  if (!name.trim()) return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return (first + last).toUpperCase();
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUri,
  size = 80,
  style,
}) => {
  const initials = getInitials(name);
  const borderRadius = size / 2;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius,
    overflow: 'hidden',
  };

  const initialsContainerStyle: ViewStyle = {
    ...containerStyle,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View
      testID="avatar-container"
      style={[containerStyle, style]}
      accessibilityLabel={`${name}'s avatar`}
      accessibilityRole="image"
    >
      {imageUri ? (
        <Image
          testID="avatar-image"
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View testID="avatar-initials" style={initialsContainerStyle}>
          <Text
            style={[
              styles.initialsText,
              { fontSize: size * 0.4 },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initialsText: {
    color: colors.neutralWhite,
    fontWeight: '600',
  },
});

export { Avatar };
export type { AvatarProps };
