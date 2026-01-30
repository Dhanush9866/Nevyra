import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductCardSkeleton from '../molecules/ProductCardSkeleton';
import Spacing from '@/constants/spacing';

const ProductGridSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
        <View style={styles.col}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  col: {
    flex: 1,
    gap: Spacing.md, // Add gap between items in column
  },
});

export default ProductGridSkeleton;
