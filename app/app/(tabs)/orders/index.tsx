import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Search, X, Package, RotateCcw, ChevronRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import OrderListItem from '@/components/organisms/OrderListItem';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { apiService } from '@/services/api';
import { Order } from '@/types';

type OrderTab = 'all' | 'active' | 'delivered' | 'cancelled' | 'returns';

export default function OrdersScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<OrderTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const fetchOrders = async () => {
        try {
            if (!refreshing) setLoading(true);
            const response = await apiService.getOrders();
            if (response.success) {
                setOrders(response.data);
                setError(null);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        // Search filter
        const matchesSearch = searchQuery === '' ||
            (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.items && order.items.some(item =>
                item.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        if (!matchesSearch) return false;

        // Tab filter
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return ['pending', 'processing', 'shipped'].includes(order.status);
        if (activeTab === 'delivered') return order.status === 'delivered' && (!order.returnStatus || order.returnStatus === 'None');
        if (activeTab === 'cancelled') return order.status === 'cancelled';
        if (activeTab === 'returns') return order.returnStatus && order.returnStatus !== 'None';

        return true;
    });

    const tabs: { key: OrderTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'returns', label: 'Returns' },
        { key: 'cancelled', label: 'Cancelled' },
    ];

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ title: 'My Orders', headerShown: false }} />

            {/* Header with Search */}
            <View style={styles.header}>
                {!showSearch ? (
                    <View style={styles.headerContent}>
                        <AppText variant="h3" weight="bold">My Orders</AppText>
                        <TouchableOpacity onPress={() => setShowSearch(true)} style={styles.iconButton}>
                            <Search size={22} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.searchBarContainer}>
                        <Search size={18} color={Colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by ID or product name"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        <TouchableOpacity onPress={() => {
                            setShowSearch(false);
                            setSearchQuery('');
                        }}>
                            <X size={20} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Returns Action Section at Top (as requested) */}
            <View style={styles.returnSection}>
                <TouchableOpacity
                    style={styles.returnCard}
                    onPress={() => setActiveTab('returns')}
                    activeOpacity={0.7}
                >
                    <View style={styles.returnIconContainer}>
                        <RotateCcw size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.returnTextContainer}>
                        <AppText weight="bold" style={styles.returnTitle}>Returns & Refunds</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Check status of your return requests</AppText>
                    </View>
                    <ChevronRight size={20} color={Colors.textLight} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <AppText
                                variant="body"
                                weight={activeTab === tab.key ? 'bold' : 'medium'}
                                color={activeTab === tab.key ? Colors.primary : Colors.textSecondary}
                                style={styles.tabText}
                            >
                                {tab.label}
                            </AppText>
                            {activeTab === tab.key && <View style={styles.activeTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredOrders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Package size={64} color={Colors.border} />
                        <AppText variant="h4" color={Colors.textSecondary} style={{ marginTop: 16 }}>
                            {activeTab === 'returns' ? 'No returns found' : 'No orders found'}
                        </AppText>
                        <AppText variant="body" color={Colors.textLight} style={{ textAlign: 'center', marginTop: 8 }}>
                            {searchQuery
                                ? `No matches for "${searchQuery}" in this category.`
                                : `You don't have any ${activeTab !== 'all' ? activeTab : ''} orders yet.`}
                        </AppText>
                    </View>
                ) : (
                    <View style={styles.ordersList}>
                        {filteredOrders.map((order) => (
                            <OrderListItem
                                key={order.id}
                                order={order}
                                onPress={() => router.push(`/order/${order.id}` as any)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundGray,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.white,
        paddingTop: 50,
        paddingBottom: Spacing.sm,
        paddingHorizontal: Spacing.base,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
    },
    iconButton: {
        padding: 4,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.borderLight,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
        height: '100%',
        padding: 0,
    },
    returnSection: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.white,
    },
    returnCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.borderLight,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    returnIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(123, 47, 191, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    returnTextContainer: {
        flex: 1,
    },
    returnTitle: {
        fontSize: 15,
        color: Colors.text,
    },
    tabsWrapper: {
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tabsScroll: {
        paddingHorizontal: Spacing.sm,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        position: 'relative',
        minWidth: 80,
    },
    activeTab: {
        // active styling
    },
    tabText: {
        fontSize: 14,
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: 3,
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
        flexGrow: 1,
    },
    ordersList: {
        marginTop: Spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 60,
    },
});
