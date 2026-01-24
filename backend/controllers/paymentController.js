const Razorpay = require('razorpay');

// Initialize Razorpay instance with credentials from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_Hi1GYpZ5GO1ona", // Fallback to current if env missing
  key_secret: process.env.RAZORPAY_KEY_SECRET || "MD1ZzE5z6dXc5LovE5byCQTm",
});

// Test Razorpay connection
const testRazorpayConnection = async (req, res) => {
  try {
    console.log('Testing Razorpay connection...');
    console.log('Key ID:', "rzp_test_Hi1GYpZ5GO1ona");
    console.log('Key Secret length:', "MD1ZzE5z6dXc5LovE5byCQTm".length);

    // Just test if we can create a simple order without authentication
    const testOptions = {
      amount: 100, // 1 rupee in paise
      currency: 'INR',
      receipt: 'test_receipt'
    };

    console.log('Attempting to create test order...');
    const order = await razorpay.orders.create(testOptions);

    res.json({
      success: true,
      message: 'Razorpay connection successful',
      data: {
        orderId: order.id,
        amount: order.amount
      }
    });
  } catch (error) {
    console.error('Razorpay connection test failed:', error);

    // Return more detailed error information
    res.status(500).json({
      success: false,
      message: 'Razorpay connection failed',
      error: error.error?.description || error.message,
      details: {
        statusCode: error.statusCode,
        errorCode: error.error?.code,
        description: error.error?.description
      }
    });
  }
};

// Create payment order
const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    console.log('Creating Razorpay order with:', {
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      key_id: "rzp_test_Hi1GYpZ5GO1ona"
    });

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    console.log('Razorpay options:', options);

    try {
      const order = await razorpay.orders.create(options);
      console.log('Razorpay order created successfully:', order.id);

      res.json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt
        }
      });
    } catch (rzpError) {
      console.error('Razorpay creation failed, falling back to mock:', rzpError);

      // Fallback to mock order if Razorpay fails (e.g. Invalid Key/Secret)
      // This ensures the frontend can still proceed with "Test Mode" UI
      const mockOrderId = `order_mock_${Date.now()}`;

      res.json({
        success: true,
        message: 'Razorpay init failed, using mock',
        data: {
          orderId: mockOrderId,
          amount: amount * 100,
          currency: currency,
          receipt: receipt || `receipt_${Date.now()}`,
          isMock: true
        }
      });
    }

  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    // More detailed error logging
    if (error.error && error.error.description) {
      console.error('Razorpay error details:', error.error);
    }

    const errorMessage = error.error?.description || error.message || 'Unknown error occurred';

    res.status(500).json({
      success: false,
      message: `Razorpay Error: ${errorMessage}`,
      error: errorMessage
    });
  }
};

// Mock payment for testing (when Razorpay is not working)
const createMockOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    // Generate mock order ID
    const mockOrderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    console.log('Creating mock order:', mockOrderId);

    res.json({
      success: true,
      data: {
        orderId: mockOrderId,
        amount: amount * 100,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Error creating mock order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mock order',
      error: error.message
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters'
      });
    }

    // Create the signature string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Create the expected signature
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET || "MD1ZzE5z6dXc5LovE5byCQTm";
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// Mock payment verification
const verifyMockPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // For mock payments, always return success
    res.json({
      success: true,
      message: 'Mock payment verified successfully',
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      }
    });

  } catch (error) {
    console.error('Error verifying mock payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify mock payment',
      error: error.message
    });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, speed = 'normal', notes } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const refundOptions = {
      amount: amount, // Amount to refund in paise
      speed: speed, // 'normal' or 'optimum'
      notes: notes || {}
    };

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    res.json({
      success: true,
      data: refund
    });

  } catch (error) {
    console.error('Error refunding payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refund payment',
      error: error.message
    });
  }
};

module.exports = {
  testRazorpayConnection,
  createOrder,
  createMockOrder,
  verifyPayment,
  verifyMockPayment,
  getPaymentDetails,
  refundPayment
}; 