import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const { width } = Dimensions.get('window');

const CartItemCardSkeleton = () => {
  return (
    <View style={styles.cartItemCard}>
      <View style={styles.itemMainInfo}>
        <View style={styles.itemImageContainer}>
          <Skeleton width={80} height={80} style={{ marginBottom: 10 }} />
          <Skeleton width={80} height={30} />
        </View>

        <View style={styles.itemDetails}>
          <Skeleton width="90%" height={16} style={{ marginBottom: 6 }} />
          <Skeleton width="60%" height={12} style={{ marginBottom: 12 }} />
          <Skeleton width="50%" height={12} style={{ marginBottom: 12 }} />
          <Skeleton width="40%" height={24} />
        </View>
      </View>
      <View style={styles.itemActions}>
        <Skeleton width="48%" height={36} />
        <Skeleton width="48%" height={36} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemMainInfo: {
    flexDirection: 'row',
  },
  itemImageContainer: {
    width: width * 0.25,
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
    gap: 8,
    justifyContent: 'space-between'
  },
});

export default CartItemCardSkeleton;
