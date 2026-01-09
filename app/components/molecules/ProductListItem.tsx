import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ShieldCheck } from 'lucide-react-native';
import AppText from '../atoms/AppText';
import RatingStars from './RatingStars';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Product } from '@/types';

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
}

export default function ProductListItem({ product, onPress }: ProductListItemProps) {
  // Mocking some extra data for the premium look from image
  const ratingsCount = Math.floor(Math.random() * 5000) + 1000;
  const isAssured = true; 
  const specialPrice = Math.floor(product.price * 0.98); // 2% less for "wow" price
  const deliveryBy = "12th Jan";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          contentFit="contain"
        />
      </View>
      
      <View style={styles.content}>
        <AppText variant="body" weight="medium" style={styles.name} numberOfLines={2}>
          {product.name}
        </AppText>

        <View style={styles.ratingRow}>
          <RatingStars rating={product.rating} size={14} />
          <AppText variant="caption" color={Colors.textSecondary} style={styles.ratingText}>
            ({ratingsCount.toLocaleString()})
          </AppText>
          {isAssured && (
            <View style={styles.assuredBadge}>
               <ShieldCheck size={12} color="#0052cc" />
               <AppText variant="caption" color="#0052cc" weight="bold" style={{ fontSize: 10, fontStyle: 'italic' }}>
                 Assured
               </AppText>
            </View>
          )}
        </View>

        <View style={styles.priceRow}>
          <AppText variant="h4" weight="bold">₹{product.price.toLocaleString()}</AppText>
        </View>

        <View style={styles.wowPriceRow}>
          <View style={styles.wowBadge}>
            <AppText color={Colors.white} weight="bold" style={{ fontSize: 10 }}>wow!</AppText>
          </View>
          <AppText variant="body" weight="bold" color="#0052cc">₹{specialPrice.toLocaleString()}</AppText>
        </View>

        <AppText variant="caption" color="#0052cc" style={styles.offerText}>
          with Exchange offer + more
        </AppText>

        <AppText variant="caption" color={Colors.success} weight="bold" style={styles.bankOffer}>
          Bank Offer
        </AppText>

        <View style={styles.deliveryRow}>
           <AppText variant="caption" color={Colors.textSecondary}>Delivery by </AppText>
           <AppText variant="caption" weight="bold">{deliveryBy}</AppText>
        </View>

        <AppText variant="caption" color={Colors.textLight} style={styles.warranty}>
          1 year warranty by {product.brand.toUpperCase()}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  imageContainer: {
    width: 120,
    aspectRatio: 1,
    marginRight: Spacing.base,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  assuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 4,
  },
  priceRow: {
    marginVertical: 2,
  },
  wowPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wowBadge: {
    backgroundColor: '#0052cc',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  offerText: {
    fontSize: 12,
  },
  bankOffer: {
    fontSize: 12,
    marginTop: 2,
  },
  deliveryRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  warranty: {
    fontSize: 10,
    marginTop: 2,
  },
});
