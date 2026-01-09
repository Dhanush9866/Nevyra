import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockOrders } from '@/services/mockData';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the order or use the first one from mock
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0];
  const firstItem = order.items[0];

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <AppText variant="h4" weight="bold">Order Details</AppText>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <AppText weight="medium">Help</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Product Brief Section */}
        <View style={styles.productBriefSection}>
          <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: firstItem.product.images[0] }}
                style={styles.productImage}
                contentFit="contain"
                transition={300}
              />
            </View>
            <View style={styles.productInfo}>
              <AppText variant="body" weight="medium" numberOfLines={2}>
                {firstItem.product.name}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                400 ml
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.orderIdRow}
            onPress={() => copyToClipboard(order.orderNumber)}
          >
            <AppText variant="small" color={Colors.textSecondary}>
              Order #{order.orderNumber}
            </AppText>
            <Ionicons name="copy-outline" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Tracking Card */}
        <View style={styles.trackingCardContainer}>
          <View style={styles.trackingCard}>
            <View style={styles.trackingHeader}>
              <View>
                <AppText weight="bold" style={styles.deliveryStatusText}>
                  Delivered, Oct 19, 2025
                </AppText>
                <AppText variant="small" color={Colors.textSecondary}>
                  Your item has been delivered
                </AppText>
              </View>
              <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLineOuter}>
                <View style={[styles.progressLineInner, { width: '100%' }]} />
                <View style={[styles.progressDot, { left: 0, backgroundColor: Colors.success }]} />
                <View style={[styles.progressDot, { right: 0, backgroundColor: Colors.success }]} />
              </View>
              <View style={styles.progressLabels}>
                <View>
                  <AppText variant="small" color={Colors.textSecondary}>Order Confirmed</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>Oct 16, 2025</AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppText variant="small" color={Colors.textSecondary}>Delivered</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>Oct 19, 2025</AppText>
                </View>
              </View>
            </View>

            <View style={styles.divider} />
            <TouchableOpacity style={styles.seeAllUpdates}>
              <AppText weight="bold" color={Colors.info}>See all updates</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            Rate your experience
          </AppText>
          <View style={styles.rateBox}>
            <View style={styles.rateHeader}>
              <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
              <AppText weight="medium">Rate the product</AppText>
            </View>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star-outline" size={32} color={Colors.textLight} />
              ))}
            </View>
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.section}>
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={['#7E22CE', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoBanner}
            >
              <View style={styles.promoContent}>
                <AppText color={Colors.white} weight="bold" variant="h4">
                  Flipkart Bajaj Finserv Insta EMI Card
                </AppText>
                <AppText color={Colors.white} variant="small" style={styles.promoSubText}>
                  Easy EMI + ₹400* Off on all orders
                </AppText>
                <TouchableOpacity style={styles.applyButton}>
                  <AppText weight="bold" color={Colors.white} variant="small">Apply Now</AppText>
                </TouchableOpacity>
              </View>
              <Image
                source="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method-credit-card_9a164b.png"
                style={styles.promoImage}
                contentFit="contain"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.grayDivider} />

        {/* Delivery Details */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            Delivery details
          </AppText>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="home-outline" size={20} color={Colors.text} />
              </View>
              <View style={styles.infoText}>
                <AppText weight="bold">Home</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  1-213/1 Atreyapuram Subdistrict, Cbc ch...
                </AppText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color={Colors.text} />
              </View>
              <View style={styles.infoText}>
                <AppText weight="bold">Bablu</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  9502926069, 9704726252
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.grayDivider} />

        {/* Price Details */}
        <View style={[styles.section, { paddingBottom: Spacing.xl }]}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            Price details
          </AppText>
          <View style={styles.infoCard}>
            <View style={styles.priceRow}>
              <AppText color={Colors.text}>Listing price</AppText>
              <AppText weight="medium">₹500</AppText>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.rowWithIcon}>
                <AppText color={Colors.text}>Selling price</AppText>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textLight} />
              </View>
              <AppText weight="medium">₹160</AppText>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.rowWithIcon}>
                <AppText color={Colors.text}>Total fees</AppText>
                <Ionicons name="chevron-down" size={16} color={Colors.textLight} />
              </View>
              <AppText weight="medium">₹16</AppText>
            </View>

            <View style={styles.priceDivider} />

            <View style={styles.priceRow}>
              <AppText variant="body" weight="bold">Total amount</AppText>
              <AppText variant="body" weight="bold">₹176</AppText>
            </View>

            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentFlex}>
                <View>
                  <AppText variant="small" color={Colors.textSecondary}>Payment method</AppText>
                </View>
                <View style={styles.paymentRight}>
                  <MaterialIcons name="payments" size={24} color={Colors.text} />
                  <AppText weight="medium" style={styles.paymentText}>Cash On Delivery</AppText>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="download-outline" size={20} color={Colors.text} />
              <AppText weight="bold">Download Invoice</AppText>
            </TouchableOpacity>
          </View>

          {/* Offers Accordion */}
          <View style={styles.offersSection}>
            <View style={styles.offersHeader}>
              <View style={styles.rowWithIcon}>
                <FontAwesome5 name="trophy" size={16} color={Colors.text} />
                <AppText weight="semibold">Offers earned</AppText>
              </View>
              <Ionicons name="chevron-down" size={20} color={Colors.textLight} />
            </View>
          </View>

          {/* Bottom Order ID */}
          <View style={styles.bottomOrderIdSection}>
            <AppText weight="bold" variant="body">Order ID</AppText>
            <TouchableOpacity
              style={styles.orderIdRowSmall}
              onPress={() => copyToClipboard(order.orderNumber)}
            >
              <AppText variant="small" color={Colors.textSecondary}>
                {order.orderNumber}
              </AppText>
              <Ionicons name="copy-outline" size={14} color={Colors.info} />
            </TouchableOpacity>
          </View>

          {/* Shop More Button */}
          <TouchableOpacity style={styles.shopMoreButton}>
            <AppText weight="bold" color={Colors.info}>Shop more from Nevyra</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: Spacing.md,
  },
  helpButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  container: {
    flex: 1,
  },
  productBriefSection: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  productCard: {
    flexDirection: 'row',
    gap: Spacing.base,
    alignItems: 'center',
  },
  productImageContainer: {
    width: 70,
    height: 70,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  trackingCardContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  trackingCard: {
    borderWidth: 1,
    borderColor: Colors.info,
    borderRadius: 16,
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  deliveryStatusText: {
    fontSize: 18,
    color: '#166534',
  },
  progressContainer: {
    marginVertical: Spacing.md,
  },
  progressLineOuter: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  progressLineInner: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 2,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -4.5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.base,
  },
  seeAllUpdates: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontSize: 18,
  },
  rateBox: {
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
  },
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
  },
  promoBanner: {
    padding: Spacing.base,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  promoSubText: {
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  applyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 4,
  },
  promoImage: {
    width: 100,
    height: 100,
    transform: [{ rotate: '15deg' }, { translateX: 20 }],
  },
  grayDivider: {
    height: 8,
    backgroundColor: '#F1F3F6',
    marginVertical: Spacing.md,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoIcon: {
    paddingTop: 2,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  priceDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  paymentMethodCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  paymentFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentText: {
    fontSize: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  offersSection: {
    marginTop: Spacing.lg,
    backgroundColor: '#F8FAFC',
    padding: Spacing.base,
    borderRadius: 12,
  },
  offersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOrderIdSection: {
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  orderIdRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  shopMoreButton: {
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.info,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
});
