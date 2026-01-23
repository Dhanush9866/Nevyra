import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { apiService } from '@/services/api';
import { Order } from '@/types';
import { Alert, TextInput } from 'react-native';

// Rating Card Component for individual products
interface RatingCardProps {
  item: any;
  orderId: string;
}

function RatingCard({ item, orderId }: RatingCardProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.submitReview(item.product.id, {
        rating,
        comment: comment.trim(),
        title: `Review for ${item.product.name}`,
      });

      if (response.success) {
        Alert.alert('Success', 'Thank you for your review!');
        setHasSubmitted(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to submit review');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <View style={styles.rateBox}>
        <View style={styles.rateHeader}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <AppText weight="medium" color={Colors.success}>Review submitted!</AppText>
        </View>
        <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: 4 }}>
          Thank you for rating {item.product.name}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.rateBox}>
      <View style={styles.productRatingHeader}>
        <Image
          source={{ uri: item.product?.images?.[0] || 'https://via.placeholder.com/50' }}
          style={styles.productThumb}
        />
        <View style={{ flex: 1 }}>
          <AppText weight="semibold" numberOfLines={2}>{item.product?.name || 'Product'}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>Qty: {item.quantity}</AppText>
        </View>
      </View>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? "#FFB800" : Colors.textLight}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.reviewInput}
        placeholder="Write your review here..."
        placeholderTextColor={Colors.textLight}
        multiline
        numberOfLines={3}
        value={comment}
        onChangeText={setComment}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmitRating}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <AppText weight="bold" color={Colors.white}>Submit Review</AppText>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const fetchOrderDetail = async (showLoading = true) => {
    if (!id) return;
    if (showLoading) setLoading(true);
    try {
      const response = await apiService.getOrderDetails(id as string);
      if (response.success) {
        setOrder(response.data);
        console.log(`order details`, response.data);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchOrderDetail(false);
    }, [id])
  );

  const handleCancelOrder = async () => {
    if (!order) return;

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.cancelOrder(order.id);
              if (response.success) {
                Alert.alert('Success', 'Order cancelled successfully');
                fetchOrderDetail(); // Refresh order details
              } else {
                Alert.alert('Error', response.message || 'Failed to cancel order');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const handleReturnOrder = async () => {
    if (!order) return;

    Alert.alert(
      'Return Order',
      'Please select a reason for return',
      [
        { text: 'Changed my mind', onPress: () => submitReturn('Changed my mind') },
        { text: 'Defective/Damaged', onPress: () => submitReturn('Defective/Damaged') },
        { text: 'Wrong item received', onPress: () => submitReturn('Wrong item received') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const submitReturn = async (reason: string) => {
    try {
      const response = await apiService.requestReturn(order!.id, reason);
      if (response.success) {
        Alert.alert('Success', 'Return request submitted successfully');
        fetchOrderDetail();
      } else {
        Alert.alert('Error', response.message || 'Failed to submit return request');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit return request');
    }
  };

  const canReturn = () => {
    if (!order || order.status !== 'delivered') return false;
    if (order.returnStatus && order.returnStatus !== 'None') return false;
    
    const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : new Date(order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 10;
  };

  const canCancel = () => {
    if (!order) return false;
    return ['pending', 'processing', 'confirmed'].includes(order.status);
  };

  const copyToClipboard = async (text?: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centerContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.mainContainer, styles.centerContainer]}>
        <AppText color={Colors.error} style={{ marginBottom: 12 }}>{error || 'Order not found'}</AppText>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <AppText color={Colors.white}>Go Back</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const firstItem = order.items?.[0];
  const orderDate = formatDate(order.createdAt);
  const deliveryDate = order.deliveryDate ? formatDate(order.deliveryDate) : (order.status === 'delivered' ? 'Completed' : 'Expected soon');

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
                source={{ uri: firstItem?.product?.images?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
                contentFit="contain"
                transition={300}
              />
            </View>
            <View style={styles.productInfo}>
              <AppText variant="body" weight="medium" numberOfLines={2}>
                {firstItem?.product?.name || 'Unknown Product'}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                Qty: {firstItem?.quantity}
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
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}, {order.status === 'delivered' ? deliveryDate : orderDate}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary}>
                  {order.status === 'delivered' ? 'Your item has been delivered' : `Order is currently ${order.status}`}
                </AppText>
              </View>
              <Ionicons
                name={order.status === 'delivered' ? "checkmark-circle" : "time-outline"}
                size={32}
                color={order.status === 'delivered' ? Colors.success : Colors.warning}
              />
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
                  <AppText variant="small" color={Colors.textSecondary}>Order Placed</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{orderDate}</AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppText variant="small" color={Colors.textSecondary}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{order.status === 'delivered' ? deliveryDate : ''}</AppText>
                </View>
              </View>
            </View>

            <View style={styles.divider} />
            {/* <TouchableOpacity style={styles.seeAllUpdates}>
              <AppText weight="bold" color={Colors.info}>See all updates</AppText>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Rating Section - Only show if order is delivered */}
        {order.status === 'delivered' && order.items && order.items.length > 0 && (
          <View style={styles.section}>
            <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
              Rate your experience
            </AppText>
            {order.items.map((item, index) => (
              <RatingCard
                key={item.id || index}
                item={item}
                orderId={order.id}
              />
            ))}
          </View>
        )}



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
                <AppText weight="bold">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                </AppText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color={Colors.text} />
              </View>
              <View style={styles.infoText}>
                <AppText weight="bold">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {order.shippingAddress?.phone}
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
              <AppText color={Colors.text}>Subtotal</AppText>
              <AppText weight="medium">₹{order.totalAmount}</AppText>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.rowWithIcon}>
                <AppText color={Colors.text}>Delivery</AppText>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textLight} />
              </View>
              <AppText weight="medium" color={Colors.success}>FREE</AppText>
            </View>

            <View style={styles.priceDivider} />

            <View style={styles.priceRow}>
              <AppText variant="body" weight="bold">Total amount</AppText>
              <AppText variant="body" weight="bold">₹{order.totalAmount}</AppText>
            </View>

            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentFlex}>
                <View>
                  <AppText variant="small" color={Colors.textSecondary}>Payment method</AppText>
                </View>
                <View style={styles.paymentRight}>
                  <MaterialIcons name="payments" size={24} color={Colors.text} />
                  <AppText weight="medium" style={styles.paymentText}>{order.paymentMethod}</AppText>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="download-outline" size={20} color={Colors.text} />
              <AppText weight="bold">Download Invoice</AppText>
            </TouchableOpacity>
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

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {canCancel() && (
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelOrder}>
                <Ionicons name="close-circle-outline" size={20} color={Colors.error} />
                <AppText weight="bold" color={Colors.error}>Cancel Order</AppText>
              </TouchableOpacity>
            )}
            {canReturn() && (
              <TouchableOpacity style={[styles.actionButton, styles.returnButton]} onPress={handleReturnOrder}>
                <Ionicons name="reload-outline" size={20} color={Colors.primary} />
                <AppText weight="bold" color={Colors.primary}>Return Order</AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* Shop More Button */}
          <TouchableOpacity style={styles.shopMoreButton} onPress={() => router.push('/(tabs)/(home)')}>
            <AppText weight="bold" color={Colors.info}>Shop more from Zythova</AppText>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  productRatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.md,
    minHeight: 80,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonsContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  returnButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
});
