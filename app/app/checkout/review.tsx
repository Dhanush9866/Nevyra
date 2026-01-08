import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';

export default function OrderReviewScreen() {
  const router = useRouter();
  const { totalAmount, items } = useCart();

  return (
    <>
      <Stack.Screen options={{ title: 'Review Order' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <View style={styles.section}>
            <AppText variant="h4" weight="bold">
              Order Summary
            </AppText>
            <AppText variant="body" color={Colors.textSecondary}>
              {items.length} items
            </AppText>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <AppText variant="body" color={Colors.textSecondary}>
                Subtotal
              </AppText>
              <AppText variant="body" weight="semibold">
                ₹{totalAmount.toLocaleString('en-IN')}
              </AppText>
            </View>
            <View style={styles.row}>
              <AppText variant="body" color={Colors.textSecondary}>
                Shipping
              </AppText>
              <AppText variant="body" weight="semibold" color={Colors.success}>
                FREE
              </AppText>
            </View>
            <View style={[styles.row, styles.totalRow]}>
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
            title="Place Order"
            onPress={() => router.push('/checkout/success' as any)}
            fullWidth
          />
        </View>
      </View>
    </>
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
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  row: {
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
  },
});
