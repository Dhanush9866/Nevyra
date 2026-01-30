import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const ProductListItemSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
         <Skeleton width="100%" height="100%" />
      </View>
      <View style={styles.content}>
         <Skeleton width="90%" height={16} style={{marginBottom: 8}} />
         <View style={styles.row}>
             <Skeleton width={60} height={12} />
             <Skeleton width={40} height={12} style={{marginLeft: 8}} />
         </View>
         <Skeleton width="40%" height={24} style={{marginTop: 8, marginBottom: 4}} />
         <Skeleton width="60%" height={12} style={{marginBottom: 4}} />
         <Skeleton width="30%" height={12} />
      </View>
    </View>
  );
};

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
  content: {
    flex: 1,
    gap: 2,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
  }
});

export default ProductListItemSkeleton;
