import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import OrderCard from '@/components/organisms/OrderCard';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockOrders } from '@/services/mockData';

export default function OrderListScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          My Orders
        </AppText>
        <AppText variant="body" color={Colors.textSecondary}>
          Track your orders
        </AppText>
      </View>

      <View style={styles.ordersList}>
        {mockOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onPress={() => router.push(`/order/${order.id}` as any)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
  },
  header: {
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  ordersList: {
    gap: Spacing.md,
  },
});
