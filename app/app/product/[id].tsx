import { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Heart, Star, Share2, Search, ArrowLeft, ShoppingCart, ChevronRight } from 'lucide-react-native';
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
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { setCheckoutItems } = useCheckout();

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
            <IconButton
              icon={ShoppingCart}
              onPress={() => router.push('/(tabs)/cart')}
              color={Colors.white}
              size={20}
            />
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


            {product.discount && product.discount > 0 && (
              <View style={styles.discountBadge}>
                <Badge text={`${product.discount}% OFF`} variant="error" />
              </View>
            )}
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
                <AppText variant="h4" weight="bold">
                  Specifications
                </AppText>
                <View style={styles.specificationsGrid}>
                  {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                    <View key={key} style={styles.specItem}>
                      <AppText variant="caption" color={Colors.textSecondary}>{key}</AppText>
                      <AppText variant="body" weight="medium">{String(value)}</AppText>
                    </View>
                  ))}
                  {/* Fallback if list is short */}
                  <View style={styles.specItem}>
                    <AppText variant="caption" color={Colors.textSecondary}>Warranty</AppText>
                    <AppText variant="body" weight="medium">1 Year Brand Warranty</AppText>
                  </View>
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
                router.push('/(tabs)/cart' as any);
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
  specificationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  specItem: {
    width: '45%',
    backgroundColor: '#f8f9fa',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  similarProductsContainer: {
    gap: Spacing.md,
    paddingRight: Spacing.xl,
    marginTop: Spacing.sm,
  },
  similarProductItem: {
    width: 160,
  },
});
