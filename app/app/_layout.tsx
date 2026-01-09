import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/store/AuthContext';
import { CartProvider } from '@/store/CartContext';
import { WishlistProvider } from '@/store/WishlistContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{ headerBackTitle: 'Back' }}
      initialRouteName="splash"
    >
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/otp" options={{ title: 'Verify OTP' }} />
      <Stack.Screen
        name="auth/forgot-password"
        options={{ title: 'Reset Password' }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[id]"
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen
        name="product/gallery"
        options={{ title: 'Images', presentation: 'modal' }}
      />
      <Stack.Screen
        name="product/reviews"
        options={{ title: 'Reviews & Ratings' }}
      />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen
        name="filter"
        options={{ title: 'Filter & Sort', presentation: 'modal' }}
      />
      <Stack.Screen
        name="checkout/address-list"
        options={{ title: 'Select Address' }}
      />
      <Stack.Screen
        name="checkout/address-form"
        options={{ title: 'Add Address' }}
      />
      <Stack.Screen
        name="checkout/payment"
        options={{ title: 'Payment Method' }}
      />
      <Stack.Screen
        name="checkout/review"
        options={{ title: 'Review Order' }}
      />
      <Stack.Screen
        name="checkout/success"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="order/list" options={{ headerShown: false }} />
      <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="order/tracking" options={{ title: 'Track Order' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings & Help' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RootLayoutNav />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
