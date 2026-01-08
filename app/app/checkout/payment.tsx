import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { CreditCard, Smartphone, Wallet, Banknote } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote },
];

export default function PaymentMethodScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Payment Method' }} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <AppText variant="h4" weight="bold">
            Select Payment Method
          </AppText>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodCard}
              activeOpacity={0.8}
            >
              <method.icon size={24} color={Colors.primary} />
              <AppText variant="body" weight="medium">
                {method.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continue to Review"
            onPress={() => router.push('/checkout/review' as any)}
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
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Colors.shadow.sm,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
