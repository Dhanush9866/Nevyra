import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Product } from '@/types';
import { ChevronRight } from 'lucide-react-native';

interface VerticalProductSectionProps {
    title: string;
    items: Partial<Product>[];
    backgroundColor?: string;
    buttonColor?: string;
    onPress: (id: string) => void;
}

export default function VerticalProductSection({
    title,
    items,
    backgroundColor = '#FFD8B0',
    buttonColor,
    onPress
}: VerticalProductSectionProps) {
    const activeBtnColor = buttonColor || backgroundColor;

    // Take only first 4 items for 2x2 grid
    const displayItems = items.slice(0, 4);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <AppText variant="h3" weight="bold" style={styles.title}>{title}</AppText>
                <TouchableOpacity style={styles.viewAllButton}>
                    <ChevronRight size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* White background container */}
            <View style={styles.whiteContainer}>
                <View style={styles.gridContainer}>
                    {displayItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.gridItem}
                            activeOpacity={0.9}
                            onPress={() => item.id && onPress(item.id)}
                        >
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.images?.[0] || (item as any).image || '' }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                {!!(item.rating && item.rating >= 4) && (
                                    <View style={styles.ratingBadge}>
                                        <AppText variant="caption" weight="bold" color={Colors.white} style={{ fontSize: 10 }}>
                                            {item.rating.toFixed(1)}
                                        </AppText>
                                        <Star size={10} color={Colors.white} fill={Colors.white} />
                                    </View>
                                )}
                            </View>

                            <View style={styles.infoContainer}>
                                <AppText
                                    variant="caption"
                                    style={styles.label}
                                    numberOfLines={1}
                                >
                                    {index === 0 ? 'Best Discounts' :
                                        index === 1 ? 'Best Brands' :
                                            index === 2 ? 'Top Rated' :
                                                'Affordable Options'}
                                </AppText>
                                <AppText
                                    variant="body"
                                    weight="bold"
                                    style={styles.subtitle}
                                    numberOfLines={2}
                                >
                                    {index === 0 ? 'Min. 50% Off' :
                                        index === 1 ? 'Best Brands' :
                                            index === 2 ? 'Top Rated' :
                                                'Affordable Options'}
                                </AppText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: 16,
        marginHorizontal: Spacing.sm,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: Spacing.xs,
        marginBottom: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    viewAllButton: {
        padding: 4,
    },
    whiteContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: Spacing.sm,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    gridItem: {
        width: '48%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: Spacing.sm,
        gap: 4,
    },
    label: {
        fontSize: 11,
        color: '#666',
        fontWeight: '400',
    },
    subtitle: {
        fontSize: 13,
        color: '#000',
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.success,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
        zIndex: 10,
    },
});
