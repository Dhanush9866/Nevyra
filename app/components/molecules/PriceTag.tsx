import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceTag({
  price,
  originalPrice,
  discount,
  size = 'md',
}: PriceTagProps) {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <View style={styles.container}>
      <AppText
        variant={size === 'lg' ? 'h3' : size === 'md' ? 'h4' : 'body'}
        weight="bold"
        color={Colors.primary}
      >
        ₹{price.toLocaleString('en-IN')}
      </AppText>
      {hasDiscount && (
        <>
          <AppText
            variant={size === 'lg' ? 'body' : 'caption'}
            color={Colors.textLight}
            style={styles.originalPrice}
          >
            ₹{originalPrice.toLocaleString('en-IN')}
          </AppText>
          {discount && (
            <AppText
              variant={size === 'lg' ? 'body' : 'caption'}
              color={Colors.success}
              weight="semibold"
            >
              {discount}% OFF
            </AppText>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
});
