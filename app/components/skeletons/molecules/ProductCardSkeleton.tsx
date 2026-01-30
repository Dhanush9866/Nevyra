import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const ProductCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Skeleton width="100%" height="100%" borderRadius={0} />
      </View>
      <View style={styles.content}>
        <Skeleton width="40%" height={12} style={{ marginBottom: 4 }} />
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={16} />
        <Skeleton width="100%" height={30} style={{ marginTop: 8, borderRadius: 16 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    // Shadow isn't strictly necessary for skeleton but keeps shape
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundGray,
  },
  content: {
    padding: Spacing.xs,
  },
});

export default ProductCardSkeleton;
