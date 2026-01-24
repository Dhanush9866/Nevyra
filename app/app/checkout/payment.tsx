import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Smartphone, Banknote, ShieldCheck, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCheckout } from '@/store/CheckoutContext';
import { useCart } from '@/store/CartContext';
import { apiService } from '@/services/api';
import Constants from 'expo-constants';

const RAZORPAY_KEY_ID = Constants.expoConfig?.extra?.razorpayKeyId || "rzp_test_Rbm66o8JPEj0P8";

const paymentMethods = [
  { id: 'razorpay', name: 'Razorpay', icon: Smartphone, subtitle: 'Pay via Card, UPI, Netbanking' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, subtitle: 'Pay when you receive' },
];

export default function PaymentMethodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { totalAmount: cartTotal, items: cartItems, clearCart } = useCart();
  const { selectedPaymentMethod, setSelectedPaymentMethod, selectedAddress, resetCheckout, checkoutItems } = useCheckout();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const displayItems = checkoutItems.length > 0 ? checkoutItems : cartItems;
  const displayTotal = checkoutItems.length > 0 
    ? checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : cartTotal;

  const handleRazorpayPayment = async () => {
    try {
      // 1. Create order on backend
      const response = await apiService.createPaymentOrder(displayTotal);
      if (!response.success) {
        Alert.alert('Error', 'Failed to initialize payment');
        return;
      }

      const orderData = response.data;

      // 2. Open Razorpay Checkout
      // We check if we are in Expo Go environment
      const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';
      
      if (isExpoGo) {
        Alert.alert(
          'Expo Go Detected', 
          'Razorpay native module is not supported in Expo Go. Please use a development build or continue with Test Mode.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Simulate Success', 
              onPress: () => finalizeOrder('razorpay', { razorpay_payment_id: 'pay_test_' + Date.now() }) 
            }
          ]
        );
        return;
      }

      let RazorpayCheckout;
      try {
        RazorpayCheckout = require('react-native-razorpay').default;
      } catch (e) {
        Alert.alert('Module Error', 'Failed to load Razorpay module.');
        return;
      }

      const options = {
        description: 'Order Payment',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        name: 'Nevyra',
        order_id: orderData.orderId,
        prefill: {
          email: 'customer@example.com',
          contact: '9999999999',
          name: selectedAddress ? `${selectedAddress.firstName} ${selectedAddress.lastName}` : 'Customer'
        },
        theme: { color: Colors.primary }
      };

      RazorpayCheckout.open(options).then(async (data: any) => {
        // Success
        await finalizeOrder('razorpay', data);
      }).catch((error: any) => {
        // Error
        Alert.alert('Payment Failed', error.description || 'Payment was cancelled');
      });

    } catch (error: any) {
      console.error('Razorpay Error:', error);
      Alert.alert('Error', 'Something went wrong with Razorpay');
    }
  };

  const finalizeOrder = async (method: string, paymentDetails: any = {}) => {
    setIsPlacingOrder(true);
    try {
      const response = await apiService.createOrder({
        paymentMethod: method,
        shippingAddress: selectedAddress,
        items: displayItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: displayTotal,
        paymentDetails: paymentDetails
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

  const handleContinue = () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      finalizeOrder('cod');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: true, 
        headerTitle: 'Payment',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.headerBack}
          >
            <ChevronLeft size={24} color={Colors.text} />
            <AppText variant="body" weight="medium" style={{ marginLeft: 4 }}>Back</AppText>
          </TouchableOpacity>
        ),
      }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountBanner}>
          <AppText variant="body" color={Colors.textSecondary}>Amount to Pay</AppText>
          <AppText variant="h2" weight="bold">₹{displayTotal.toLocaleString('en-IN')}</AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            Select Payment Mode
          </AppText>
          {paymentMethods.map((method) => {
            const isSelected = selectedPaymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={styles.methodCard}
                activeOpacity={0.8}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View style={styles.methodIcon}>
                  <method.icon size={24} color={isSelected ? Colors.primary : Colors.textSecondary} />
                </View>
                <View style={styles.methodDetails}>
                  <AppText variant="body" weight="bold" style={{ fontSize: 16 }}>
                    {method.name}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: 2 }}>
                    {method.subtitle}
                  </AppText>
                </View>
                <View style={[
                  styles.radioButton,
                  isSelected && styles.radioButtonActive
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.safeBanner}>
          <ShieldCheck size={20} color={Colors.success} />
          <AppText variant="body" color={Colors.textSecondary} style={{ marginLeft: 8, fontSize: 14 }}>
            100% Safe and Secure Payments
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.footerInfo}>
          <AppText variant="h3" weight="bold">₹{displayTotal.toLocaleString('en-IN')}</AppText>
          <TouchableOpacity>
            <AppText variant="caption" color={Colors.primary} weight="semibold">View Details</AppText>
          </TouchableOpacity>
        </View>
        <Button
          title={selectedPaymentMethod === 'razorpay' ? 'Pay Now' : 'Confirm Order'}
          onPress={handleContinue}
          style={styles.placeOrderButton}
          loading={isPlacingOrder}
          disabled={!selectedPaymentMethod || isPlacingOrder}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? 0 : 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  amountBanner: {
    backgroundColor: Colors.white,
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 8,
    padding: Spacing.base,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 24,
    color: '#333',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  methodIcon: {
    width: 44,
    alignItems: 'flex-start',
  },
  methodDetails: {
    flex: 1,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CED4DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  safeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Colors.shadow.lg,
  },
  footerInfo: {
    flex: 1,
  },
  placeOrderButton: {
    width: 160,
    borderRadius: 8,
  },
});
