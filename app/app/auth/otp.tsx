import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function OtpScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Verify OTP' }} />
      <View style={styles.container}>
        <AppText variant="h3" weight="semibold">
          OTP Verification
        </AppText>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={styles.message}
        >
          Enter the OTP sent to your phone
        </AppText>
        <Button title="Verify" onPress={() => {}} fullWidth />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    gap: Spacing.lg,
  },
  message: {
    marginBottom: Spacing.xl,
  },
});
