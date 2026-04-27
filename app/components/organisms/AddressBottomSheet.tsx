import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import AddressSelector from './AddressSelector';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';
import { useCheckout } from '@/store/CheckoutContext';
import { Address } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddressBottomSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const { addresses, deleteAddress } = useAuth();
  const { selectedAddress, setSelectedAddress } = useCheckout();

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
    onClose();
    router.push({
      pathname: '/checkout/address-form',
      params: {
        editMode: 'true',
        index: index.toString(),
        addressData: JSON.stringify(address)
      }
    } as any);
  };

  const handleAddNew = () => {
    onClose();
    router.push('/checkout/address-form' as any);
  };

  const handleContinue = () => {
    onClose(); // Just close it to reflect the selected address
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <AppText variant="h3" weight="bold">Select Delivery Address</AppText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <AddressSelector
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelect={(addr) => setSelectedAddress(addr)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
              onContinue={handleContinue}
              continueButtonText="Confirm Address"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#F1F3F6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
});
