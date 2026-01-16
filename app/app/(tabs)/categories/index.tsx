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
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Search, Bell, ShoppingCart, MapPin, ChevronDown } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockCategories } from '@/services/mockData';
import { Category } from '@/types';
import { useAuth } from '@/store/AuthContext';

// Categories are now imported from @/services/mockData

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

// Category interface is now imported from @/types

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import Loader from '@/components/atoms/Loader';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addresses } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const addressDisplay = defaultAddress
    ? `${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.zipCode}`
    : 'Select a delivery address';

  const { data: catData, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
  });

  const categories = catData?.data || [];
  
  // Set default selected category once data is loaded
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      const topLevel = categories.find((c: any) => !c.parentId);
      if (topLevel) setSelectedCategoryId(topLevel._id || topLevel.id);
    }
  }, [categories]);

  const selectedCategory = useMemo(() => {
    return categories.find((c: any) => (c._id || c.id) === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const subCategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return categories.filter((c: any) => c.parentId === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const renderSidebarItem = ({ item }: { item: Category }) => {
    const isSelected = ((selectedCategory as any)?._id || selectedCategory?.id) === ((item as any)._id || item.id);
    return (
      <TouchableOpacity
        style={[styles.sidebarItem, isSelected && styles.sidebarItemSelected]}
        onPress={() => setSelectedCategoryId((item as any)._id || item.id)}
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
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header matching Home Screen */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[Colors.primary, '#8e44ad']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Address Bar
        <TouchableOpacity
          style={styles.addressBar}
          activeOpacity={0.7}
          onPress={() => router.push('/checkout/address-list' as any)}
        >
          <MapPin size={16} color={Colors.white} />
          <AppText variant="caption" color="rgba(255,255,255,0.9)" style={{ marginLeft: 4 }}>
            Deliver to:
          </AppText>
          <AppText variant="caption" color={Colors.white} weight="bold" numberOfLines={1} style={{ flex: 1, marginLeft: 4 }}>
            {addressDisplay}
          </AppText>
          <ChevronDown size={14} color={Colors.white} />
        </TouchableOpacity> */}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor={Colors.textLight}
              style={styles.searchInput}
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <Loader />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <AppText color={Colors.error}>Failed to load categories</AppText>
          </View>
        ) : (
          <>
            {/* Sidebar */}
            <View style={styles.sidebar}>
              <FlatList
                data={categories.filter((c: any) => !c.parentId)}
                renderItem={renderSidebarItem}
                keyExtractor={item => item._id || item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.sidebarContent}
              />
            </View>

            {/* Main Content */}
            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
              {/* Main Category Title */}
              <View style={styles.mainHeader}>
                <AppText variant="h4" weight="bold">{selectedCategory?.name}</AppText>
              </View>

              {/* Subcategories Grid */}
              <View style={styles.grid}>
                {subCategories.length > 0 ? (
                  subCategories.map((sub: any) => (
                    <TouchableOpacity 
                      key={sub._id || sub.id} 
                      style={styles.gridItem}
                      onPress={() => router.push({
                        pathname: '/product/list',
                        params: { 
                          category: selectedCategory?.name,
                          subcategory: sub.name 
                        }
                      })}
                    >
                      <View style={styles.gridImageContainer}>
                        <Image
                          source={{ uri: sub.image || DEFAULT_IMAGE }}
                          style={styles.gridImage}
                          contentFit="contain"
                        />
                      </View>
                      <AppText variant="caption" style={styles.gridText} numberOfLines={2}>
                        {sub.name}
                      </AppText>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity 
                    style={styles.viewAllTop}
                    onPress={() => router.push({
                      pathname: '/product/list',
                      params: { category: selectedCategory?.name }
                    })}
                  >
                     <AppText color={Colors.primary}>View all products in {selectedCategory?.name}</AppText>
                  </TouchableOpacity>
                )}
                {/* Add some dummy items if list is short to fill 3 columns for effect */}
                {subCategories.length < 3 && (
                  <View style={{ width: '33%' }} />
                )}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    ...Colors.shadow.md,
    zIndex: 100,
  },
  addressBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
    ...Colors.shadow.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: Colors.text,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllTop: {
    padding: Spacing.base,
    alignItems: 'center',
    width: '100%',
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
