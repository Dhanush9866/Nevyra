import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const CategoryItemSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton width={64} height={64} borderRadius={32} style={styles.image} />
      <Skeleton width={50} height={12} borderRadius={6} style={{ marginTop: 8 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
    marginRight: Spacing.sm,
  },
  image: {
    marginBottom: Spacing.xs
  }
});

export default CategoryItemSkeleton;
