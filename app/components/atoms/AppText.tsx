import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, StyleProp } from 'react-native';
import Colors from '@/constants/colors';
import Typography from '@/constants/typography';

interface AppTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export default function AppText({
  children,
  variant = 'body',
  color = Colors.text,
  weight = 'regular',
  align = 'left',
  style,
  numberOfLines,
}: AppTextProps) {
  return (
    <RNText
      style={[
        styles[variant],
        { color, fontWeight: Typography.fontWeights[weight], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: Typography.fontSizes['4xl'],
    lineHeight: Typography.fontSizes['4xl'] * Typography.lineHeights.tight,
  },
  h2: {
    fontSize: Typography.fontSizes['3xl'],
    lineHeight: Typography.fontSizes['3xl'] * Typography.lineHeights.tight,
  },
  h3: {
    fontSize: Typography.fontSizes['2xl'],
    lineHeight: Typography.fontSizes['2xl'] * Typography.lineHeights.tight,
  },
  h4: {
    fontSize: Typography.fontSizes.xl,
    lineHeight: Typography.fontSizes.xl * Typography.lineHeights.normal,
  },
  body: {
    fontSize: Typography.fontSizes.base,
    lineHeight: Typography.fontSizes.base * Typography.lineHeights.normal,
  },
  caption: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: Typography.fontSizes.sm * Typography.lineHeights.normal,
  },
  small: {
    fontSize: Typography.fontSizes.xs,
    lineHeight: Typography.fontSizes.xs * Typography.lineHeights.normal,
  },
});
