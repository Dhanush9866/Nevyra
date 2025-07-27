// Dummy Razorpay types
export interface DummyRazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Dummy Razorpay options
export interface DummyRazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: DummyRazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

// Dummy Razorpay instance
export class DummyRazorpay {
  private options: DummyRazorpayOptions;

  constructor(options: DummyRazorpayOptions) {
    this.options = options;
  }

  open() {
    // Simulate payment processing delay
    setTimeout(() => {
      // Generate dummy payment response
      const dummyResponse: DummyRazorpayResponse = {
        razorpay_payment_id: 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        razorpay_order_id: this.options.order_id,
        razorpay_signature: 'dummy_signature_' + Date.now()
      };

      // Call the success handler
      this.options.handler(dummyResponse);
    }, 3000); // 3 second delay to simulate processing
  }
}

// Dummy order creation
export const createDummyOrder = async (amount: number, currency: string = 'INR') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      orderId: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_${Date.now()}`
    }
  };
};

// Dummy payment verification
export const verifyDummyPayment = async (
  order_id: string,
  payment_id: string,
  signature: string
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      orderId: order_id,
      paymentId: payment_id,
      signature: signature
    }
  };
};

// Initialize dummy payment
export const initializeDummyPayment = async (
  amount: number,
  currency: string = 'INR',
  userDetails: {
    name?: string;
    email?: string;
    contact?: string;
  } = {},
  onSuccess?: (response: DummyRazorpayResponse) => void,
  onFailure?: (error: any) => void,
  onDismiss?: () => void
) => {
  try {
    // Create dummy order
    const orderData = await createDummyOrder(amount, currency);

    // Create dummy Razorpay instance
    const dummyRazorpay = new DummyRazorpay({
      key: 'rzp_test_dummy_key',
      amount: orderData.data.amount,
      currency: orderData.data.currency,
      name: 'Nevyra E-commerce',
      description: 'Test Payment',
      order_id: orderData.data.orderId,
      prefill: userDetails,
      handler: async (response) => {
        try {
          // Verify dummy payment
          await verifyDummyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (onSuccess) {
            onSuccess(response);
          }
        } catch (error) {
          if (onFailure) {
            onFailure(error);
          }
        }
      },
      modal: {
        ondismiss: onDismiss
      }
    });

    // Open dummy payment modal
    dummyRazorpay.open();

  } catch (error) {
    if (onFailure) {
      onFailure(error);
    }
  }
}; 