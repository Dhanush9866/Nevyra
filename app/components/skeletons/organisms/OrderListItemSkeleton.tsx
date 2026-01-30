import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const OrderListItemSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Skeleton width="100%" height="100%" borderRadius={8} />
      </View>
      <View style={styles.detailsContainer}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 4 }} />
        <Skeleton width="50%" height={12} style={{ marginBottom: 2 }} />
        <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
        <View style={styles.footer}>
          <Skeleton width={80} height={24} borderRadius={12} />
          <Skeleton width={80} height={14} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.base,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginRight: Spacing.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OrderListItemSkeleton;
