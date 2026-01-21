import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Lock } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';

export default function ResetPasswordScreen() {
    const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            alert('Please enter all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const { apiService } = require('@/services/api');
            const response = await apiService.resetPassword(email, otp, newPassword);

            if (response.success) {
                Alert.alert('Success', 'Password reset successful', [
                    { text: 'OK', onPress: () => router.replace('/auth/login') }
                ]);
            } else {
                alert(response.message || 'Failed to reset password');
            }
        } catch (error: any) {
            alert(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Set New Password' }} />
            <View style={styles.container}>
                <AppText variant="h3" weight="semibold">
                    New Password
                </AppText>
                <AppText
                    variant="body"
                    color={Colors.textSecondary}
                    style={styles.message}
                >
                    Create a new strong password for your account
                </AppText>

                <View style={styles.inputContainer}>
                    <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholderTextColor={Colors.textLight}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor={Colors.textLight}
                    />
                </View>

                <Button
                    title={loading ? "Resetting..." : "Reset Password"}
                    onPress={handleResetPassword}
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
