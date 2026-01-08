import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Bell } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockNotifications } from '@/services/mockData';

export default function NotificationsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {mockNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationCard}
            activeOpacity={0.8}
          >
            <Bell size={20} color={Colors.primary} />
            <View style={styles.notificationContent}>
              <AppText variant="body" weight="semibold">
                {notification.title}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {notification.message}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: Spacing.base,
    gap: Spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Colors.shadow.sm,
  },
  notificationContent: {
    flex: 1,
    gap: Spacing.xs,
  },
});
