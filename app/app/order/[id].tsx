import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Badge from '@/components/atoms/Badge';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockOrders } from '@/services/mockData';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0];

  return (
    <>
      <Stack.Screen options={{ title: `Order #${order.orderNumber}` }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <View style={styles.header}>
            <AppText variant="h4" weight="bold">
              Order Details
            </AppText>
            <Badge text={order.status.toUpperCase()} variant="primary" />
          </View>

          <View style={styles.row}>
            <AppText variant="body" color={Colors.textSecondary}>
              Order ID
            </AppText>
            <AppText variant="body" weight="semibold">
              {order.orderNumber}
            </AppText>
          </View>

          <View style={styles.row}>
            <AppText variant="body" color={Colors.textSecondary}>
              Total Amount
            </AppText>
            <AppText variant="h4" weight="bold" color={Colors.primary}>
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h4" weight="bold">
            Delivery Address
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            {order.shippingAddress.name}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            {order.shippingAddress.addressLine1}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
            {order.shippingAddress.pincode}
          </AppText>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
