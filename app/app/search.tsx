import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { History, TrendingUp, ChevronRight, X, ArrowLeft, ShoppingCart } from 'lucide-react-native';
import SearchBar from '@/components/molecules/SearchBar';
import ProductListItem from '@/components/molecules/ProductListItem';
import FilterBar from '@/components/molecules/FilterBar';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockProducts, mockCategories } from '@/services/mockData';
import { useWishlist } from '@/store/WishlistContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react-native';

import { useCart } from '@/store/CartContext';

import { SearchScreenSkeleton } from '@/components/skeletons';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: popularData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: () => apiService.getPopularSearches(),
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
  });



  const popularSearches = popularData?.data || [
    'Smart Watch',
    'Cotton T-shirts',
    'Skincare Kit',
    'Bluetooth Speaker',
    'Yoga Mat'
  ];

  const categories = categoriesData?.success
    ? categoriesData.data.filter((c: any) => !c.parentId && c.image)
    : mockCategories;

  // Load history on mount
  React.useEffect(() => {
    const loadHistory = async () => {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) setRecentSearches(JSON.parse(history));
    };
    loadHistory();
  }, []);

  // Debounced suggestion fetching
  React.useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length > 1) {
        try {
          const response = await apiService.getProducts({
            search: activeFilters.includes('5g') ? `${query} 5G` : query,
            limit: 10
          });
          if (response.success) {
            setSuggestions(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, activeFilters]);

  if (isLoadingPopular || isLoadingCategories) {
    return <SearchScreenSkeleton />;
  }

  const saveSearch = async (term: string) => {
    const newHistory = [term, ...recentSearches.filter(i => i !== term)].slice(0, 5);
    setRecentSearches(newHistory);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveSearch(term);
    router.push({
      pathname: '/product/list',
      params: {
        query: term,
        ...(activeFilters.includes('5g') ? { activeFilters: '5g' } : {})
      }
    });
  };

  const removeRecentItem = async (itemToRemove: string) => {
    const newHistory = recentSearches.filter(item => item !== itemToRemove);
    setRecentSearches(newHistory);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('searchHistory');
  };

  const renderEmptyState = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <History size={18} color={Colors.textSecondary} />
              <AppText variant="body" weight="bold" style={styles.sectionTitle}>Recent Searches</AppText>
            </View>
            <TouchableOpacity onPress={clearRecent}>
              <AppText variant="caption" color={Colors.primary} weight="semibold">Clear All</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.recentList}>
            {recentSearches.map((item, index) => (
              <View key={index} style={styles.recentItem}>
                <TouchableOpacity
                  style={styles.recentItemText}
                  onPress={() => handleSearch(item)}
                >
                  <AppText variant="body" color={Colors.textSecondary}>{item}</AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeRecentItem(item)}>
                  <X size={16} color={Colors.textLight} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Popular Searches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={18} color={Colors.textSecondary} />
            <AppText variant="body" weight="bold" style={styles.sectionTitle}>Popular Searches</AppText>
          </View>
        </View>
        <View style={styles.tagCloud}>
          {popularSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => handleSearch(item)}
            >
              <AppText variant="caption" color={Colors.textSecondary}>{item}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Browse Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="body" weight="bold" style={styles.sectionTitle}>Browse Categories</AppText>
        </View>
        <View style={styles.categoryGrid}>
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id || category._id}
              style={styles.categoryCard}
              onPress={() => router.push({
                pathname: '/product/list',
                params: { category: category.name }
              })}
            >
              <View style={styles.categoryImageContainer}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} contentFit="contain" />
              </View>
              <AppText variant="caption" weight="medium" style={styles.categoryName} numberOfLines={1}>
                {category.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery('')}
            />
          </View>
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

        {query.length > 0 && (
          <FilterBar
            activeFilters={activeFilters}
            onSelectSort={(id) => {
              if (id === 'filter' || id === 'sort' || id === 'price') {
                router.push('/filter');
              }
            }}
            onToggleFilter={(id) => {
              setActiveFilters(prev =>
                prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
              );
            }}
          />
        )}

        {query.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView
            contentContainerStyle={styles.results}
            showsVerticalScrollIndicator={false}
          >
            {suggestions.length > 0 ? (
              <View style={styles.suggestionsList}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSearch(item.name)}
                  >
                    <View style={styles.suggestionIcon}>
                      <SearchIcon size={16} color={Colors.textLight} />
                    </View>
                    <View style={styles.suggestionContent}>
                      <AppText variant="body" weight="medium">{item.name}</AppText>
                      <AppText variant="caption" color={Colors.textLight}>{item.category} • {item.subcategory}</AppText>
                    </View>
                    <ChevronRight size={18} color={Colors.textLight} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noResults}>
                <AppText variant="body" color={Colors.textLight}>No suggestions found for "{query}"</AppText>
              </View>
            )}
          </ScrollView>
        )}
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
    paddingTop: 10, // Added space for status bar clarity if needed
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
  backButton: {
    padding: Spacing.xs,
  },
  searchBarWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['5xl'],
  },
  section: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
  },
  recentList: {
    gap: Spacing.xs,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundGray,
  },
  recentItemText: {
    flex: 1,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  categoryCard: {
    width: '25%', // 4 columns
    padding: Spacing.xs,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    padding: Spacing.sm,
  },
  categoryImage: {
    width: '80%',
    height: '80%',
  },
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  results: {
    flexGrow: 1,
  },
  detailedList: {
    flex: 1,
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
  brandLogo: {
    width: 60,
    height: 60,
  },
  suggestionsList: {
    paddingHorizontal: Spacing.base,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundGray,
    gap: Spacing.md,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
  },
});
