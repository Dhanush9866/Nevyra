import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Search, ShoppingCart, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import IconButton from '@/components/atoms/IconButton';
import CategoryItem from '@/components/molecules/CategoryItem';
import ProductCard from '@/components/molecules/ProductCard';
import HomeBannerCarousel from '@/components/organisms/HomeBannerCarousel';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockBanners, mockCategories, mockProducts } from '@/services/mockData';

import { useWishlist } from '@/store/WishlistContext';

export default function HomeScreen() {
  const router = useRouter();

  const { toggleWishlist, isWishlisted } = useWishlist();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <>
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
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <LinearGradient
          colors={[Colors.gradient.primary[0], 'transparent']}
          style={styles.topGradient}
        />

        <TouchableOpacity
          onPress={() => router.push('/search' as any)}
          activeOpacity={0.9}
          style={styles.searchBar}
        >
          <Search size={20} color={Colors.textSecondary} />
          <AppText variant="body" color={Colors.textLight}>
            Search products...
          </AppText>
        </TouchableOpacity>

        <HomeBannerCarousel banners={mockBanners} />

        <View style={styles.section}>
          <AppText variant="h4" weight="bold">
            Categories
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {mockCategories.map((category) => (
              <CategoryItem
                key={category.id}
                name={category.name}
                image={category.image}
                onPress={() => router.push('/(tabs)/categories' as any)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h4" weight="bold">
              Trending Products
            </AppText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <AppText
                variant="caption"
                color={Colors.primary}
                weight="semibold"
              >
                See All
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {mockProducts.slice(0, 4).map((product) => (
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
                See All
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {mockProducts.slice(2, 6).map((product) => (
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
      </ScrollView>
    </>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    height: 48,
    gap: Spacing.md,
    marginHorizontal: Spacing.base,
    marginTop: 100,
    marginBottom: Spacing.base,
    ...Colors.shadow.md,
  },
  section: {
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
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
