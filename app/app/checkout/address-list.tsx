import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Edit2, Trash2, Plus } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';
import { Address } from '@/types';

export default function AddressListScreen() {
  const router = useRouter();
  const { addresses, deleteAddress } = useAuth();
  const insets = useSafeAreaInsets();

  const handleDelete = (index: number) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAddress(index);
            if (!result.success) {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (address: Address, index: number) => {
    router.push({
      pathname: '/checkout/address-form',
      params: {
        editMode: 'true',
        index: index.toString(),
        addressData: JSON.stringify(address)
      }
    } as any);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Select Address' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppText color={Colors.textSecondary}>No addresses found.</AppText>
            </View>
          ) : (
            addresses.map((address, index) => (
              <View key={index} style={styles.addressCard}>
                <TouchableOpacity
                  style={styles.addressInfo}
                  activeOpacity={0.7}
                  onPress={() => {/* Select address logic */ }}
                >
                  <View style={styles.addressHeader}>
                    <AppText variant="body" weight="semibold">
                      {address.firstName} {address.lastName}
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
                    {address.city}, {address.state} - {address.zipCode}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    Phone: {address.phone}
                  </AppText>
                </TouchableOpacity>

                <View style={styles.addressActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(address, index)}
                    style={styles.actionButton}
                  >
                    <Edit2 size={18} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(index)}
                    style={styles.actionButton}
                  >
                    <Trash2 size={18} color={Colors.error || '#FF4444'} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Spacing.base + insets.bottom }]}>
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
            disabled={addresses.length === 0}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Colors.shadow.sm,
  },
  addressInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  addressActions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: Spacing.md,
    paddingLeft: Spacing.base,
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderLight,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    padding: Spacing['3xl'],
    alignItems: 'center',
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
