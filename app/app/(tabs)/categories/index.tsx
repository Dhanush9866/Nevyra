import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Search, Bell, ShoppingCart } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

// Categories from frontend/src/components/CategoryCards.tsx
const HARDCODED_CATEGORIES = [
  { id: '1', name: "Medical & Pharmacy", slug: "medical-and-pharmacy", image: 'https://cdn-icons-png.flaticon.com/512/3022/3022567.png' },
  { id: '2', name: "Groceries", slug: "groceries", image: 'https://cdn-icons-png.flaticon.com/512/3724/3724788.png' },
  { id: '3', name: "Fashion & Beauty", slug: "fashion-and-beauty", image: 'https://cdn-icons-png.flaticon.com/512/3050/3050239.png' },
  { id: '4', name: "Devices", slug: "devices", image: 'https://cdn-icons-png.flaticon.com/512/644/644458.png' },
  { id: '5', name: "Electrical", slug: "electrical", image: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png' },
  { id: '6', name: "Automotive", slug: "automotive", image: 'https://cdn-icons-png.flaticon.com/512/296/296216.png' },
  { id: '7', name: "Sports", slug: "sports", image: 'https://cdn-icons-png.flaticon.com/512/857/857455.png' },
  { id: '8', name: "Home Interior", slug: "home-interior", image: 'https://cdn-icons-png.flaticon.com/512/263/263115.png' },
];

// Mock subcategories
const MOCK_SUBCATEGORIES: Record<string, Array<{ id: string, name: string, image: string }>> = {
  'Medical & Pharmacy': [
    { id: 'm1', name: 'Medicines', image: 'https://cdn-icons-png.flaticon.com/512/883/883407.png' },
    { id: 'm2', name: 'Ayurveda', image: 'https://cdn-icons-png.flaticon.com/512/3855/3855905.png' },
    { id: 'm3', name: 'Health Devices', image: 'https://cdn-icons-png.flaticon.com/512/2966/2966334.png' },
  ],
  'Groceries': [
    { id: 'g1', name: 'Vegetables', image: 'https://cdn-icons-png.flaticon.com/512/2329/2329865.png' },
    { id: 'g2', name: 'Fruits', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
    { id: 'g3', name: 'Dairy', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png' },
    { id: 'g4', name: 'Beverages', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png' },
    { id: 'g5', name: 'Snacks', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
  ],
  'Fashion & Beauty': [
    { id: 'f1', name: 'Men\'s Clothing', image: 'https://cdn-icons-png.flaticon.com/512/2950/2950586.png' },
    { id: 'f2', name: 'Women\'s Clothing', image: 'https://cdn-icons-png.flaticon.com/512/3534/3534312.png' },
    { id: 'f3', name: 'Kids\' Fashion', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050253.png' },
    { id: 'f4', name: 'Shoes', image: 'https://cdn-icons-png.flaticon.com/512/2589/2589903.png' },
    { id: 'f5', name: 'Watches', image: 'https://cdn-icons-png.flaticon.com/512/1785/1785265.png' },
    { id: 'f6', name: 'Bags & Luggage', image: 'https://cdn-icons-png.flaticon.com/512/2662/2662503.png' },
  ],
  'Devices': [
    { id: 'd1', name: 'Mobiles', image: 'https://cdn-icons-png.flaticon.com/512/644/644458.png' },
    { id: 'd2', name: 'Laptops', image: 'https://cdn-icons-png.flaticon.com/512/428/428001.png' },
    { id: 'd3', name: 'Tablets', image: 'https://cdn-icons-png.flaticon.com/512/0/190.png' },
    { id: 'd4', name: 'Smart Watches', image: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png' },
    { id: 'd5', name: 'Headphones', image: 'https://cdn-icons-png.flaticon.com/512/27/27220.png' },
  ],
  'Electrical': [
    { id: 'e1', name: 'Wiring', image: 'https://cdn-icons-png.flaticon.com/512/4607/4607878.png' },
    { id: 'e2', name: 'Switches', image: 'https://cdn-icons-png.flaticon.com/512/4418/4418579.png' },
    { id: 'e3', name: 'Bulbs', image: 'https://cdn-icons-png.flaticon.com/512/2987/2987998.png' },
  ],
  'Automotive': [
    { id: 'a1', name: 'Car Accessories', image: 'https://cdn-icons-png.flaticon.com/512/2555/2555013.png' },
    { id: 'a2', name: 'Bike Accessories', image: 'https://cdn-icons-png.flaticon.com/512/3097/3097136.png' },
    { id: 'a3', name: 'Spare Parts', image: 'https://cdn-icons-png.flaticon.com/512/614/614051.png' },
  ],
  'Sports': [
    { id: 's1', name: 'Cricket', image: 'https://cdn-icons-png.flaticon.com/512/857/857455.png' },
    { id: 's2', name: 'Football', image: 'https://cdn-icons-png.flaticon.com/512/53/53283.png' },
    { id: 's3', name: 'Fitness', image: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png' },
  ],
  'Home Interior': [
    { id: 'h1', name: 'Decor', image: 'https://cdn-icons-png.flaticon.com/512/263/263115.png' },
    { id: 'h2', name: 'Furniture', image: 'https://cdn-icons-png.flaticon.com/512/2603/2603741.png' },
    { id: 'h3', name: 'Curtains', image: 'https://cdn-icons-png.flaticon.com/512/2311/2311531.png' },
  ]
};

const DEFAULT_IMAGE = 'https://cdn-icons-png.flaticon.com/512/263/263115.png'; // Generic Box

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export default function CategoriesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(HARDCODED_CATEGORIES[0]); // Default to first item

  const subCategories = useMemo(() => {
    return MOCK_SUBCATEGORIES[selectedCategory.name] || MOCK_SUBCATEGORIES['Medical & Pharmacy']; // Fallback for demo
  }, [selectedCategory]);

  const renderSidebarItem = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.sidebarItem, isSelected && styles.sidebarItemSelected]}
        onPress={() => setSelectedCategory(item)}
        activeOpacity={0.8}
      >
        <View style={styles.sidebarIconContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.sidebarIcon}
            contentFit="contain"
          />
        </View>
        <AppText
          variant="caption"
          style={[styles.sidebarText, isSelected && styles.sidebarTextSelected]}
          numberOfLines={2}
          align="center"
        >
          {item.name}
        </AppText>
        {isSelected && <View style={styles.activeIndicatorLeft} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <LinearGradient
              colors={['rgba(123, 47, 191, 0.9)', 'transparent']}
              style={styles.headerGradient}
            >
              <AppText variant="h3" color={Colors.white} weight="bold">
                Zythova
              </AppText>
            </LinearGradient>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <IconButton
                icon={Bell}
                onPress={() => router.push('/notifications' as any)}
                color={Colors.white}
              />
              <IconButton
                icon={ShoppingCart}
                onPress={() => router.push('/(tabs)/cart')}
                color={Colors.white}
              />
            </View>
          ),
        }}
      />

      <LinearGradient
        colors={[Colors.gradient.primary[0], 'transparent']}
        style={styles.topGradient}
      />

      {/* Search Bar - Styled like Home */}
      <View style={styles.fixedSearchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={Colors.textLight}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={HARDCODED_CATEGORIES}
            renderItem={renderSidebarItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarContent}
          />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {/* Main Category Title */}
          <View style={styles.mainHeader}>
            <AppText variant="h6" weight="bold">{selectedCategory.name}</AppText>
          </View>

          {/* Subcategories Grid */}
          <View style={styles.grid}>
            {subCategories.map((sub) => (
              <TouchableOpacity key={sub.id} style={styles.gridItem}>
                <View style={styles.gridImageContainer}>
                  <Image
                    source={{ uri: sub.image }}
                    style={styles.gridImage}
                    contentFit="contain"
                  />
                </View>
                <AppText variant="caption" style={styles.gridText} numberOfLines={2}>
                  {sub.name}
                </AppText>
              </TouchableOpacity>
            ))}

            {/* Add some dummy items if list is short to fill 3 columns for effect */}
            {subCategories.length < 3 && (
              <View style={{ width: '33%' }} />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  headerGradient: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  fixedSearchContainer: {
    marginTop: 100, // Clear header
    paddingHorizontal: Spacing.base, // 16
    marginBottom: Spacing.sm,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    height: 48,
    gap: Spacing.md,
    ...Colors.shadow.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    // Add border top to separate from search area slightly if needed, or visual separation
  },
  sidebar: {
    width: 90,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    // Shadow for sidebar to pop slightly
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  sidebarContent: {
    paddingBottom: 20,
  },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 5, // Selection Indicator width placeholder
    borderLeftColor: 'transparent',
  },
  sidebarItemSelected: {
    backgroundColor: '#fff', // Keep white, but maybe bold text
    borderLeftColor: '#008397', // Teal selection bar
  },
  activeIndicatorLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#008397',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    display: 'none' // Handled by borderLeftColor above for simpler implementation
  },
  sidebarIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  sidebarIcon: {
    width: 32,
    height: 32,
  },
  sidebarText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
    lineHeight: 14,
  },
  sidebarTextSelected: {
    color: '#000',
    fontWeight: '700', // Bold for selected
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mainHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // dotted not easy in native easily without lib, standard solid for now
    paddingBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap is supported in newer RN, but for safety in older versions or grid alignment:
    // justifyContent: 'space-between', 
    alignItems: 'flex-start',
  },
  gridItem: {
    width: '33.33%', // 3 columns
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  gridImageContainer: {
    width: '100%',
    aspectRatio: 1, // Keep it square-ish or let image define height
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImage: {
    width: '60%',
    height: '60%',
  },
  gridText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '400',
    color: '#333',
    lineHeight: 14,
  },
});
