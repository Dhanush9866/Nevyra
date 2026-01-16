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
import { BlurView } from 'expo-blur';
import { useRouter, Stack } from 'expo-router';
import {
  Search,
  ShoppingCart,
  Bell,
  MapPin,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import CategoryItem from '@/components/molecules/CategoryItem';
import ProductCard from '@/components/molecules/ProductCard';
import HomeBannerCarousel from '@/components/organisms/HomeBannerCarousel';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { mockBanners } from '@/services/mockData';
import { useWishlist } from '@/store/WishlistContext';
import { useAuth } from '@/store/AuthContext';

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

  const { data: prodData, isLoading: prodLoading, refetch } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => apiService.getProducts({ limit: 8 }),
  });

  const categories = catData?.data?.filter((c: any) => !c.parentId) || [];
  const products = prodData?.data || [];

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

  // 2. Header Style Animations
  const headerTranslateY = scrollY.interpolate({
    inputRange: [40, 80],
    outputRange: [0, -10], // Move up slightly as address bar disappears
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
            ) : categories.map((category: any) => (
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
        contentContainerStyle={{ paddingTop: insets.top + 230 }} // Further increased to add visible gap
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.heroSection}>
          <HomeBannerCarousel banners={mockBanners} />
        </View>

        {/* 5. Product Grids & Sections */}
        <View style={styles.mainContent}>
          {/* Trending Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="h4" weight="bold">
                Trending Offers
              </AppText>
              <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
                <AppText
                  variant="caption"
                  color={Colors.primary}
                  weight="semibold"
                >
                  View All
                </AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {products.slice(0, 4).map((product: any) => (
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

          {/* Deals of the Day */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="h4" weight="bold">
                Deals of the Day
              </AppText>
              <TouchableOpacity>
                <AppText
                  variant="caption"
                  color={Colors.primary}
                  weight="semibold"
                >
                  View All
                </AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {products.slice(4, 8).map((product: any) => (
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  addressBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xs, // Balanced gap
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
    paddingTop: Spacing.xs, // Added small top gap
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm, // Even tighter horizontal gap
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  promoBanner: {
    marginHorizontal: Spacing.base,
    borderRadius: 12,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  promoButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
  },
});

