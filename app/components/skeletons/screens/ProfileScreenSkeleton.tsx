import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const ProfileScreenSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Skeleton width={200} height={30} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.profileContent}>
                        <View style={styles.profileDataRow}>
                            <Skeleton width={64} height={64} borderRadius={32} />
                            <View style={styles.userDetails}>
                                <Skeleton width="70%" height={24} style={{ marginBottom: 6 }} />
                                <Skeleton width="50%" height={16} />
                            </View>
                        </View>
                        <Skeleton width={60} height={28} borderRadius={16} style={{ marginTop: 8 }} />
                    </View>

                    <View style={styles.deliveryInfoContainer}>
                         <Skeleton width="100%" height={40} borderRadius={8} />
                    </View>
                </View>

                <View style={styles.gridContainer}>
                    <Skeleton width="46%" height={50} style={{ margin: '2%' }} />
                    <Skeleton width="46%" height={50} style={{ margin: '2%' }} />
                </View>

                <View style={styles.section}>
                    <Skeleton width={150} height={20} style={{ marginHorizontal: Spacing.base, marginBottom: Spacing.md }} />
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Skeleton width={20} height={20} borderRadius={4} />
                                <Skeleton width={150} height={16} style={{ marginLeft: 16 }} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    header: {
        paddingTop: 50,
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.base,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    profileSection: {
        backgroundColor: Colors.white,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    profileContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.md,
    },
    profileDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flex: 1,
    },
    userDetails: {
        flex: 1,
        gap: 4
    },
    deliveryInfoContainer: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: Spacing.sm,
        backgroundColor: Colors.white,
        marginTop: 8,
    },
    section: {
        backgroundColor: Colors.white,
        paddingTop: Spacing.md,
        marginTop: 8,
    },
    menuItem: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProfileScreenSkeleton;
