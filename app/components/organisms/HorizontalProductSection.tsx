import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Product } from '@/types';

interface HorizontalProductCardProps {
    title: string;
    items: Partial<Product>[];
    backgroundColor?: string;
    buttonColor?: string; // New prop for the darker button color
    onPress: (id: string) => void;
}

export default function HorizontalProductSection({
    title,
    items,
    backgroundColor = '#FFD8B0',
    buttonColor,
    onPress
}: HorizontalProductCardProps) {
    // Fallback if buttonColor is not provided (though we should provide it)
    const activeBtnColor = buttonColor || backgroundColor;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <AppText variant="h3" weight="bold" style={styles.title}>{title}</AppText>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.itemWrapper}
                        activeOpacity={0.9}
                        onPress={() => item.id && onPress(item.id)}
                    >
                        <View style={styles.visualCard}>
                            <Image
                                source={{ uri: item.images?.[0] || (item as any).image || '' }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={[styles.priceTag, { backgroundColor: activeBtnColor }]}>
                                <AppText variant="body" weight="bold" color={Colors.white} style={styles.priceText}>
                                    From ₹{item.price}
                                </AppText>
                            </View>
                            {(item.rating && item.rating >= 4) && (
                                <View style={styles.ratingBadge}>
                                    <AppText variant="caption" weight="bold" color={Colors.white} style={{ fontSize: 10 }}>
                                        {item.rating.toFixed(1)}
                                    </AppText>
                                    <Star size={10} color={Colors.white} fill={Colors.white} />
                                </View>
                            )}
                        </View>

                        <AppText
                            variant="caption"
                            style={styles.productName}
                            numberOfLines={2}
                        >
                            {item.name}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.md,
        borderRadius: 16,
        marginHorizontal: Spacing.sm,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
    },
    itemWrapper: {
        width: 140,
        alignItems: 'center',
        gap: 8,
    },
    visualCard: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    priceTag: {
        width: '100%',
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceText: {
        fontSize: 12,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    productName: {
        color: '#222',
        fontSize: 12, // Reduced size
        textAlign: 'center',
        fontWeight: '500', // Reduced weight
        lineHeight: 16,
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.success,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
});
