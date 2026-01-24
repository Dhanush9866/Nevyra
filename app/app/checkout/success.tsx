import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Check, ArrowRight } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            <Check size={60} color={Colors.white} strokeWidth={4} />
          </View>
        </View>

        <AppText variant="h2" weight="bold" style={styles.title}>
          Order Placed!
        </AppText>

        <AppText variant="body" color={Colors.textSecondary} style={styles.message}>
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </AppText>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue Shopping"
            onPress={() => router.replace('/(tabs)/(home)' as any)}
            style={styles.primaryButton}
            icon={<ArrowRight size={20} color={Colors.white} />}
          />
          
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => router.push('/(tabs)/orders' as any)}
          >
            <AppText variant="body" weight="semibold" style={{ color: Colors.primary }}>
              View Orders
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 40,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981', // Clean green
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    color: '#1F2937',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 20,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
  },
  outlineButton: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
});
