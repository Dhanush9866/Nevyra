import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }
    if (!email) {
      alert('Email missing');
      return;
    }

    try {
      setLoading(true);
      const { apiService } = require('@/services/api');
      const response = await apiService.verifyOTP(email, otp);

      if (response.success) {
        // Navigate to Reset Password screen with email and otp
        router.push({
          pathname: '/auth/reset-password',
          params: { email, otp }
        });
      } else {
        alert(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      alert(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
          Enter the OTP sent to your email: {email}
        </AppText>

        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={Colors.textLight}
        />

        <Button
          title={loading ? "Verifying..." : "Verify"}
          onPress={handleVerify}
          disabled={loading}
          fullWidth
        />
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
  input: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.lg,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
