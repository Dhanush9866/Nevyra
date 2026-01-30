import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Heart, Plus, ShoppingCart, List, ArrowRight } from 'lucide-react-native'; // Lucide icons for placeholders
import { Image } from 'expo-image';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import ProductCard from '@/components/molecules/ProductCard';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useWishlist } from '@/store/WishlistContext';
import { useCart } from '@/store/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WishlistScreenSkeleton } from '@/components/skeletons';

export default function WishlistScreen() {
  const router = useRouter();
  const { items, toggleWishlist, refreshWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      refreshWishlist();
    }, [refreshWishlist])
  );

  if (isLoading) {
    return <WishlistScreenSkeleton />;
  }

  // Mock data for the top lists
  const lists = [
    { id: '1', name: 'All saves', image: items.length > 0 ? items[0].images[0] : null, active: true },
  ];

  // Mock data for filters
  const filters = ['All', 'Deals', 'Trending now'];
  const [activeFilter, setActiveFilter] = useState('All');

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Optional: Show toast
  };

  const renderListCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.listCard,
        item.active && styles.listCardActive
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.listImageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.listImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            {item.name.includes('Shopping') ? <ShoppingCart size={24} color={Colors.textLight} /> : <List size={24} color={Colors.textLight} />}
          </View>
        )}
      </View>
      <AppText variant="caption" weight={item.active ? "bold" : "medium"} style={styles.listName}>
        {item.name}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        {/* Product Grid */}
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={60} color={Colors.textLight} />
            <AppText variant="h4" weight="semibold" style={styles.emptyTitle}>
              Your wishlist is empty
            </AppText>
            <Button
              title="Start Shopping"
              onPress={() => router.push('/(tabs)/(home)')}
              style={styles.emptyButton}
              icon={<ArrowRight size={18} color={Colors.white} />}
            />
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {items.map((product) => (
              <View key={product.id} style={styles.productCardWrapper}>
                <ProductCard
                  product={product}
                  onPress={() => router.push(`/product/${product.id}` as any)}
                  onWishlistPress={() => toggleWishlist(product)}
                  isWishlisted={true}
                  showAddToCart={true}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButtonHeader: {
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  listsContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  listCard: {
    width: 120, // Approximate width from image
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  listCardActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary + '05', // Very light tint
  },
  listImageContainer: {
    width: '100%',
    aspectRatio: 1.5,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listName: {
    textAlign: 'left',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipOutlined: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8, // More squared/dropdown look
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  productCardWrapper: {
    width: '48%',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.base,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    marginTop: Spacing.md,
  },
  emptyButton: {
    marginTop: Spacing.lg,
    minWidth: 220,
    borderRadius: 30,
    ...Colors.shadow.md,
  },
});
