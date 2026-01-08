import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import SearchBar from '@/components/molecules/SearchBar';
import ProductCard from '@/components/molecules/ProductCard';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockProducts } from '@/services/mockData';
import { useWishlist } from '@/store/WishlistContext';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { toggleWishlist, isWishlisted } = useWishlist();

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            autoFocus
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
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
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    padding: Spacing.base,
    paddingTop: Spacing['5xl'],
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  results: {
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
});
