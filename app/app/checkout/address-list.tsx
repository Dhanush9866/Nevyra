import { View, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import AppText from '@/components/atoms/AppText';
import { useAuth } from '@/store/AuthContext';
import { useCheckout } from '@/store/CheckoutContext';
import { Address } from '@/types';
import AddressSelector from '@/components/organisms/AddressSelector';

export default function AddressListScreen() {
  const router = useRouter();
  const { source } = useLocalSearchParams<{ source: string }>();
  const { addresses, deleteAddress } = useAuth();
  const { selectedAddress, setSelectedAddress } = useCheckout();

  const isFromHome = source === 'home';

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

  const handleContinue = () => {
    if (isFromHome || source === 'profile' || source === 'checkout') {
      router.back();
    } else {
      router.push('/checkout/review' as any);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerShown: true,
        headerTitle: 'Select Address',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBack}
          >
            <ChevronLeft size={24} color={Colors.text} />
            <AppText variant="body" weight="medium" style={{ marginLeft: 4 }}>Back</AppText>
          </TouchableOpacity>
        ),
      }} />

      <AddressSelector
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelect={setSelectedAddress}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={() => router.push('/checkout/address-form' as any)}
        onContinue={handleContinue}
        continueButtonText={isFromHome ? 'Save and Continue' : (source === 'checkout' || source === 'profile' ? 'Save Address' : 'Continue')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Platform.OS === 'ios' ? 0 : 8,
  },
});
