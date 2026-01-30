import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Skeleton from '../Skeleton';
import ProductListItemSkeleton from '../molecules/ProductListItemSkeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductListScreenSkeleton = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <Skeleton width={24} height={24} borderRadius={12} />
                <View style={styles.searchBarSubstitute}>
                    <Skeleton width={18} height={18} borderRadius={9} style={{ marginRight: 8 }} />
                    <Skeleton width="60%" height={14} />
                </View>
                <Skeleton width={24} height={24} borderRadius={12} />
            </View>

            {/* Filter Bar Skeleton */}
            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.filterChip}>
                            <Skeleton width={60} height={14} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.results}>
                {/* Brand Header Skeleton */}
                <View style={styles.brandHeader}>
                    <View style={{ flex: 1 }}>
                        <Skeleton width={120} height={24} style={{ marginBottom: 4 }} />
                        <Skeleton width={180} height={12} />
                    </View>
                </View>

                {/* Product List Skeletons */}
                 {[1, 2, 3, 4, 5].map((i) => (
                    <ProductListItemSkeleton key={i} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        gap: Spacing.sm,
    },
    searchBarSubstitute: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundGray,
        paddingHorizontal: Spacing.md,
        height: 40,
        borderRadius: 8,
    },
    filterBar: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        backgroundColor: Colors.white,
    },
    filterContent: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        justifyContent: 'center',
    },
    results: {
        flexGrow: 1,
    },
    brandHeader: {
        padding: Spacing.base,
        paddingBottom: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
});

export default ProductListScreenSkeleton;
