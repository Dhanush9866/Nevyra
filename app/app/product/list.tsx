import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShoppingCart, Search } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import ProductListItem from '@/components/molecules/ProductListItem';
import FilterBar from '@/components/molecules/FilterBar';
import AppText from '@/components/atoms/AppText';
import Loader from '@/components/atoms/Loader';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { apiService } from '@/services/api';
import { useCart } from '@/store/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category, subcategory, query, sort: paramSort, priceRange, rating: paramRating } = useLocalSearchParams<{
    category?: string;
    subcategory?: string;
    query?: string;
    sort?: string;
    priceRange?: string;
    rating?: string;
  }>();
  const { totalItems } = useCart();

  const title = query || subcategory || category || 'Products';

  const [sort, setSort] = useState<string | undefined>(paramSort);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { category, subcategory, query, sort: paramSort || sort, activeFilters, priceRange, paramRating }],
    queryFn: () => {
      const minPrice = priceRange ? parseInt(priceRange.split('-')[0]) : undefined;
      const maxPrice = priceRange ? (priceRange.includes('above') ? 100000 : parseInt(priceRange.split('-')[1])) : undefined;

      return apiService.getProducts({
        category,
        subCategory: subcategory,
        search: activeFilters.includes('5g') ? `${query || ''} 5G`.trim() : query,
        sort: activeFilters.includes('new') ? 'newest' : (paramSort || sort),
        minPrice,
        maxPrice,
        rating: paramRating ? parseInt(paramRating) : undefined,
      });
    },
  });

  const products = data?.data || [];

  const uniqueCategories = useMemo(() => {
    const cats = products.map((p: any) => p.category);
    return [...new Set(cats)];
  }, [products]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchBarSubstitute}
            onPress={() => router.push('/search' as any)}
          >
            <Search size={18} color={Colors.textSecondary} />
            <AppText variant="body" color={Colors.textLight} numberOfLines={1}>
              {title}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.cartButton}>
            <ShoppingCart size={24} color={Colors.text} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <AppText variant="caption" color={Colors.white} weight="bold" style={{ fontSize: 10 }}>
                  {totalItems}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FilterBar
          activeSort={sort || paramSort}
          activeFilters={[
            ...activeFilters,
            ...(priceRange ? ['price'] : []),
            ...(paramRating ? ['filter'] : [])
          ]}
          onSelectSort={(id) => {
            if (id === 'filter' || id === 'sort' || id === 'price') {
              router.push({
                pathname: '/filter',
                params: {
                  sort: sort || paramSort,
                  priceRange,
                  rating: paramRating
                }
              });
            } else {
              setSort(id === sort ? undefined : id);
            }
          }}
          onToggleFilter={(id) => {
            setActiveFilters(prev =>
              prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
            );
          }}
        />

        <ScrollView
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.center}>
              <Loader />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <AppText color={Colors.error}>Failed to load products</AppText>
            </View>
          ) : products.length > 0 ? (
            <View style={styles.detailedList}>
              {/* Brand Header - Generic for demo */}
              <View style={styles.brandHeader}>
                <View style={{ flex: 1 }}>
                  <AppText variant="h4" weight="bold">{title}</AppText>
                  <AppText variant="caption" color={Colors.textLight}>
                    Top quality products in this category
                  </AppText>
                </View>
              </View>

              {/* Related Categories */}
              {query && uniqueCategories.length > 0 && (
                <View style={styles.relatedCategories}>
                  <AppText variant="caption" weight="bold" style={styles.relatedTitle}>RELATED CATEGORIES</AppText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                    {uniqueCategories.map((cat: any) => (
                      <TouchableOpacity
                        key={cat}
                        style={styles.categoryChip}
                        onPress={() => router.push({ pathname: '/product/list', params: { category: cat } })}
                      >
                        <AppText variant="caption" weight="medium">{cat}</AppText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {products.map((product: any) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onPress={() => router.push(`/product/${product.id}` as any)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noResults}>
              <AppText variant="body" color={Colors.textLight}>No products found</AppText>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  searchBarSubstitute: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.md,
    height: 40,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  cartButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  results: {
    flexGrow: 1,
  },
  detailedList: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['5xl'],
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  relatedCategories: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  relatedTitle: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    color: Colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  chipsContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
  },
});
