import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { User, Phone, MapPin } from 'lucide-react-native';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';
import { useAuth } from '@/store/AuthContext';
import { Address } from '@/types';

export default function AddressFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addAddress, updateAddress } = useAuth();

  const editMode = params.editMode === 'true';
  const addressIndex = params.index ? parseInt(params.index as string, 10) : -1;
  const initialData = params.addressData ? JSON.parse(params.addressData as string) as Address : null;

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [addressLine1, setAddressLine1] = useState(initialData?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(initialData?.addressLine2 || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [zipCode, setZipCode] = useState(initialData?.zipCode || '');

  const handleSave = async () => {
    if (!firstName || !lastName || !phone || !addressLine1 || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const addressData: Partial<Address> = {
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
    };

    try {
      let result;
      if (editMode && addressIndex !== -1) {
        result = await updateAddress(addressIndex, addressData);
      } else {
        result = await addAddress(addressData);
      }

      if (result.success) {
        Alert.alert('Success', `Address ${editMode ? 'updated' : 'added'} successfully`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Save address error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: editMode ? 'Edit Address' : 'Add Address' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <InputField
            icon={User}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <InputField
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <InputField
            icon={Phone}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <InputField
            icon={MapPin}
            placeholder="Address Line 1"
            value={addressLine1}
            onChangeText={setAddressLine1}
          />
          <InputField
            placeholder="Address Line 2 (Optional)"
            value={addressLine2}
            onChangeText={setAddressLine2}
          />
          <InputField placeholder="City" value={city} onChangeText={setCity} />
          <InputField
            placeholder="State"
            value={state}
            onChangeText={setState}
          />
          <InputField
            placeholder="Pincode"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={editMode ? 'Update Address' : 'Save Address'}
            onPress={handleSave}
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </>
  );
}

function InputField({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: any) {
  return (
    <View style={styles.inputContainer}>
      {Icon && (
        <Icon size={20} color={Colors.textSecondary} style={styles.inputIcon} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.textLight}
      />
    </View>
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
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizes.base,
    color: Colors.text,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
