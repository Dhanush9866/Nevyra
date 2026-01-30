import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../Skeleton';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const AddressListSkeleton = () => {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.addressCard}>
                        <View style={styles.radio} />
                        <View style={styles.details}>
                            <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
                            <Skeleton width="90%" height={14} style={{ marginBottom: 4 }} />
                            <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
                            <Skeleton width={100} height={14} />
                        </View>
                        <Skeleton width={40} height={20} borderRadius={12} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <Skeleton width="100%" height={48} borderRadius={8} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    content: {
        padding: Spacing.base,
        gap: Spacing.md,
    },
    addressCard: {
        backgroundColor: Colors.white,
        padding: Spacing.base,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginRight: Spacing.md,
        marginTop: 2,
    },
    details: {
        flex: 1,
    },
    footer: {
        padding: Spacing.base,
        backgroundColor: Colors.white,
    }
});

export default AddressListSkeleton;
