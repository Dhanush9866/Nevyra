import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import {
  HelpCircle,
  MessageCircle,
  Shield,
  FileText,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const settingsItems = [
  {
    icon: HelpCircle,
    title: 'Help & Support',
    subtitle: 'Get help with your orders',
  },
  {
    icon: MessageCircle,
    title: 'Contact Us',
    subtitle: 'Chat with our support team',
  },
  {
    icon: Shield,
    title: 'Privacy Policy',
    subtitle: 'Read our privacy policy',
  },
  {
    icon: FileText,
    title: 'Terms & Conditions',
    subtitle: 'View terms of service',
  },
];

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings & Help' }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingCard}
            activeOpacity={0.7}
          >
            <item.icon size={24} color={Colors.primary} />
            <View style={styles.settingContent}>
              <AppText variant="body" weight="semibold">
                {item.title}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {item.subtitle}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.appInfo}>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            align="center"
          >
            Zythova v1.0.0
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            align="center"
          >
            Made with ❤️
          </AppText>
        </View>
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
  settingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Colors.shadow.sm,
  },
  settingContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  appInfo: {
    marginTop: Spacing['2xl'],
    gap: Spacing.xs,
  },
});
