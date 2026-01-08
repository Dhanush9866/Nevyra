import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import AppText from './AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'primary';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function Badge({
  text,
  variant = 'primary',
  size = 'md',
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[size], style]}>
      <AppText
        variant={size === 'sm' ? 'small' : 'caption'}
        color={Colors.white}
        weight="semibold"
      >
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  success: {
    backgroundColor: Colors.success,
  },
  error: {
    backgroundColor: Colors.error,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  info: {
    backgroundColor: Colors.info,
  },
});
