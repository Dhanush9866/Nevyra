import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../molecules/ProductCard';
import { Product } from '@/types';
import Spacing from '@/constants/spacing';

interface ProductGridProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onWishlistPress?: (product: Product) => void;
  wishlisted?: string[];
  numColumns?: number;
}

export default function ProductGrid({
  products,
  onProductPress,
  onWishlistPress,
  wishlisted = [],
  numColumns = 2,
}: ProductGridProps) {
  return (
    <FlatList
      data={products}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.item, { width: `${100 / numColumns}%` }]}>
          <ProductCard
            product={item}
            onPress={() => onProductPress(item)}
            onWishlistPress={
              onWishlistPress ? () => onWishlistPress(item) : undefined
            }
            isWishlisted={wishlisted.includes(item.id)}
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
  },
  item: {
    paddingHorizontal: Spacing.xs,
  },
});
