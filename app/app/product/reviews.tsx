import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function ProductReviewsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Reviews & Ratings' }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <AppText variant="h4" weight="bold">
          Customer Reviews
        </AppText>
        <AppText variant="body" color={Colors.textSecondary}>
          Reviews coming soon
        </AppText>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
});
