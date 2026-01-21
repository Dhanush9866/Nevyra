import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import {
  Search,
  MapPin,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import CategoryItem from '@/components/molecules/CategoryItem';
import ProductCard from '@/components/molecules/ProductCard';
import HorizontalProductSection from '@/components/organisms/HorizontalProductSection';
import VerticalProductSection from '@/components/organisms/VerticalProductSection';
import HomeBannerCarousel from '@/components/organisms/HomeBannerCarousel';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { mockBanners, mockProducts as fallbackMockProducts } from '@/services/mockData';
import { useWishlist } from '@/store/WishlistContext';
import { useAuth } from '@/store/AuthContext';

// Color themes for sections (Background + Darker Button)
const SECTION_THEMES = [
  { bg: '#FFE0B2', btn: '#FB8C00' }, // Orange (Orange 700)
  { bg: '#FFCCBC', btn: '#FF5722' }, // Deep Peach (Deep Orange 500)
  { bg: '#DCEDC8', btn: '#689F38' }, // Light Green (Light Green 700)
  { bg: '#B3E5FC', btn: '#0288D1' }, // Light Blue (Light Blue 700)
  { bg: '#E1BEE7', btn: '#8E24AA' }, // Purple (Purple 700)
  { bg: '#FFF9C4', btn: '#FBC02D' }, // Yellow (Yellow 700)
  { bg: '#D1C4E9', btn: '#5E35B1' }, // Deep Purple (Deep Purple 600)
  { bg: '#F0F4C3', btn: '#AFB42B' }, // Lime (Lime 700)
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { addresses } = useAuth();

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const addressDisplay = defaultAddress
    ? `${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.zipCode}`
    : 'Select a delivery address';

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
  });

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiService.getSettings(),
  });

  const heroBanners = React.useMemo(() => {
    if (settingsData?.data?.heroBanners?.length) {
      return settingsData.data.heroBanners.map((banner: any, index: number) => ({
        id: (index + 1).toString(),
        image: banner.url,
        title: banner.title || "Special Offer",
        subtitle: banner.subtitle || "Limited time only",
        link: banner.link || "/products",
      }));
    }
    return mockBanners;
  }, [settingsData]);

  // Fetch larger set of products to categorize
  const { data: prodData, isLoading: prodLoading, refetch } = useQuery({
    queryKey: ['all-products-home'],
    queryFn: () => apiService.getProducts({ limit: 100 }),
  });

  const categories = catData?.data?.filter((c: any) => !c.parentId) || [];
  const fetchedProducts = prodData?.data || [];

  // Merge fetched products with fallback mock data to ensure we have content for demo
  // We prioritize fetched products but use mock to fill gaps per category
  const allProducts = [...fetchedProducts, ...fallbackMockProducts];

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  // 1. Address Bar Animations
  const addressHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [40, 0],
    extrapolate: 'clamp',
  });

  const addressOpacity = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const addressTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* FULL PERSISTENT BRANDED HEADER */}
      <Animated.View style={[
        styles.fixedHeader,
        {
          paddingTop: insets.top,
        }
      ]}>
        <LinearGradient
          colors={[Colors.primary, '#8e44ad']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Animated Address Bar */}
        <Animated.View style={{
          height: addressHeight,
          opacity: addressOpacity,
          transform: [{ translateY: addressTranslateY }],
          overflow: 'hidden'
        }}>
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
          </TouchableOpacity>
        </Animated.View>

        {/* Persistent Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => router.push('/search' as any)}
            activeOpacity={0.9}
            style={styles.searchBar}
          >
            <Search size={18} color={Colors.textSecondary} />
            <AppText variant="body" color={Colors.textLight} style={{ fontSize: 13 }}>
              Search for products, brands and more
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Animated Categories Overlay */}
        <View style={styles.categoriesArea}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {catLoading ? (
              <View style={{ paddingHorizontal: 20 }}>
                <AppText color={Colors.white}>Loading...</AppText>
              </View>
            ) : categories.slice(0, 8).map((category: any) => (
              <CategoryItem
                key={category._id || category.id}
                name={category.name}
                image={category.image}
                scrollY={scrollY}
                onPress={() => router.push({
                  pathname: '/product/list',
                  params: { category: category.name }
                })}
              />
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: insets.top + 230 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.heroSection}>
          <HomeBannerCarousel banners={heroBanners} />
        </View>

        <View style={styles.mainContent}>
          {/* Dynamically Render Category Sections - Alternating Horizontal and Vertical */}
          {categories.slice(0, 8).map((category: any, index: number) => {
            // Filter products for this specific category
            const categoryProducts = allProducts.filter((p: any) =>
              p.category === category.name ||
              p.category?.name === category.name ||
              // Relaxed matching/fallback logic
              (fallbackMockProducts.some(mp => mp.category === category.name) ? false : true)
            ).slice(0, 6); // Take first 6 items

            // Use modulo to cycle through themes
            const theme = SECTION_THEMES[index % SECTION_THEMES.length];

            // Fallback products if category is empty to keep UI populated
            const displayItems = categoryProducts.length > 0 ? categoryProducts : allProducts.slice(index * 2, (index * 2) + 4);

            // Alternate between horizontal and vertical sections
            // Even indices (0, 2, 4, 6) = Horizontal
            // Odd indices (1, 3, 5, 7) = Vertical
            const isHorizontal = index % 2 === 0;

            if (isHorizontal) {
              return (
                <HorizontalProductSection
                  key={category._id || category.id}
                  title={`Deals on ${category.name}`}
                  backgroundColor={theme.bg}
                  buttonColor={theme.btn}
                  onPress={(id) => router.push(`/product/${id}` as any)}
                  items={displayItems}
                />
              );
            } else {
              return (
                <VerticalProductSection
                  key={category._id || category.id}
                  title={`Shop for ${category.name}`}
                  backgroundColor={theme.bg}
                  buttonColor={theme.btn}
                  onPress={(id) => router.push(`/product/${id}` as any)}
                  items={displayItems}
                />
              );
            }
          })}

          {/* Fallback Grid if needed */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="h4" weight="bold">More to Explore</AppText>
            </View>
            <View style={styles.productsGrid}>
              {allProducts.slice(0, 4).map((product: any) => (
                <View key={product.id} style={styles.productCard}>
                  <ProductCard
                    product={product}
                    onPress={() => router.push(`/product/${product.id}` as any)}
                    onWishlistPress={() => toggleWishlist(product)}
                    isWishlisted={isWishlisted(product.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    ...Colors.shadow.md,
  },
  addressBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xs,
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
  categoriesArea: {
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  heroSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  mainContent: {
    gap: Spacing.sm,
  },
  section: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xs,
  },
  productCard: {
    width: '50%',
    paddingHorizontal: Spacing.xs,
  },
});
