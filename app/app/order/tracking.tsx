import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function OrderTrackingScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Track Order' }} />
      <View style={styles.container}>
        <AppText variant="h4" weight="bold">
          Order Tracking
        </AppText>
        <AppText variant="body" color={Colors.textSecondary}>
          Tracking details coming soon
        </AppText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
});
