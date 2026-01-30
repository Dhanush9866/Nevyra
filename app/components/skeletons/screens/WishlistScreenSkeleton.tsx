import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../Skeleton';
import ProductGridSkeleton from '../organisms/ProductGridSkeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WishlistScreenSkeleton = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Skeleton width={120} height={20} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.listsContainer}>
                    <View style={styles.listCard}>
                         <Skeleton width="100%" height={80} borderRadius={8} style={{ marginBottom: 8 }} />
                         <Skeleton width="60%" height={12} />
                    </View>
                </View>

                <View style={styles.filterContainer}>
                     <Skeleton width={60} height={30} borderRadius={20} style={{ marginRight: 8 }} />
                     <Skeleton width={60} height={30} borderRadius={20} />
                </View>

                <ProductGridSkeleton />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
    },
    listsContainer: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.md,
    },
    listCard: {
        width: 120,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.md,
    }
});

export default WishlistScreenSkeleton;
