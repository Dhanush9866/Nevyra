import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function FilterScreen() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Filter & Sort', presentation: 'modal' }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <View style={styles.section}>
            <AppText variant="h4" weight="bold">
              Sort By
            </AppText>
            <AppText variant="body" color={Colors.textSecondary}>
              Filter options coming soon
            </AppText>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Apply Filters" onPress={() => {}} fullWidth />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
