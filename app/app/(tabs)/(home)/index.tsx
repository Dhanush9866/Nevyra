import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import {
  Search,
  MapPin,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import CategoryItem from '@/components/molecules/CategoryItem';
import ProductCard from '@/components/molecules/ProductCard';
import ProductListItem from '@/components/molecules/ProductListItem';
import HorizontalProductSection from '@/components/organisms/HorizontalProductSection';
import VerticalProductSection from '@/components/organisms/VerticalProductSection';
import HomeBannerCarousel from '@/components/organisms/HomeBannerCarousel';
import AddressBottomSheet from '@/components/organisms/AddressBottomSheet';
import { HomeScreenSkeleton } from '@/components/skeletons';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { mockBanners, mockProducts as fallbackMockProducts } from '@/services/mockData';
import { useWishlist } from '@/store/WishlistContext';
import { useAuth } from '@/store/AuthContext';
import { useCheckout } from '@/store/CheckoutContext';

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

const LOAD_LIMIT = 10;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { addresses } = useAuth();
  const { selectedAddress } = useCheckout();

  // Infinite Scroll States
  const [exploreProducts, setExploreProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);

  const currentAddress = selectedAddress || addresses.find(a => a.isDefault) || addresses[0];
  const addressDisplay = currentAddress
    ? `${currentAddress.city}, ${currentAddress.state} - ${currentAddress.zipCode}`
    : 'Select a delivery address';

  const { data: catData, isLoading: catLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
  });

  const { data: settingsData, refetch: refetchSettings } = useQuery({
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
  const { data: prodData, isLoading: prodLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['all-products-home'],
    queryFn: () => apiService.getProducts({ limit: 40 }),
  });

  const fetchExploreProducts = async (pageNum: number, isRefresh: boolean = false) => {
    if (isFetchingMore || (!hasMore && !isRefresh)) return;

    setIsFetchingMore(true);
    try {
      const response = await apiService.getProducts({ page: pageNum, limit: LOAD_LIMIT });
      if (response.success) {
        const newProducts = (response.data || []).sort(() => Math.random() - 0.5);
        if (isRefresh) {
          setExploreProducts(newProducts);
        } else {
          // Filter out duplicates
          setExploreProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNew];
          });
        }
        setHasMore(newProducts.length === LOAD_LIMIT);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching explore products:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchExploreProducts(1, true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetchCategories();
      refetchSettings();
      refetchProducts();
    }, [refetchCategories, refetchSettings, refetchProducts])
  );

  const categories = React.useMemo(() => {
    const raw = catData?.data?.filter((c: any) => !c.parentId && c.image) || [];
    return [...raw].sort(() => Math.random() - 0.5);
  }, [catData]);

  const fetchedProducts = prodData?.data || [];
  const allProducts = React.useMemo(() => {
    const combined = [...fetchedProducts, ...fallbackMockProducts];
    return [...combined].sort(() => Math.random() - 0.5);
  }, [fetchedProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    Promise.all([
      refetchCategories(),
      refetchSettings(),
      refetchProducts(),
      fetchExploreProducts(1, true)
    ]).finally(() => {
      setRefreshing(false);
    });
  };

  const handleEndReached = () => {
    if (!isFetchingMore && hasMore) {
      fetchExploreProducts(page + 1);
    }
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

  // Mixed Layout Logic: Convert exploreProducts into rows
  const productRows = React.useMemo(() => {
    // REMOVED Shuffle from here to prevent re-render jumps
    const rows = [];
    let i = 0;
    let patternIndex = 0; // 0, 1 = Grid, 2 = List

    while (i < exploreProducts.length) {
      if (patternIndex % 3 === 2) {
        // List style Uniqueness
        rows.push({ type: 'list', data: exploreProducts[i] });
        i += 1;
      } else {
        // Grid style (2 cards)
        const pair = exploreProducts.slice(i, i + 2);
        rows.push({ type: 'grid', data: pair });
        i += 2;
      }
      patternIndex++;
    }
    return rows;
  }, [exploreProducts]);

  if (catLoading || prodLoading) {
    return <HomeScreenSkeleton />;
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.heroSection}>
        <HomeBannerCarousel banners={heroBanners} />
      </View>

      <View style={styles.mainContent}>
        {/* Dynamically Render Category Sections - Alternating Horizontal and Vertical */}
        {categories.slice(0, 8).map((category: any, index: number) => {
          let categoryProducts = allProducts.filter((p: any) =>
            p.category === category.name ||
            p.category?.name === category.name ||
            (fallbackMockProducts.some(mp => mp.category === category.name) ? false : true)
          );

          const theme = SECTION_THEMES[index % SECTION_THEMES.length];
          const isHorizontal = index % 2 === 0;

          if (isHorizontal) {
            categoryProducts = [...categoryProducts].sort((a, b) => (a.price || 0) - (b.price || 0));
            const displayItems = categoryProducts.length > 0 ? categoryProducts.slice(0, 8) : allProducts.slice(index * 2, (index * 2) + 6);

            return (
              <HorizontalProductSection
                key={category._id || category.id}
                title={`Deals on ${category.name}`}
                backgroundColor={theme.bg}
                buttonColor={theme.btn}
                onPress={(id) => router.push(`/product/${id}` as any)}
                onViewAll={() => router.push({
                  pathname: '/categories',
                  params: { categoryId: category._id || category.id }
                } as any)}
                items={displayItems}
              />
            );
          } else {
            categoryProducts = [...categoryProducts].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
            const displayItems = categoryProducts.length > 0 ? categoryProducts.slice(0, 6) : allProducts.slice(index * 2, (index * 2) + 6);

            return (
              <VerticalProductSection
                key={category._id || category.id}
                title={`Shop for ${category.name}`}
                backgroundColor={theme.bg}
                buttonColor={theme.btn}
                onPress={(id) => router.push(`/product/${id}` as any)}
                onViewAll={() => router.push({
                  pathname: '/categories',
                  params: { categoryId: category._id || category.id }
                } as any)}
                items={displayItems}
              />
            );
          }
        })}
      </View>

      <View style={styles.exploreHeader}>
        <AppText variant="h3" weight="bold">More to Explore</AppText>
      </View>
    </View>
  );

  const renderRow = ({ item }: { item: any }) => {
    if (item.type === 'list') {
      return (
        <View style={styles.listRow}>
          <ProductListItem
            product={item.data}
            onPress={() => router.push(`/product/${item.data.id}` as any)}
          />
        </View>
      );
    }

    return (
      <View style={styles.gridRow}>
        {item.data.map((product: any) => (
          <View key={product.id} style={styles.gridItem}>
            <ProductCard
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
              onWishlistPress={() => toggleWishlist(product)}
              isWishlisted={isWishlisted(product.id)}
            />
          </View>
        ))}
        {item.data.length === 1 && <View style={styles.gridItem} />}
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.loaderContainer}>
      {isFetchingMore ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : !hasMore && exploreProducts.length > 0 ? (
        <AppText variant="caption" color={Colors.textLight}>Reached the end of items</AppText>
      ) : null}
    </View>
  );

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
            onPress={() => setIsAddressSheetVisible(true)}
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

      <Animated.FlatList
        data={productRows}
        renderItem={renderRow}
        keyExtractor={(item, index) => {
          if (item.type === 'list') {
            return `list-${item.data.id}-${index}`;
          }
          return `grid-${item.data[0]?.id}-${index}`;
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: insets.top + 230, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      />

      <AddressBottomSheet 
        visible={isAddressSheetVisible} 
        onClose={() => setIsAddressSheetVisible(false)} 
      />
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
  header: {
    // Wrapper for header components
  },
  heroSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  mainContent: {
    gap: Spacing.sm,
  },
  exploreHeader: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    marginTop: Spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.white,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: Spacing.xs,
  },
  listRow: {
    marginVertical: Spacing.xs,
  },
  loaderContainer: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
