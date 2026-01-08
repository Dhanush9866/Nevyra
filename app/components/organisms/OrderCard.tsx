import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import AppText from '../atoms/AppText';
import Badge from '../atoms/Badge';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Order, OrderStatus } from '@/types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    variant: 'success' | 'error' | 'warning' | 'info' | 'primary';
  }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  shipped: { label: 'Shipped', variant: 'primary' },
  out_for_delivery: { label: 'Out for Delivery', variant: 'info' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  returned: { label: 'Returned', variant: 'warning' },
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];
  const firstItem = order.items[0];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText variant="body" weight="semibold">
            Order #{order.orderNumber}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </AppText>
        </View>
        <Badge text={statusConfig.label} variant={statusConfig.variant} />
      </View>

      <View style={styles.itemsContainer}>
        <Image
          source={{ uri: firstItem.product.images[0] }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.itemInfo}>
          <AppText variant="body" weight="medium" numberOfLines={2}>
            {firstItem.product.name}
          </AppText>
          {order.items.length > 1 && (
            <AppText variant="caption" color={Colors.textSecondary}>
              +{order.items.length - 1} more{' '}
              {order.items.length - 1 === 1 ? 'item' : 'items'}
            </AppText>
          )}
          <AppText
            variant="h4"
            weight="bold"
            color={Colors.primary}
            style={styles.total}
          >
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </AppText>
        </View>
      </View>

      {order.deliveryDate && (
        <View style={styles.delivery}>
          <AppText variant="caption" color={Colors.textSecondary}>
            {order.status === 'delivered'
              ? 'Delivered on'
              : 'Expected delivery'}
            :{' '}
            <AppText variant="caption" weight="semibold" color={Colors.text}>
              {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </AppText>
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    ...Colors.shadow.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  itemInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  total: {
    marginTop: Spacing.xs,
  },
  delivery: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
