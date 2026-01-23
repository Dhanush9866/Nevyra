import React, { createContext, useContext, useState } from 'react';
import { Address } from '@/types';

interface CheckoutContextType {
    selectedAddress: Address | null;
    setSelectedAddress: (address: Address) => void;
    selectedPaymentMethod: string | null;
    setSelectedPaymentMethod: (method: string) => void;
    resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

    const resetCheckout = () => {
        setSelectedAddress(null);
        setSelectedPaymentMethod(null);
    };

    return (
        <CheckoutContext.Provider
            value={{
                selectedAddress,
                setSelectedAddress,
                selectedPaymentMethod,
                setSelectedPaymentMethod,
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
