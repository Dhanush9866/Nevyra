import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

interface IconButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function IconButton({
  icon: Icon,
  onPress,
  size = 24,
  color = Colors.text,
  backgroundColor,
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, backgroundColor && { backgroundColor }, style]}
    >
      <Icon size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
