import { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Heart, Star, Share2, Search, ArrowLeft, ShoppingCart, ChevronRight, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/atoms/IconButton';
import Badge from '@/components/atoms/Badge';
import PriceTag from '@/components/molecules/PriceTag';
import RatingStars from '@/components/molecules/RatingStars';
import ProductCard from '@/components/molecules/ProductCard';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import Loader from '@/components/atoms/Loader';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { useCheckout } from '@/store/CheckoutContext';
import { mockProducts } from '@/services/mockData';
import { CartItem } from '@/types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, totalItems } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { setCheckoutItems } = useCheckout();
  const [showToast, setShowToast] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiService.getProductDetails(id as string),
    enabled: !!id,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const { data: similarData } = useQuery({
    queryKey: ['similar-products', id],
    queryFn: () => apiService.getSimilarProducts(id as string),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => apiService.getReviews(id as string),
    enabled: !!id,
  });

  const product = data?.data;
  const similarProducts = similarData?.data || [];
  const reviews = reviewsData?.data || [];
  const latestReview = reviews.length > 0 ? reviews[0] : null;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Loader />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <AppText color={Colors.error}>Product not found or failed to load</AppText>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: Spacing.md }} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* CUSTOM FIXED HEADER WITH SEARCH */}
      <View style={[
        styles.fixedHeader,
        {
          paddingTop: insets.top,
          paddingBottom: Spacing.sm,
        }
      ]}>
        <LinearGradient
          colors={[Colors.primary, '#8e44ad']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => router.push('/search' as any)}
              activeOpacity={0.9}
              style={styles.searchBar}
            >
              <Search size={18} color={Colors.textSecondary} />
              <AppText variant="body" color={Colors.textLight} style={{ fontSize: 13 }}>
                Search for products...
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.headerActions}>
            <View>
              <IconButton
                icon={ShoppingCart}
                onPress={() => router.push('/(tabs)/cart')}
                color={Colors.white}
                size={20}
              />
              {totalItems > 0 && (
                <View style={styles.headerBadge}>
                  <AppText variant="caption" color={Colors.white} style={{ fontSize: 10, fontWeight: 'bold' }}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top + 60 }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.images[0] }}
              style={styles.image}
              contentFit="cover"
            />

            {/* Image Actions Overlay */}
            <View style={styles.imageActions}>
              <IconButton
                icon={Share2}
                onPress={() => { }}
                color={Colors.white}
                backgroundColor="rgba(0,0,0,0.4)"
                size={20}
              />
              <IconButton
                icon={Heart}
                onPress={() => toggleWishlist(product)}
                color={isWishlisted(product.id) ? Colors.error : Colors.white}
                backgroundColor="rgba(0,0,0,0.4)"
                size={20}
              />
            </View>



          </View>

          <View style={styles.content}>
            <AppText variant="caption" color={Colors.textSecondary}>
              {product.brand}
            </AppText>
            <AppText variant="h3" weight="bold" style={styles.title}>
              {product.name}
            </AppText>

            <View style={styles.ratingRow}>
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </View>

            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              size="lg"
            />

            <View style={styles.section}>
              <AppText variant="h4" weight="bold">
                Description
              </AppText>
              <AppText variant="body" color={Colors.textSecondary}>
                {product.description}
              </AppText>
            </View>

            {product.features && (
              <View style={styles.section}>
                <AppText variant="h4" weight="bold">
                  Features
                </AppText>
                {product.features.map((feature: string, index: number) => (
                  <View key={index} style={styles.featureItem}>
                    <Star
                      size={16}
                      color={Colors.rating}
                      fill={Colors.rating}
                    />
                    <AppText variant="body" color={Colors.textSecondary}>
                      {feature}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            {/* SPECIFICATIONS SECTION */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <AppText variant="h4" weight="bold" color="#003366">
                    Product Specifications
                  </AppText>
                </View>
                <View style={styles.specificationsContainer}>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <View
                      key={key}
                      style={[
                        styles.specRow,
                        { backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F0F8FF' }
                      ]}
                    >
                      <View style={styles.specLabelContainer}>
                        <AppText variant="body" weight="bold" color="#003366">
                          {key}
                        </AppText>
                      </View>
                      <View style={styles.specValueContainer}>
                        <AppText variant="body" color={Colors.text}>
                          {String(value)}
                        </AppText>
                      </View>
                    </View>
                  ))}
                  {/* Fallback if list is short - ensuring it follows the same style if desired, or remove if not needed. Keeping specific item consistent */}
                  {/* <View style={[styles.specRow, { backgroundColor: Object.keys(product.specifications).length % 2 === 0 ? '#FFFFFF' : '#F0F8FF' }]}> 
                    <View style={styles.specLabelContainer}>
                       <AppText variant="body" weight="bold" color="#003366">Warranty</AppText>
                    </View>
                     <View style={styles.specValueContainer}>
                       <AppText variant="body" color={Colors.text}>1 Year Brand Warranty</AppText>
                    </View>
                  </View> */}
                </View>
              </View>
            )}

            {/* SIMILAR PRODUCTS SECTION */}
            {similarProducts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <AppText variant="h4" weight="bold">Similar Products</AppText>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarProductsContainer}
                >
                  {similarProducts.map((item: any) => (
                    <View key={item.id} style={styles.similarProductItem}>
                      <ProductCard
                        product={item}
                        onPress={() => router.push(`/product/${item.id}` as any)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* RATINGS & REVIEWS SECTION */}
            <View style={[styles.section, styles.reviewsSection]}>
              <View style={styles.sectionHeader}>
                <AppText variant="h4" weight="bold">
                  Ratings & Reviews
                </AppText>
                <TouchableOpacity
                  onPress={() => router.push('/product/reviews' as any)}
                  style={styles.viewAllReviews}
                >
                  <AppText variant="caption" color={Colors.primary} weight="bold">
                    View All
                  </AppText>
                  <ChevronRight size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.ratingOverview}>
                <View style={styles.ratingBigCount}>
                  <AppText variant="h1" weight="bold">{product.rating}</AppText>
                  <RatingStars rating={product.rating} />
                  <AppText variant="caption" color={Colors.textSecondary}>
                    {product.reviewCount} reviews
                  </AppText>
                </View>
                <View style={styles.reviewSnippet}>
                  {latestReview ? (
                    <AppText variant="body" color={Colors.textSecondary} style={{ fontStyle: 'italic' }}>
                      "{latestReview.comment}"
                    </AppText>
                  ) : (
                    <AppText variant="body" color={Colors.textLight} style={{ fontStyle: 'italic' }}>
                      No reviews yet. Be the first to review this product!
                    </AppText>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.base) }
        ]}>
          <View style={styles.footerButtons}>
            <Button
              title="Add to Cart"
              variant="outline"
              onPress={() => {
                addToCart(product);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
              }}
              style={[styles.flexButton, { borderRadius: 8 }]}
            />
            <Button
              title="Buy Now"
              onPress={() => {
                // For Buy Now, we create a temporary CartItem and set it as the ONLY item in checkout
                const item: CartItem = {
                  id: Date.now().toString(),
                  product: product,
                  quantity: 1,
                };
                setCheckoutItems([item], 'buy_now');
                router.push('/checkout/address-list' as any);
              }}
              style={[styles.flexButton, { borderRadius: 25 }]}
            />
          </View>
        </View>
      </View>

      {/* Toast Notification */}
      {showToast && (
        <View style={[styles.toastContainer, { bottom: insets.bottom + 80 }]}>
          <View style={styles.toastContent}>
            <View style={styles.toastIconContainer}>
              <Check size={16} color={Colors.white} strokeWidth={3} />
            </View>
            <AppText variant="body" color={Colors.white} weight="medium">
              Added to cart successfully
            </AppText>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  discountBadge: {
    position: 'absolute',
    top: 100,
    left: Spacing.base,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    marginTop: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Colors.shadow.lg,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flexButton: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    ...Colors.shadow.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 40,
    gap: Spacing.sm,
    ...Colors.shadow.sm,
  },
  imageActions: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    gap: Spacing.sm,
    zIndex: 10,
  },
  reviewsSection: {
    borderTopWidth: 8,
    borderTopColor: '#f5f5f5',
    paddingTop: Spacing.lg,
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  ratingBigCount: {
    alignItems: 'center',
    gap: 4,
  },
  reviewSnippet: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: Spacing.md,
    borderRadius: 8,
  },
  specificationsContainer: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  specLabelContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  specValueContainer: {
    flex: 1,
  },
  similarProductsContainer: {
    gap: Spacing.md,
    paddingRight: Spacing.xl,
    marginTop: Spacing.sm,
  },
  similarProductItem: {
    width: 160,
  },
  toastContainer: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
    zIndex: 2000,
  },
  toastContent: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    gap: Spacing.sm,
    ...Colors.shadow.md,
  },
  toastIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50', // Green color (success)
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    zIndex: 1,
  },
});
