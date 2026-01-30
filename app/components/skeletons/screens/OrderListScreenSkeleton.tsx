import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import OrderListItemSkeleton from '../organisms/OrderListItemSkeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const OrderListScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[1, 2, 3, 4, 5]}
        keyExtractor={(item) => item.toString()}
        renderItem={() => <OrderListItemSkeleton />}
        contentContainerStyle={{ paddingVertical: Spacing.sm }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default OrderListScreenSkeleton;
