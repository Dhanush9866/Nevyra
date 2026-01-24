import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { Address } from '@/types';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelect: (address: Address) => void;
  onEdit: (address: Address, index: number) => void;
  onDelete: (index: number) => void;
  onAddNew: () => void;
  onContinue?: () => void;
  continueButtonText?: string;
  showContinueButton?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddress,
  onSelect,
  onEdit,
  onDelete,
  onAddNew,
  onContinue,
  continueButtonText = 'Continue',
  showContinueButton = true,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppText color={Colors.textSecondary}>No addresses found.</AppText>
          </View>
        ) : (
          addresses.map((address, index) => {
            const getAddressId = (addr: any) => addr?.id || addr?._id;
            const selectedId = getAddressId(selectedAddress);
            const currentId = getAddressId(address);
            
            let isSelected = false;
            if (selectedAddress) {
              if (selectedId && currentId) {
                isSelected = selectedId === currentId;
              } else {
                // Fallback to comparing content if IDs are missing
                isSelected = selectedAddress.addressLine1 === address.addressLine1 && 
                             selectedAddress.zipCode === address.zipCode &&
                             selectedAddress.firstName === address.firstName;
              }
            }
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.addressCard,
                  isSelected ? styles.selectedCard : null
                ]}
                activeOpacity={0.7}
                onPress={() => onSelect(address)}
              >
                <View style={styles.selectionIndicator}>
                  <View style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonActive
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>

                <View style={styles.addressInfo}>
                  <View style={styles.addressHeader}>
                    <AppText variant="body" weight="bold" style={{ fontSize: 16 }}>
                      {address.firstName} {address.lastName}
                    </AppText>
                    <View style={styles.addressHeaderActions}>
                      <TouchableOpacity
                        onPress={() => onEdit(address, index)}
                        style={styles.actionButton}
                      >
                        <Edit2 size={18} color={Colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => onDelete(index)}
                        style={styles.actionButton}
                      >
                        <Trash2 size={18} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <AppText variant="body" color={Colors.textSecondary} style={styles.addressLine}>
                    {address.addressLine1}
                  </AppText>
                  <AppText variant="body" color={Colors.textSecondary} style={styles.addressLine}>
                    {address.city}, {address.state} - {address.zipCode}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={styles.phoneText}>
                    Phone: {address.phone}
                  </AppText>

                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <AppText style={styles.defaultBadgeText}>DEFAULT</AppText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add New Address"
          onPress={onAddNew}
          variant="outline"
          fullWidth
          style={styles.footerButton}
        />
        {showContinueButton && (
          <Button
            title={continueButtonText}
            onPress={onContinue || (() => {})}
            fullWidth
            disabled={!selectedAddress}
            style={styles.footerButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: 20,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.base,
    flexDirection: 'row',
    ...Colors.shadow.sm,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: '#F8F4FF',
  },
  selectionIndicator: {
    marginRight: Spacing.md,
    justifyContent: 'center',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#BDC3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  addressHeaderActions: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  addressLine: {
    lineHeight: 20,
  },
  phoneText: {
    marginTop: Spacing.xs,
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  footerButton: {
    height: 52,
    borderRadius: 8,
  },
});

export default AddressSelector;
