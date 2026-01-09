import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Order } from '@/types';

interface OrderListItemProps {
    order: Order;
    onPress: () => void;
}

export default function OrderListItem({ order, onPress }: OrderListItemProps) {
    const firstItem = order.items[0];
    const isDelivered = order.status === 'delivered';
    const isCancelled = order.status === 'cancelled';

    const getStatusText = () => {
        const date = new Date(order.deliveryDate || order.createdAt);
        const dateStr = date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        if (isDelivered) return `Delivered on ${dateStr}`;
        if (isCancelled) return `Cancelled on ${dateStr}`;
        return `Status: ${order.status}`;
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: firstItem.product.images[0] }}
                    style={styles.image}
                    contentFit="contain"
                    transition={300}
                />
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <AppText variant="body" weight="medium" style={styles.statusText}>
                        {getStatusText()}
                    </AppText>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
                </View>

                <AppText variant="caption" color={Colors.textSecondary} numberOfLines={1} style={styles.productName}>
                    {firstItem.product.name}
                </AppText>

                {(isDelivered || order.status === 'pending') && (
                    <View style={styles.ratingContainer}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Ionicons key={s} name="star-outline" size={20} color="#D1D5DB" style={styles.star} />
                            ))}
                        </View>
                        <AppText variant="small" color={Colors.textSecondary} weight="medium">
                            Rate this product now
                        </AppText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: Spacing.base,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    imageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
        paddingTop: Spacing.xs,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    statusText: {
        fontSize: 14,
    },
    productName: {
        marginBottom: Spacing.sm,
    },
    ratingContainer: {
        gap: Spacing.xs,
    },
    stars: {
        flexDirection: 'row',
    },
    star: {
        marginRight: 4,
    },
});
