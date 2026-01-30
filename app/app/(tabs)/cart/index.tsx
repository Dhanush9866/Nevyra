import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  ChevronDown,
  Trash2,
  FileText,
  Zap,
  Info,
  X,
} from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';

import CartItemCard from '@/components/molecules/CartItemCard';
import SlideToActButton from '@/components/molecules/SlideToActButton';
import { CartScreenSkeleton } from '@/components/skeletons';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';
import { useAuth } from '@/store/AuthContext';
import { useCheckout } from '@/store/CheckoutContext';

const { width } = Dimensions.get('window');

// Custom colors from the image
const BRAND_BLUE = '#2874F0';
const SUCCESS_GREEN = '#118D44';
const ERROR_RED = '#D11243';
const BACKGROUND_LIGHT = '#F1F3F6';


export default function CartScreen() {
  const router = useRouter();
  const { items, totalAmount, removeFromCart, updateQuantity, isLoading, refreshCart } = useCart();
  const { addresses } = useAuth();
  const { setCheckoutItems, selectedAddress } = useCheckout();


  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, [refreshCart])
  );

  const displayAddress = selectedAddress || addresses.find(a => a.isDefault) || addresses[0];

  const totalMRP = items.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price * 1.2) * item.quantity, 0);
  const totalDisplayPrice = totalAmount;
  const totalSavings = totalMRP - totalDisplayPrice;

  if (isLoading) {
    return <CartScreenSkeleton />;
  }

  if (items.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <AppText variant="h4" color={Colors.textSecondary}>Your cart is empty</AppText>
        <SlideToActButton
          onComplete={() => router.push('/(tabs)/(home)' as any)}
          lockedText="Slide to Shop"
          unlockedText="Let's Go!"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Section */}
        <View style={styles.deliveryContainer}>
          <View style={styles.deliveryLeft}>
            <View style={styles.deliveryRow}>
              <AppText variant="body" weight="medium">Deliver to: </AppText>
              <AppText variant="body" weight="bold">
                {displayAddress ? `${displayAddress.firstName} ${displayAddress.lastName}` : 'Guest User'}
              </AppText>
              {displayAddress?.isDefault && (
                <View style={styles.homeBadge}>
                  <AppText style={styles.homeBadgeText}>DEFAULT</AppText>
                </View>
              )}
            </View>
            <AppText variant="caption" color={Colors.textSecondary} numberOfLines={1}>
              {displayAddress
                ? `${displayAddress.addressLine1}, ${displayAddress.city}, ${displayAddress.state}`
                : 'Please add a delivery address'}
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => router.push({ pathname: '/checkout/address-list', params: { source: 'checkout' } } as any)}
          >
            <AppText variant="caption" weight="semibold" style={{ color: BRAND_BLUE }}>Change</AppText>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onBuyNow={(id) => {
              setCheckoutItems([item], 'buy_now');
              if (displayAddress) {
                router.push('/checkout/review' as any);
              } else {
                router.push({ pathname: '/checkout/address-list', params: { source: 'checkout' } } as any);
              }
            }}
          />
        ))}

        {/* Protection Teaser */}
        {/* <View style={styles.protectionCard}>
          <View style={styles.protectionHeader}>
            <AppText variant="body" weight="semibold">Complete Digital Protection</AppText>
            <TouchableOpacity>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.protectionContent}>
            <View style={styles.protectionPlaceholder} />
          </View>
        </View> */}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        {/* Savings Banner */}
        <View style={styles.savingsBanner}>
          <View style={styles.savingsIcon}>
            <AppText style={{ color: Colors.white, fontSize: 10 }}>%</AppText>
          </View>
          <AppText variant="caption" color={SUCCESS_GREEN} weight="semibold">
            You'll save ₹{totalSavings.toLocaleString('en-IN')} on this order!
          </AppText>
        </View>

        <View style={styles.footerCTA}>
          <View style={styles.totalAmountContainer}>
            <AppText variant="caption" color={Colors.textSecondary} style={{ textDecorationLine: 'line-through' }}>
              ₹{totalMRP.toLocaleString('en-IN')}
            </AppText>
            <View style={styles.priceWithInfo}>
              <AppText variant="h4" weight="semibold">₹{totalDisplayPrice.toLocaleString('en-IN')}</AppText>
              <Info size={14} color={Colors.textSecondary} style={{ marginLeft: 4 }} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={() => {
              setCheckoutItems(items, 'cart');
              if (displayAddress) {
                router.push('/checkout/review' as any);
              } else {
                router.push({ pathname: '/checkout/address-list', params: { source: 'checkout' } } as any);
              }
            }}
          >
            <AppText variant="body" weight="semibold" style={styles.placeOrderText}>Place Order</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 10,
  },
  headerTitle: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: BRAND_BLUE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Extra space for footer
  },
  deliveryContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  deliveryLeft: {
    flex: 1,
    marginRight: 30, // Increased gap
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  homeBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  homeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#878787',
  },
  changeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10, // Reduced from 16
    paddingVertical: 5, // Reduced from 8
    borderRadius: 4,
    minWidth: 70, // Ensure it doesn't get too small
    alignItems: 'center',
  },
  cartItemCard: {
    backgroundColor: Colors.white,
    marginTop: 8,
    padding: Spacing.base,
  },
  itemMainInfo: {
    flexDirection: 'row',
  },
  itemImageContainer: {
    width: width * 0.25,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#F9F9F9',
  },
  qtyButton: {
    padding: 6,
  },
  qtyText: {
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  stockStatus: {
    color: ERROR_RED,
    fontSize: 10,
    marginTop: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    marginBottom: 2,
  },
  itemSpecs: {
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    lineHeight: 14,
  },
  priceContainer: {
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    marginLeft: 4,
    marginRight: 8,
  },
  mrpText: {
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  currentPrice: {
    color: Colors.black,
  },
  wowPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  wowIcon: {
    width: 40,
    height: 15,
    marginRight: 6,
    resizeMode: 'contain',
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  coinIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FBC02D',
    borderWidth: 1,
    borderColor: '#F9A825',
  },
  offersLink: {
    marginTop: 2,
  },
  deliveryDateRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  removeBtn: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFE0E0',
  },
  saveBtn: {
    backgroundColor: '#F0F7FF',
    borderColor: '#E0EEFF',
  },
  buyBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 11,
  },
  protectionCard: {
    backgroundColor: '#F1F7FF',
    marginTop: 8,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DBE9FF',
  },
  protectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  protectionContent: {
    // Add protection items here
  },
  protectionPlaceholder: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  savingsBanner: {
    backgroundColor: '#F6FFF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  savingsIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: SUCCESS_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  footerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
  },
  totalAmountContainer: {
    flex: 1,
  },
  priceWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  placeOrderText: {
    color: Colors.white,
  },
  emptyButton: {
    marginTop: 24,
    minWidth: 200,
    borderRadius: 30,
    ...Colors.shadow.md,
  },
});

