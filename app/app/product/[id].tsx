import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Share, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
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
import { ProductDetailScreenSkeleton } from '@/components/skeletons';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { useCheckout } from '@/store/CheckoutContext';
import { useAuth } from '@/store/AuthContext';
import { mockProducts } from '@/services/mockData';
import { CartItem } from '@/types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, totalItems } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { setCheckoutItems, selectedAddress } = useCheckout();
  const { addresses } = useAuth();

  const displayAddress = selectedAddress || addresses?.find(a => a.isDefault) || addresses?.[0];
  const [showToast, setShowToast] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const screenWidth = Dimensions.get('window').width;

  const onImageScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (activeImageIndex !== roundIndex) {
      setActiveImageIndex(roundIndex);
    }
  }, [activeImageIndex]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this ${product?.name} on Nevyra! Price: $${product?.price}`,
        url: product?.link || 'https://nevyra.com', // fallback
        title: product?.name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

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

  useEffect(() => {
    if (product?.variantOptions?.length) {
      const defaultVars: { [key: string]: string } = {};
      product.variantOptions.forEach((opt: any) => {
        if (opt.values && opt.values.length > 0) {
          defaultVars[opt.name] = opt.values[0];
        }
      });
      setSelectedVariants(defaultVars);
    }
  }, [product]);

  const currentCombination = React.useMemo(() => {
    if (!product?.variantCombinations || Object.keys(selectedVariants).length === 0) return null;
    return product.variantCombinations.find((combo: any) => {
      if (!combo.attributes) return false;
      return Object.entries(selectedVariants).every(
        ([key, value]) => combo.attributes[key] === value
      );
    });
  }, [product, selectedVariants]);

  const displayPrice = currentCombination?.price !== undefined ? currentCombination.price : product?.price;
  const displayOriginalPrice = currentCombination?.originalPrice !== undefined ? currentCombination.originalPrice : product?.originalPrice;
  const displayImages = (currentCombination?.images && currentCombination.images.length > 0) ? currentCombination.images : product?.images;

  if (isLoading) {
    return <ProductDetailScreenSkeleton />;
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
            <FlatList
              data={displayImages && displayImages.length > 0 ? displayImages : [null]} // Fallback for no images
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onImageScroll}
              style={{ width: screenWidth, height: screenWidth }}
              renderItem={({ item }) => (
                <View style={{ width: screenWidth, height: screenWidth }}>
                  <Image
                    source={item ? { uri: item } : require('@/assets/images/icon.png')} // Replace with placeholder if null
                    style={styles.image}
                    contentFit="cover" // 'contain' might be better for full carousel but cover is requested style often
                  />
                </View>
              )}
            />

            {/* Pagination Dots */}
            {displayImages && displayImages.length > 1 && (
              <View style={styles.paginationContainer}>
                {displayImages.map((_: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor: index === activeImageIndex ? Colors.primary : 'rgba(0,0,0,0.2)',
                        width: index === activeImageIndex ? 20 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            <View style={styles.imageActions}>
              <IconButton
                icon={Share2}
                onPress={handleShare}
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
              price={displayPrice}
              originalPrice={displayOriginalPrice}
              discount={product.discount}
              size="lg"
            />

            {/* VARIANTS SECTION */}
            {product.variantOptions && product.variantOptions.length > 0 && (
              <View style={styles.variantsSection}>
                {product.variantOptions.map((option: any, index: number) => (
                  <View key={index} style={styles.variantGroup}>
                    <AppText variant="body" weight="bold" style={styles.variantTitle}>{option.name}</AppText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.variantOptionsList}>
                      {option.values.map((value: string, vIndex: number) => {
                        const isSelected = selectedVariants[option.name] === value;
                        
                        // Find an image for this specific variant value
                        let variantImage = null;
                        if (product.variantCombinations) {
                          const matchingCombo = product.variantCombinations.find((combo: any) => 
                            combo.attributes && combo.attributes[option.name] === value
                          );
                          if (matchingCombo && matchingCombo.images && matchingCombo.images.length > 0) {
                            variantImage = matchingCombo.images[0];
                          }
                        }

                        return (
                          <TouchableOpacity
                            key={vIndex}
                            style={[
                              variantImage ? styles.variantImageOptionBox : styles.variantOptionBox, 
                              isSelected && (variantImage ? styles.variantImageOptionBoxSelected : styles.variantOptionBoxSelected)
                            ]}
                            onPress={() => {
                              setSelectedVariants(prev => ({ ...prev, [option.name]: value }));
                              setActiveImageIndex(0); // Reset image index on variant change
                            }}
                          >
                            {variantImage ? (
                              <View style={styles.variantImageWrapper}>
                                <Image source={{ uri: variantImage }} style={styles.variantThumbnail} contentFit="cover" />
                                {option.name.toLowerCase() !== 'colour' && option.name.toLowerCase() !== 'color' && (
                                   // Optionally hide text if it's purely a color swatch, but let's keep it for clarity
                                   <AppText variant="caption" style={styles.variantImageText} color={isSelected ? Colors.primary : Colors.text}>
                                     {value}
                                   </AppText>
                                )}
                              </View>
                            ) : (
                              <AppText variant="body" color={isSelected ? Colors.white : Colors.text} weight={isSelected ? "bold" : "normal"}>
                                {value}
                              </AppText>
                            )}
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>
                ))}
              </View>
            )}

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
                        hideBrand
                        hideName
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
                  onPress={() => router.push({ pathname: '/product/reviews', params: { id: product.id } } as any)}
                  style={styles.viewAllReviews}
                >
                  <AppText variant="caption" color={Colors.primary} weight="bold">
                    View All
                  </AppText>
                  <ChevronRight size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.ratingOverview}>
                <View style={styles.ratingSummary}>
                  <AppText variant="h1" weight="bold" style={{ fontSize: 48, lineHeight: 56 }}>{product.rating}</AppText>
                  <RatingStars rating={product.rating} size={20} />
                  <AppText variant="body" color={Colors.textSecondary} style={{ marginTop: 4 }}>
                    Based on {product.reviewCount} reviews
                  </AppText>
                </View>

                <View style={styles.reviewsList}>
                  {reviews.length > 0 ? (
                    reviews.slice(0, 3).map((review: any, index: number) => (
                      <View key={review._id || review.id || index} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <View style={styles.reviewerInfo}>
                            {review.userAvatar ? (
                              <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
                            ) : (
                              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <AppText variant="caption" weight="bold" color={Colors.primary}>
                                  {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                </AppText>
                              </View>
                            )}
                            <View>
                              <AppText variant="body" weight="bold" style={{ fontSize: 13 }}>{review.userName || 'Anonymous'}</AppText>
                              <View style={styles.reviewRatingRow}>
                                <AppText variant="caption" color={Colors.textSecondary} style={{ fontSize: 11 }}>
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </AppText>
                              </View>
                            </View>
                          </View>
                          <RatingStars rating={review.rating} size={14} />
                        </View>
                        {review.title && (
                          <AppText variant="body" weight="bold" style={{ marginTop: 8, fontSize: 13 }}>
                            {review.title}
                          </AppText>
                        )}
                        <AppText variant="body" color={Colors.textSecondary} style={{ marginTop: 4, lineHeight: 20 }}>
                          {review.comment}
                        </AppText>
                      </View>
                    ))
                  ) : (
                    <View style={styles.noReviewsContainer}>
                      <AppText variant="body" color={Colors.textLight} style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        No reviews yet. Be the first to review this product!
                      </AppText>
                    </View>
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
                addToCart({...product, price: displayPrice, originalPrice: displayOriginalPrice, images: displayImages }, 1, selectedVariants);
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
                  product: {...product, price: displayPrice, originalPrice: displayOriginalPrice, images: displayImages },
                  quantity: 1,
                  selectedVariants: selectedVariants,
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
    gap: Spacing.lg,
  },
  variantsSection: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  variantGroup: {
    gap: Spacing.sm,
  },
  variantTitle: {
    marginBottom: 2,
  },
  variantOptionsList: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  variantOptionBox: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  variantOptionBoxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  variantImageOptionBox: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Lighter border for images
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  variantImageOptionBoxSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    padding: 3, // slightly less padding because border is thicker
    backgroundColor: '#F8F4FF',
  },
  variantImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  variantImageText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
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
    width: 180,
    marginRight: Spacing.md,
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
  ratingSummary: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  reviewsList: {
    gap: Spacing.md,
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: Spacing.md,
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerInfo: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  reviewRatingRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  noReviewsContainer: {
    padding: Spacing.lg,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
});
