import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import AppText from '../atoms/AppText';
import Spacing from '@/constants/spacing';
import Colors from '@/constants/colors';

export default function OrderPromoBanner() {
    return (
        <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
                colors={['#00215E', '#004275', '#004275']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.banner}
            >
                <View style={styles.content}>
                    <AppText color={Colors.warning} weight="bold" variant="body">
                        Card that pays you back
                    </AppText>
                    <AppText color={Colors.white} weight="medium" variant="small" style={styles.subText}>
                        Joining fee waived off*{'\n'}& 5% cashback on all orders
                    </AppText>

                    <TouchableOpacity style={styles.button}>
                        <AppText weight="bold" style={styles.buttonText}>
                            Apply & save {'>'}
                        </AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method-credit-card_9a164b.png"
                        style={styles.cardImage}
                        contentFit="contain"
                    />
                </View>

                <AppText color={Colors.white} variant="small" style={styles.termsText}>
                    *T&C Apply
                </AppText>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    banner: {
        borderRadius: 8,
        padding: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 130,
        marginHorizontal: Spacing.base,
        marginVertical: Spacing.md,
        overflow: 'hidden',
        position: 'relative',
    },
    content: {
        flex: 1.2,
        justifyContent: 'center',
        gap: Spacing.xs,
        zIndex: 2,
    },
    subText: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: Spacing.sm,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 12,
        color: '#00215E',
    },
    imageContainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    cardImage: {
        width: 130,
        height: 90,
        transform: [{ rotate: '10deg' }],
    },
    termsText: {
        position: 'absolute',
        bottom: 6,
        right: 12,
        fontSize: 9,
        opacity: 0.6,
    },
});
