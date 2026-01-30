import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CartItemCardSkeleton from '../molecules/CartItemCardSkeleton';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const CartScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {[1, 2, 3].map((i) => (
          <CartItemCardSkeleton key={i} />
        ))}

        <View style={styles.billDetails}>
          <Skeleton width="50%" height={20} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={1} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={24} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Skeleton width="40%" height={40} />
        <Skeleton width="40%" height={48} borderRadius={25} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  billDetails: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default CartScreenSkeleton;
