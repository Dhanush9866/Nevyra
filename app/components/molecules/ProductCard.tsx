import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import AppText from '../atoms/AppText';
import Badge from '../atoms/Badge';
import RatingStars from './RatingStars';
import PriceTag from './PriceTag';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onWishlistPress?: () => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  onPress,
  onWishlistPress,
  isWishlisted = false,
}: ProductCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          contentFit="cover"
        />
        {product.discount && product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Badge
              text={`${product.discount}% OFF`}
              variant="error"
              size="sm"
            />
          </View>
        )}
        {onWishlistPress && (
          <TouchableOpacity
            onPress={onWishlistPress}
            style={styles.wishlistButton}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isWishlisted ? Colors.error : Colors.white}
              fill={isWishlisted ? Colors.error : 'transparent'}
            />
          </TouchableOpacity>
        )}
        {!product.inStock && (
          <View style={styles.outOfStock}>
            <AppText variant="caption" color={Colors.white} weight="semibold">
              Out of Stock
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          numberOfLines={1}
        >
          {product.brand}
        </AppText>
        <AppText
          variant="body"
          weight="medium"
          numberOfLines={2}
          style={styles.name}
        >
          {product.name}
        </AppText>
        <RatingStars
          rating={product.rating}
          reviewCount={product.reviewCount}
          size={14}
        />
        <PriceTag
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          size="sm"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    ...Colors.shadow.md,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundGray,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  wishlistButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: Spacing.xs,
  },
  outOfStock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  name: {
    minHeight: 40,
  },
});
