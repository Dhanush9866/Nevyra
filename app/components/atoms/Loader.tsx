import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppText from './AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({
  size = 'large',
  color = Colors.primary,
  text,
  fullScreen = false,
}: LoaderProps) {
  const content = (
    <>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={styles.text}
        >
          {text}
        </AppText>
      )}
    </>
  );

  if (fullScreen) {
    return <View style={styles.fullScreen}>{content}</View>;
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: Spacing.md,
  },
});
