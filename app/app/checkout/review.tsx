import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';
import { useCheckout } from '@/store/CheckoutContext';
import { apiService } from '@/services/api';

export default function OrderReviewScreen() {
  const router = useRouter();
  const { totalAmount, items, clearCart } = useCart();
  const { selectedAddress, selectedPaymentMethod, resetCheckout } = useCheckout();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      Alert.alert('Error', 'Please select address and payment method');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const response = await apiService.createOrder({
        paymentMethod: selectedPaymentMethod,
        shippingAddress: selectedAddress,
        paymentDetails: {} // Add payment details if needed
      });

      if (response.success) {
        clearCart();
        resetCheckout();
        router.push('/checkout/success' as any);
      } else {
        Alert.alert('Error', response.message || 'Failed to place order');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
              Shipping Address
            </AppText>
            {selectedAddress ? (
              <View style={styles.infoCard}>
                <AppText weight="semibold">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </AppText>
                <AppText color={Colors.textSecondary}>
                  {selectedAddress.addressLine1}
                </AppText>
                <AppText color={Colors.textSecondary}>
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                </AppText>
                <AppText color={Colors.textSecondary}>
                  Phone: {selectedAddress.phone}
                </AppText>
              </View>
            ) : (
              <AppText color={Colors.error}>No address selected</AppText>
            )}
          </View>

          <View style={styles.section}>
            <AppText variant="h4" weight="bold">
              Payment Method
            </AppText>
            <View style={styles.infoCard}>
              <AppText weight="semibold">
                {selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : selectedPaymentMethod?.toUpperCase()}
              </AppText>
            </View>
          </View>

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
            title={isPlacingOrder ? "" : "Place Order"}
            onPress={handlePlaceOrder}
            fullWidth
            disabled={isPlacingOrder || !selectedAddress || !selectedPaymentMethod}
          >
            {isPlacingOrder && <ActivityIndicator color={Colors.white} />}
          </Button>
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
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    gap: 4,
    ...Colors.shadow.sm,
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
