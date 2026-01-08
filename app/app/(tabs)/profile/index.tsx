import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Package,
  MapPin,
  Bell,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login' as any);
  };

  const menuItems = [
    { icon: Package, label: 'My Orders', route: '/order/list' },
    { icon: MapPin, label: 'Saved Addresses', route: '/address/list' },
    { icon: Bell, label: 'Notifications', route: '/notifications' },
    { icon: HelpCircle, label: 'Settings & Help', route: '/settings' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={40} color={Colors.white} />
        </View>
        <AppText variant="h3" weight="bold">
          {user?.name || 'Guest User'}
        </AppText>
        <AppText variant="body" color={Colors.textSecondary}>
          {user?.email || 'guest@example.com'}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          {user?.phone || '+91 9876543210'}
        </AppText>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route as any)}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <item.icon size={22} color={Colors.text} />
              <AppText variant="body" weight="medium">
                {item.label}
              </AppText>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  menu: {
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.base,
    borderRadius: 12,
    ...Colors.shadow.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  footer: {
    padding: Spacing.xl,
  },
});
