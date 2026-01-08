import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useCart } from '@/store/CartContext';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle size={100} color={Colors.success} />
        <AppText variant="h2" weight="bold" style={styles.title}>
          Order Placed!
        </AppText>
        <AppText variant="body" color={Colors.textSecondary} align="center">
          Your order has been placed successfully. You will receive a
          confirmation email shortly.
        </AppText>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue Shopping"
          onPress={() => router.replace('/(tabs)/(home)' as any)}
          fullWidth
        />
        <Button
          title="View Orders"
          onPress={() => router.push('/order/list' as any)}
          variant="outline"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  title: {
    marginTop: Spacing.lg,
  },
  footer: {
    gap: Spacing.md,
  },
});
