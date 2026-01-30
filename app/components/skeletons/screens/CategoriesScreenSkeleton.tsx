import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoriesScreenSkeleton = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
                <View style={styles.searchContainer}>
                    <Skeleton width="100%" height={44} borderRadius={8} />
                </View>
            </View>

            <View style={styles.content}>
                {/* Sidebar Skeleton */}
                <View style={styles.sidebar}>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <View key={i} style={styles.sidebarItem}>
                            <Skeleton width={32} height={32} borderRadius={0} style={{ marginBottom: 6 }} />
                            <Skeleton width={50} height={10} />
                        </View>
                    ))}
                </View>

                {/* Main Content Skeleton */}
                <View style={styles.mainContent}>
                    <View style={styles.mainHeader}>
                        <Skeleton width={150} height={24} />
                    </View>

                    <View style={styles.grid}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <View key={i} style={styles.gridItem}>
                                <Skeleton width="100%" height={80} style={{ marginBottom: 8 }} />
                                <Skeleton width="80%" height={12} style={{ alignSelf: 'center' }} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        backgroundColor: Colors.primary,
        ...Colors.shadow.md,
        zIndex: 100,
    },
    searchContainer: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
        paddingTop: Spacing.xs,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
    },
    sidebar: {
        width: 90,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#eee',
        paddingVertical: 10,
    },
    sidebarItem: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    mainHeader: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '33.33%',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
});

export default CategoriesScreenSkeleton;
