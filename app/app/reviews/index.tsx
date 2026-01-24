import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';
import { apiService } from '@/services/api';

const THEME_PURPLE = Colors.primary;
const THEME_YELLOW = '#FFC200';

export default function ReviewsScreen() {
    const router = useRouter();
    const { totalItems } = useCart();
    const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
    const [pendingReviews, setPendingReviews] = useState<any[]>([]);
    const [publishedReviews, setPublishedReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const [pendingRes, publishedRes] = await Promise.all([
                apiService.getPendingReviews(),
                apiService.getUserReviews()
            ]);

            if (pendingRes.success) {
                setPendingReviews(pendingRes.data);
            }
            if (publishedRes.success) {
                setPublishedReviews(publishedRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={THEME_PURPLE} barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/profile')}
                        style={styles.iconButton}
                    >
                        <ArrowLeft color={Colors.white} size={24} />
                    </TouchableOpacity>
                    <AppText variant="h3" weight="bold" color={Colors.white} style={styles.headerTitle}>
                        My Reviews
                    </AppText>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push('/cart')}
                    >
                        <View>
                            <ShoppingCart color={Colors.white} size={22} />
                            {totalItems > 0 && (
                                <View style={styles.cartBadge}>
                                    <AppText variant="caption" color={Colors.white} style={styles.cartBadgeText}>
                                        {totalItems}
                                    </AppText>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('pending')}
                >
                    <AppText
                        variant="body"
                        weight="medium"
                        color={Colors.white}
                        style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}
                    >
                        Pending
                    </AppText>
                    {activeTab === 'pending' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('published')}
                >
                    <AppText
                        variant="body"
                        weight="medium"
                        color={Colors.white}
                        style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}
                    >
                        Published
                    </AppText>
                    {activeTab === 'published' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'pending' ? (
                    <View style={styles.pendingSection}>
                        {pendingReviews.length > 0 ? (
                            <>
                                <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
                                    Care to review few more purchases?
                                </AppText>

                                {pendingReviews.map((item) => (
                                    <View key={item.id} style={styles.reviewCard}>
                                        <View style={styles.cardTop}>
                                            <Image source={{ uri: item.images?.[0] }} style={styles.productImage} />
                                            <View style={styles.productInfo}>
                                                <AppText variant="caption" color={Colors.textSecondary} style={styles.rateProductLabel}>
                                                    Rate Product
                                                </AppText>
                                                <AppText variant="body" weight="medium" numberOfLines={2} style={styles.productName}>
                                                    {item.name}
                                                </AppText>
                                            </View>
                                        </View>
                                        <View style={styles.starContainer}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <TouchableOpacity
                                                    key={star}
                                                    onPress={() => router.push({
                                                        pathname: '/product/reviews',
                                                        params: { productId: item.id, action: 'create' }
                                                    })}
                                                >
                                                    <Star size={40} color={Colors.textLight} strokeWidth={0.8} />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <AppText variant="body" color={Colors.textSecondary}>
                                    No pending reviews
                                </AppText>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.publishedSection}>
                        {publishedReviews.length > 0 ? (
                            publishedReviews.map((review) => (
                                <View key={review._id} style={styles.reviewCard}>
                                    <View style={styles.cardTop}>
                                        <Image source={{ uri: review.product?.images?.[0] }} style={styles.productImage} />
                                        <View style={styles.productInfo}>
                                            <AppText variant="body" weight="medium" numberOfLines={2} style={styles.productName}>
                                                {review.product?.name}
                                            </AppText>
                                            <View style={styles.publishedStarContainer}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        fill={star <= review.rating ? THEME_YELLOW : 'transparent'}
                                                        color={star <= review.rating ? THEME_YELLOW : Colors.textLight}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    <AppText variant="body" weight="bold" style={styles.reviewTitle}>
                                        {review.title}
                                    </AppText>
                                    <AppText variant="body" color={Colors.text} style={styles.reviewComment}>
                                        {review.comment}
                                    </AppText>
                                    <AppText variant="caption" color={Colors.textSecondary} style={styles.reviewDate}>
                                        Published on {new Date(review.createdAt).toLocaleDateString()}
                                    </AppText>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <AppText variant="body" color={Colors.textSecondary}>
                                    No published reviews yet
                                </AppText>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    header: {
        backgroundColor: THEME_PURPLE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.sm,
        paddingTop: 50, // Fixed padding for status bar area
        paddingBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerTitle: {
        marginLeft: Spacing.md,
        fontSize: 20,
    },
    iconButton: {
        padding: Spacing.sm,
    },
    cartBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#E40046',
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: THEME_PURPLE,
    },
    cartBadgeText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    tabContainer: {
        backgroundColor: THEME_PURPLE,
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        position: 'relative',
    },
    tabText: {
        fontSize: 15,
        opacity: 0.9,
    },
    activeTabText: {
        opacity: 1,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: THEME_YELLOW,
    },
    content: {
        flex: 1,
    },
    pendingSection: {
        paddingTop: 30,
    },
    publishedSection: {
        paddingTop: 10,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: '#212121',
    },
    reviewCard: {
        backgroundColor: Colors.white,
        marginHorizontal: Spacing.sm,
        padding: Spacing.lg,
        borderRadius: 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 10,
    },
    cardTop: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    productInfo: {
        flex: 1,
        marginLeft: Spacing.lg,
    },
    rateProductLabel: {
        fontSize: 11,
        marginBottom: 6,
        color: '#878787',
    },
    productName: {
        fontSize: 14,
        lineHeight: 20,
        color: '#212121',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginTop: 10,
        paddingBottom: 10,
    },
    publishedStarContainer: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 5,
    },
    reviewTitle: {
        fontSize: 15,
        marginBottom: 5,
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    reviewDate: {
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
});
