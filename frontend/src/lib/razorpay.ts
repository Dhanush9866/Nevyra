// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

import { paymentAPI } from "@/lib/api";

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay instance
export const createRazorpayInstance = (options: RazorpayOptions) => {
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }
  return new window.Razorpay(options);
};

// Create payment order on backend
export const createPaymentOrder = async (amount: number, currency: string = 'INR') => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User not authenticated');
  }
  const data = await paymentAPI.createOrder({ amount, currency });
  return data.data;
};

// Verify payment on backend
export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User not authenticated');
  }
  const data = await paymentAPI.verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  });
  return data;
};

// Initialize payment
export const initializePayment = async (
  amount: number,
  currency: string = 'INR',
  userDetails: {
    name?: string;
    email?: string;
    contact?: string;
  } = {},
  onSuccess?: (response: RazorpayResponse) => void,
  onFailure?: (error: any) => void,
  onDismiss?: () => void
) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Create order on backend
    const orderData = await createPaymentOrder(amount, currency);

    // Configure Razorpay options
    const options: RazorpayOptions = {
      key: 'rzp_test_Hi1GYpZ5GO1ona', // Your original Razorpay test key
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Nevyra Shopping',
      description: 'Order Payment',
      image: '/logo.jpg',
      order_id: orderData.orderId,
      handler: (response: RazorpayResponse) => {
        // Verify payment on backend
        verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        )
          .then(() => {
            if (onSuccess) {
              onSuccess(response);
            }
          })
          .catch((error) => {
            if (onFailure) {
              onFailure(error);
            }
          });
      },
      prefill: {
        name: userDetails.name || '',
        email: userDetails.email || '',
        contact: userDetails.contact || '',
      },
      notes: {
        source: 'nevyra-ecommerce',
      },
      theme: {
        color: '#2563eb',
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) {
            onDismiss();
          }
        },
      },
    };

    // Create and open Razorpay instance
    const rzp = createRazorpayInstance(options);
    rzp.open();

  } catch (error) {
    if (onFailure) {
      onFailure(error);
    }
  }
}; 