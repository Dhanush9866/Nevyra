import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { mockAddresses } from '@/services/mockData';

export default function AddressListScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Select Address' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {mockAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={styles.addressCard}
              activeOpacity={0.8}
            >
              <View style={styles.addressHeader}>
                <AppText variant="body" weight="semibold">
                  {address.name}
                </AppText>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <AppText variant="small" color={Colors.white}>
                      DEFAULT
                    </AppText>
                  </View>
                )}
              </View>
              <AppText variant="body" color={Colors.textSecondary}>
                {address.addressLine1}
              </AppText>
              {address.addressLine2 && (
                <AppText variant="body" color={Colors.textSecondary}>
                  {address.addressLine2}
                </AppText>
              )}
              <AppText variant="body" color={Colors.textSecondary}>
                {address.city}, {address.state} - {address.pincode}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                Phone: {address.phone}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Add New Address"
            onPress={() => router.push('/checkout/address-form' as any)}
            variant="outline"
            fullWidth
          />
          <Button
            title="Continue"
            onPress={() => router.push('/checkout/payment' as any)}
            fullWidth
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  addressCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    gap: Spacing.xs,
    ...Colors.shadow.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
});
