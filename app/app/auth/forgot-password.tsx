import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendResetLink = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const { apiService } = require('@/services/api');
      const response = await apiService.forgotPassword(email);

      if (response.success) {
        // Navigate to OTP screen with email params
        router.push({
          pathname: '/auth/otp',
          params: { email }
        });
      } else {
        alert(response.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      alert(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Reset Password' }} />
      <View style={styles.container}>
        <AppText variant="h3" weight="semibold">
          Forgot Password?
        </AppText>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={styles.message}
        >
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </AppText>

        <View style={styles.inputContainer}>
          <Mail
            size={20}
            color={Colors.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <Button
          title={loading ? "Sending..." : "Send OTP"}
          onPress={handleSendResetLink}
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
    marginBottom: Spacing.base,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizes.base,
    color: Colors.text,
  },
});
