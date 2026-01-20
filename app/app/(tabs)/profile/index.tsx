import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Package,
  Heart,
  User,
  MapPin,
  Bell,
  Lock,
  Store,
  FileText,
  HelpCircle,
  ChevronRight,
  Edit,
  ArrowLeft,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { Linking } from 'react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, addresses, logout, refreshUser } = useAuth();

  // Refresh user data when screen comes into focus (e.g., after returning from edit screen)
  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
    }, [refreshUser])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login' as any);
  };

  const topGridItems = [
    { icon: Package, label: 'Orders', route: '/order/list' },
    { icon: Heart, label: 'Wishlist', route: '/wishlist' }
  ];

  const Sections = [
    {
      title: 'My Account',
      items: [
        { icon: User, label: 'Edit Profile', route: '/profile/edit' },
        { icon: Lock, label: 'Change Password', route: '/profile/change-password' },
        { icon: Bell, label: 'Notification Settings', route: '/profile/notifications' },
        { icon: MapPin, label: 'Saved Addresses', route: '/checkout/address-list' },
      ],
    },
    {
      title: 'My Activity',
      items: [
        { icon: Edit, label: 'Reviews', route: '/reviews' },
        { icon: HelpCircle, label: 'Questions & Answers', route: '/qa' },
      ],
    },
    {
      title: 'My Shopping',
      items: [
        { icon: Store, label: 'Sell on Zythova', route: 'https://nevyra-seller.onrender.com/' },
      ],
    },
    {
      title: 'Feedback & Information',
      items: [
        { icon: FileText, label: 'Terms, Policies and Licenses', route: '/terms' },
        { icon: HelpCircle, label: 'Browse FAQs', route: '/faqs' },
      ],
    },
  ];

  // Create unique key for avatar image to force re-render when avatar changes
  const avatarKey = user?.avatar || 'no-avatar';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h4" weight="bold">My Profile</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileContent}>
            <View style={styles.profileDataRow}>
              <View style={styles.avatarContainer}>
                {user?.avatar ? (
                  <Image
                    key={avatarKey}
                    source={{ uri: user.avatar }}
                    style={styles.avatarImage}
                    contentFit="cover"
                    cachePolicy="none"
                  />
                ) : (
                  <AppText variant="h2" weight="bold" color={Colors.white}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AppText>
                )}
              </View>
              <View style={styles.userDetails}>
                <AppText variant="h3" weight="bold" style={styles.userName} numberOfLines={1}>
                  {user?.name || 'Guest'}
                </AppText>
                <AppText variant="body" color={Colors.textSecondary}>
                  {user?.phone || '+91 -'}
                </AppText>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit' as any)}>
              <AppText variant="small" weight="bold" color={Colors.primary}>
                <Edit size={14} color={Colors.primary} /> Edit
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.deliveryInfoContainer}>
            <TouchableOpacity
              style={styles.deliveryInfo}
              onPress={() => router.push('/checkout/address-list' as any)}
            >
              <AppText variant="body" color={Colors.textSecondary}>
                Delivering to: <AppText weight="bold" color={Colors.text}>
                  {addresses.find(a => a.isDefault)?.city || addresses[0]?.city || 'Select Location'}
                </AppText>
              </AppText>
              <ChevronRight size={16} color={Colors.text} style={{ transform: [{ rotate: '90deg' }], marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {topGridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <item.icon size={22} color={Colors.primary} />
              <AppText variant="body" weight="medium" style={styles.gridLabel}>
                {item.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {Sections.map((section, sIndex) => (
          <View key={sIndex} style={styles.section}>
            <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
              {section.title}
            </AppText>
            {section.items.map((item, iIndex) => (
              <TouchableOpacity
                key={iIndex}
                style={styles.menuItem}
                onPress={() => {
                  if (item.route) {
                    if (item.route.startsWith('http')) {
                      Linking.openURL(item.route);
                    } else {
                      router.push(item.route as any);
                    }
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <item.icon size={20} color={Colors.primary} />
                  <AppText variant="body" style={styles.menuItemLabel}>
                    {item.label}
                  </AppText>
                </View>
                <ChevronRight size={18} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
            <View style={styles.sectionDivider} />
          </View>
        ))}

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AppText variant="body" weight="bold" color={Colors.primary}>
              Log Out
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
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
  profileSection: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  profileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  profileDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0E6FF',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userDetails: {
    gap: 2,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    color: '#333',
    letterSpacing: 0.5,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F8F0FF',
    borderWidth: 1,
    borderColor: '#E6D6FF',
    marginTop: 8,
  },
  deliveryInfoContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.sm,
    backgroundColor: Colors.white,
  },
  gridItem: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    margin: '2%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: Spacing.sm,
  },
  gridLabel: {
    fontSize: 14,
  },
  divider: {
    height: 8,
    backgroundColor: '#F1F3F6',
  },
  section: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  menuItemLabel: {
    fontSize: 14,
    color: '#333',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F1F3F6',
    marginTop: Spacing.md,
  },
  logoutContainer: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPadding: {
    height: 40,
    backgroundColor: Colors.white,
  },
});
