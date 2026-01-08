import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function ProductGalleryScreen() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Product Images', presentation: 'modal' }}
      />
      <View style={styles.container}>
        <AppText variant="h4" weight="bold">
          Image Gallery
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
  },
});
