import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function NotificationSettingsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <AppText variant="h3" weight="bold">Notification Settings</AppText>
            <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
                This feature is coming soon.
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: Spacing.base,
        paddingTop: 60,
    },
    subtitle: {
        marginTop: Spacing.md,
    },
});
