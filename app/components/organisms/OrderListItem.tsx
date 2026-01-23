import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Order } from '@/types';

interface OrderListItemProps {
    order: Order;
    onPress: () => void;
}

export default function OrderListItem({ order, onPress }: OrderListItemProps) {
    const firstItem = order.items?.[0];
    const isDelivered = order.status === 'delivered';
    const isCancelled = order.status === 'cancelled';
    const isProcessing = order.status === 'pending' || order.status === 'processing';
    const isShipped = order.status === 'shipped';

    const getStatusBadge = () => {
        if (order.returnStatus && order.returnStatus !== 'None') {
            const getColor = () => {
                switch (order.returnStatus) {
                    case 'Pending': return { color: '#F59E0B', bgColor: '#FEF3C7' };
                    case 'Approved': return { color: '#3B82F6', bgColor: '#DBEAFE' };
                    case 'Success': return { color: '#10B981', bgColor: '#D1FAE5' };
                    case 'Rejected': return { color: '#EF4444', bgColor: '#FEE2E2' };
                    default: return { color: '#757575', bgColor: '#F5F5F5' };
                }
            };
            const theme = getColor();
            return { text: `Return ${order.returnStatus}`, ...theme };
        }
        if (isProcessing) {
            return { text: 'Processing', color: '#FFA500', bgColor: '#FFF3E0' };
        }
        if (isShipped) {
            return { text: 'Shipped', color: '#2196F3', bgColor: '#E3F2FD' };
        }
        if (isDelivered) {
            return { text: 'Delivered', color: '#4CAF50', bgColor: '#E8F5E9' };
        }
        if (isCancelled) {
            return { text: 'Cancelled', color: '#F44336', bgColor: '#FFEBEE' };
        }
        return { text: order.status.charAt(0).toUpperCase() + order.status.slice(1), color: '#757575', bgColor: '#F5F5F5' };
    };

    const statusBadge = getStatusBadge();

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: firstItem?.product?.images?.[0] || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                    contentFit="contain"
                    transition={300}
                />
            </View>

            <View style={styles.detailsContainer}>
                <AppText variant="body" weight="bold" style={styles.productName} numberOfLines={1}>
                    {(firstItem?.product?.name || 'Multiple Items')} {order.items?.length > 1 ? `(+${order.items.length - 1} more)` : ''}
                </AppText>

                <AppText variant="caption" color={Colors.textSecondary} style={styles.orderId}>
                    Order ID: {order.orderNumber}
                </AppText>

                <AppText variant="caption" color={Colors.textSecondary} style={styles.orderDate}>
                    Placed on {formatDate(order.createdAt)}
                </AppText>

                <View style={styles.footer}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
                        <AppText variant="small" weight="bold" style={{ color: statusBadge.color }}>
                            {statusBadge.text}
                        </AppText>
                    </View>
                    <TouchableOpacity onPress={onPress}>
                        <AppText variant="small" weight="medium" color={Colors.primary}>
                            View Details →
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: Spacing.base,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        marginHorizontal: Spacing.base,
        marginVertical: Spacing.xs,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: Colors.white,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 12,
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
});
