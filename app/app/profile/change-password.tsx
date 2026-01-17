import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { changePassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMatch, setIsMatch] = useState(false);

    useEffect(() => {
        setIsMatch(newPassword.length > 0 && newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    const handleSubmit = async () => {
        if (!isMatch) return;

        setLoading(true);
        const result = await changePassword(newPassword);
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Your password has been changed successfully.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Error', result.message || 'Failed to change password.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>
                <AppText variant="h4" weight="bold">Change Password</AppText>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>
                        New Password
                    </AppText>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor={Colors.textLight}
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputGroup}>
                    <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>
                        Confirm Password
                    </AppText>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-enter new password"
                        placeholderTextColor={Colors.textLight}
                        secureTextEntry
                    />
                    {!isMatch && confirmPassword.length > 0 && (
                        <AppText variant="small" color={Colors.error} style={{ marginTop: 4 }}>
                            Passwords do not match
                        </AppText>
                    )}
                </View>

                <Button
                    label="SUBMIT"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!isMatch || loading}
                    variant={isMatch ? 'primary' : 'disabled'}
                    style={styles.submitButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.base,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 4,
    },
    formContainer: {
        padding: Spacing.lg,
        gap: Spacing.xl,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 'bold',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 8,
        fontSize: 16,
        color: Colors.text,
    },
    submitButton: {
        marginTop: Spacing.xl,
    },
});
