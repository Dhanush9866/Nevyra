import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchScreenSkeleton = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Skeleton width={30} height={30} borderRadius={15} style={{ marginRight: 8 }} />
                <Skeleton width="75%" height={40} borderRadius={8} />
                <Skeleton width={30} height={30} borderRadius={15} style={{ marginLeft: 8 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Recent Searches */}
                <View style={styles.section}>
                    <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
                    <View style={styles.recentList}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={styles.recentItem}>
                                <Skeleton width="60%" height={16} />
                                <Skeleton width={16} height={16} />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Popular Searches */}
                <View style={styles.section}>
                    <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
                    <View style={styles.tagCloud}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} width={80 + Math.random() * 40} height={32} borderRadius={20} />
                        ))}
                    </View>
                </View>

                {/* Browse Categories */}
                <View style={styles.section}>
                    <Skeleton width={180} height={20} style={{ marginBottom: 16 }} />
                    <View style={styles.categoryGrid}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <View key={i} style={styles.categoryCard}>
                                <Skeleton width="100%" height={80} borderRadius={12} style={{ marginBottom: 8 }} />
                                <Skeleton width="80%" height={10} style={{ alignSelf: 'center' }} />
                            </View>
                        ))}
                    </View>
                </View>
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
        paddingTop: 10,
    },
    scrollContent: {
        paddingBottom: Spacing['5xl'],
    },
    section: {
        paddingTop: Spacing.xl,
        paddingHorizontal: Spacing.base,
    },
    recentList: {
        gap: Spacing.xs,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.backgroundGray,
    },
    tagCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -Spacing.xs,
    },
    categoryCard: {
        width: '25%',
        padding: Spacing.xs,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
});

export default SearchScreenSkeleton;
