import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import ProductCard from '@/components/molecules/ProductCard';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useWishlist } from '@/store/WishlistContext';

export default function WishlistScreen() {
  const router = useRouter();
  const { items, toggleWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Heart size={80} color={Colors.textLight} />
        <AppText variant="h4" weight="semibold" style={styles.emptyTitle}>
          Your wishlist is empty
        </AppText>
        <AppText variant="body" color={Colors.textSecondary} align="center">
          Save items you love to your wishlist
        </AppText>
        <Button
          title="Start Shopping"
          onPress={() => router.push('/(tabs)/(home)')}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.productsGrid}>
        {items.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <ProductCard
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
              onWishlistPress={() => toggleWishlist(product)}
              isWishlisted={true}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  productCard: {
    width: '48%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.base,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    marginTop: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.lg,
  },
});
