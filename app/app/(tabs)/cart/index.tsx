import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import CartItem from '@/components/organisms/CartItem';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={80} color={Colors.textLight} />
        <AppText variant="h4" weight="semibold" style={styles.emptyTitle}>
          Your cart is empty
        </AppText>
        <AppText variant="body" color={Colors.textSecondary} align="center">
          Add items to your cart to see them here
        </AppText>
        <Button
          title="Start Shopping"
          onPress={() => router.push('/(tabs)/(home)')}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsList}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
              onPress={() => router.push(`/product/${item.product.id}` as any)}
            />
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <AppText variant="body" color={Colors.textSecondary}>
              Subtotal ({items.length} items)
            </AppText>
            <AppText variant="body" weight="semibold">
              ₹{totalAmount.toLocaleString('en-IN')}
            </AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText variant="body" color={Colors.textSecondary}>
              Shipping
            </AppText>
            <AppText variant="body" weight="semibold" color={Colors.success}>
              FREE
            </AppText>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <AppText variant="h4" weight="bold">
              Total
            </AppText>
            <AppText variant="h4" weight="bold" color={Colors.primary}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </AppText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Proceed to Checkout"
          onPress={() => router.push('/checkout/address-list' as any)}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  itemsList: {
    gap: Spacing.md,
  },
  summary: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Colors.shadow.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Colors.shadow.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.base,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    marginTop: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.lg,
  },
});
