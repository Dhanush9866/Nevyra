import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address, CartItem } from '@/types';
import { useAuth } from './AuthContext';

interface CheckoutContextType {
    selectedAddress: Address | null;
    setSelectedAddress: (address: Address) => void;
    selectedPaymentMethod: string | null;
    setSelectedPaymentMethod: (method: string) => void;
    checkoutItems: CartItem[];
    checkoutType: 'cart' | 'buy_now' | null;
    setCheckoutItems: (items: CartItem[], type: 'cart' | 'buy_now') => void;
    resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    const [checkoutType, setCheckoutType] = useState<'cart' | 'buy_now' | null>(null);
    const { isAuthenticated } = useAuth();

    const setCheckoutItemsWithType = (items: CartItem[], type: 'cart' | 'buy_now') => {
        setCheckoutItems(items);
        setCheckoutType(type);
    };

    const resetCheckout = () => {
        setSelectedAddress(null);
        setSelectedPaymentMethod(null);
        setCheckoutItems([]);
        setCheckoutType(null);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            resetCheckout();
        }
    }, [isAuthenticated]);

    return (
        <CheckoutContext.Provider
            value={{
                selectedAddress,
                setSelectedAddress,
                selectedPaymentMethod,
                setSelectedPaymentMethod,
                checkoutItems,
                checkoutType,
                setCheckoutItems: setCheckoutItemsWithType,
                resetCheckout,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (context === undefined) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
