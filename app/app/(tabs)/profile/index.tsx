import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Package,
  Heart,
  Gift,
  Headphones,
  Zap,
  User,
  CreditCard,
  MapPin,
  Languages,
  Bell,
  ShieldCheck,
  PenSquare,
  MessageSquare,
  Store,
  FileText,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
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

  const topGridItems = [
    { icon: Package, label: 'Orders', route: '/order/list' },
    { icon: Heart, label: 'Wishlist', route: '/wishlist' },
    { icon: Gift, label: 'Coupons', route: '/coupons' },
    { icon: Headphones, label: 'Help Center', route: '/help' },
  ];

  const Sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: Zap, label: 'Plus', route: '/plus' },
        { icon: User, label: 'Edit Profile', route: '/profile/edit' },
        { icon: CreditCard, label: 'Saved Credit / Debit & Gift Cards', route: '/cards' },
        { icon: MapPin, label: 'Saved Addresses', route: '/address/list' },
        { icon: Languages, label: 'Select Language', route: '/language' },
        { icon: Bell, label: 'Notification Settings', route: '/notifications' },
        { icon: ShieldCheck, label: 'Privacy Center', route: '/privacy' },
      ],
    },
    {
      title: 'My Activity',
      items: [
        { icon: PenSquare, label: 'Reviews', route: '/reviews' },
        { icon: MessageSquare, label: 'Questions & Answers', route: '/qa' },
      ],
    },
    {
      title: 'Earn with Nevyra',
      items: [
        { icon: Store, label: 'Sell on Nevyra', route: '/sell' },
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <AppText variant="h3" weight="bold" style={styles.userName}>
              {user?.name || 'sunand sunand'}
            </AppText>
            <View style={styles.coinBadge}>
              <Zap size={14} color="#FFB800" fill="#FFB800" />
              <AppText variant="caption" weight="bold">0</AppText>
            </View>
          </View>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.headerSubtext}>
            FREE Youtube Premium, SuperCoin cashback and more privileges with <AppText weight="bold">BLACK</AppText>
          </AppText>
          <TouchableOpacity style={styles.exploreButton}>
            <AppText variant="body" weight="bold" color={Colors.white}>
              Explore BLACK
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Grid */}
      <View style={styles.gridContainer}>
        {topGridItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => item.route && router.push(item.route as any)}
          >
            <item.icon size={22} color={Colors.info} />
            <AppText variant="body" weight="medium" style={styles.gridLabel}>
              {item.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Recently Viewed Stores */}
      <View style={styles.section}>
        <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
          Recently Viewed Stores
        </AppText>
        <View style={styles.emptyRecentStores}>
          <AppText variant="caption" color={Colors.textLight}>No recently viewed stores</AppText>
        </View>
        <View style={styles.sectionDivider} />
      </View>

      {/* Sections */}
      {Sections.map((section, sIndex) => (
        <View key={sIndex} style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            {section.title}
          </AppText>
          {section.items.map((item, iIndex) => (
            <TouchableOpacity
              key={iIndex}
              style={styles.menuItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color={Colors.info} />
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

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <AppText variant="body" weight="bold" color={Colors.info}>
            Log Out
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  headerContainer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  headerCard: {
    backgroundColor: '#F5F9FF',
    padding: Spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E9F5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: 18,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 4,
  },
  headerSubtext: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  exploreButton: {
    backgroundColor: '#1B1B1B',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 4,
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
  emptyRecentStores: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
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
