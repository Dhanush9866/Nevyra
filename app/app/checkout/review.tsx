import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';
import { useCheckout } from '@/store/CheckoutContext';
import { useAuth } from '@/store/AuthContext';
import CartItemCard from '@/components/molecules/CartItemCard';

export default function OrderReviewScreen() {
  const router = useRouter();
  const { totalAmount: cartTotal, items: cartItems } = useCart();
  const { selectedAddress, setSelectedAddress, checkoutItems } = useCheckout();
  const { addresses } = useAuth();

  const displayItems = checkoutItems.length > 0 ? checkoutItems : cartItems;
  const displayTotal = checkoutItems.length > 0 
    ? checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : cartTotal;

  React.useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  return (
    <>
      <Stack.Screen options={{ title: 'Order Summary' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Shipping Address Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="h4" weight="bold">
                Shipping Address
              </AppText>
              <Button 
                title="Change" 
                variant="text" 
                size="sm" 
                onPress={() => router.push({
                  pathname: '/checkout/address-list',
                  params: { source: 'checkout' }
                } as any)}
              />
            </View>
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

          {/* Items Summary */}
          <View style={styles.section}>
            <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
              Items ({displayItems.length})
            </AppText>
            <View style={styles.itemsList}>
              {displayItems.map((item) => (
                <CartItemCard 
                  key={item.id} 
                  item={item} 
                  showActions={false} 
                />
              ))}
            </View>
          </View>

          {/* Price Details */}
          <View style={[styles.section, styles.priceSection]}>
            <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
              Price Details
            </AppText>
            <View style={styles.priceRow}>
              <AppText color={Colors.textSecondary}>Price ({displayItems.length} items)</AppText>
              <AppText>₹{displayTotal.toLocaleString('en-IN')}</AppText>
            </View>
            <View style={styles.priceRow}>
              <AppText color={Colors.textSecondary}>Delivery Charges</AppText>
              <AppText color={Colors.success}>FREE</AppText>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <AppText variant="h4" weight="bold">Total Amount</AppText>
              <AppText variant="h4" weight="bold">₹{displayTotal.toLocaleString('en-IN')}</AppText>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalAmountLabel}>
            <AppText variant="h4" weight="bold">₹{displayTotal.toLocaleString('en-IN')}</AppText>
            <AppText variant="caption" color={Colors.primary}>View Price Details</AppText>
          </View>
          <Button
            title="Continue"
            onPress={() => router.push('/checkout/payment' as any)}
            style={styles.continueButton}
            disabled={!selectedAddress || displayItems.length === 0}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 8,
    padding: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoCard: {
    gap: 4,
  },
  itemsList: {
    gap: 0,
  },
  priceSection: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    ...Colors.shadow.lg,
  },
  totalAmountLabel: {
    flex: 1,
  },
  continueButton: {
    flex: 1,
    marginLeft: 20,
  },
});
