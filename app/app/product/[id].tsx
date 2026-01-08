import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Heart, Star, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/atoms/IconButton';
import Badge from '@/components/atoms/Badge';
import PriceTag from '@/components/molecules/PriceTag';
import RatingStars from '@/components/molecules/RatingStars';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockProducts } from '@/services/mockData';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const product = mockProducts.find((p) => p.id === id) || mockProducts[0];

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => (
            <View style={styles.headerActions}>
              <IconButton
                icon={Share2}
                onPress={() => {}}
                color={Colors.white}
                backgroundColor="rgba(0,0,0,0.3)"
              />
              <IconButton
                icon={Heart}
                onPress={() => toggleWishlist(product)}
                color={isWishlisted(product.id) ? Colors.error : Colors.white}
                backgroundColor="rgba(0,0,0,0.3)"
              />
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.images[0] }}
              style={styles.image}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', Colors.background]}
              style={styles.imageGradient}
            />
            {product.discount && product.discount > 0 && (
              <View style={styles.discountBadge}>
                <Badge text={`${product.discount}% OFF`} variant="error" />
              </View>
            )}
          </View>

          <View style={styles.content}>
            <AppText variant="caption" color={Colors.textSecondary}>
              {product.brand}
            </AppText>
            <AppText variant="h3" weight="bold" style={styles.title}>
              {product.name}
            </AppText>

            <View style={styles.ratingRow}>
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
              <TouchableOpacity
                onPress={() => router.push('/product/reviews' as any)}
              >
                <AppText
                  variant="caption"
                  color={Colors.primary}
                  weight="semibold"
                >
                  See Reviews
                </AppText>
              </TouchableOpacity>
            </View>

            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              size="lg"
            />

            <View style={styles.section}>
              <AppText variant="h4" weight="bold">
                Description
              </AppText>
              <AppText variant="body" color={Colors.textSecondary}>
                {product.description}
              </AppText>
            </View>

            {product.features && (
              <View style={styles.section}>
                <AppText variant="h4" weight="bold">
                  Features
                </AppText>
                {product.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Star
                      size={16}
                      color={Colors.rating}
                      fill={Colors.rating}
                    />
                    <AppText variant="body" color={Colors.textSecondary}>
                      {feature}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Add to Cart"
            onPress={() => {
              addToCart(product);
              router.push('/(tabs)/cart' as any);
            }}
            fullWidth
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  discountBadge: {
    position: 'absolute',
    top: 100,
    left: Spacing.base,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    marginTop: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Colors.shadow.lg,
  },
});
