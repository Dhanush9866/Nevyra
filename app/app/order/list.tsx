import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppText from '@/components/atoms/AppText';
import OrderListItem from '@/components/organisms/OrderListItem';
import OrderPromoBanner from '@/components/molecules/OrderPromoBanner';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockOrders } from '@/services/mockData';

export default function OrderListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <View style={styles.mainContainer}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h4" weight="bold">
          My Orders
        </AppText>
      </View>

      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <OrderPromoBanner />

        {/* Search and Filters Row */}
        <View style={styles.searchRowContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={Colors.textLight} />
              <TextInput
                placeholder="Search your order here"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={20} color={Colors.text} />
              <AppText weight="medium">Filters</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ordersList}>
          {mockOrders.map((order) => (
            <OrderListItem
              key={order.id}
              order={order}
              onPress={() => router.push(`/order/${order.id}` as any)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50, // For status bar overlap
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  searchRowContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingHorizontal: Spacing.sm,
    height: 40,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ordersList: {
    // No gap here as items have dividers
  },
});
