import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { User, Phone, MapPin } from 'lucide-react-native';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';

export default function AddressFormScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  return (
    <>
      <Stack.Screen options={{ title: 'Add Address' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <InputField
            icon={User}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
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
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Save Address"
            onPress={() => router.back()}
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
