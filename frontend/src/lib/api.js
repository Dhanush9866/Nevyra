// API Base URL - Updated to deployed backend URL
const API_BASE_URL = 'https://nevback.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Check if response is ok before trying to parse JSON
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }
};

// Helper function to make API requests with better error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    // Handle network errors, CORS issues, etc.
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// ==================== AUTHENTICATION APIs ====================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Reset password
  resetPassword: async (email, otp, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },
};

// ==================== PRODUCT APIs ====================

export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    return apiRequest('/products/all');
  },

  // Get products with pagination
  getProducts: async (page = 1, limit = 12) => {
    return apiRequest(`/products?page=${page}&limit=${limit}`);
  },

  // Get single product by ID
  getProductById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Search products
  searchProducts: async (query) => {
    return apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    return apiRequest(`/products/category/${categoryId}`);
  },
};

// ==================== CATEGORY APIs ====================

export const categoryAPI = {
  // Get all categories
  getAllCategories: async () => {
    return apiRequest('/categories');
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return apiRequest(`/categories/${id}`);
  },
};

// ==================== USER APIs ====================

export const userAPI = {
  // Get user addresses
  getAddresses: async () => {
    return apiRequest('/users/addresses');
  },

  // Add new address
  addAddress: async (addressData) => {
    return apiRequest('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    return apiRequest(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  // Delete address
  deleteAddress: async (addressId) => {
    return apiRequest(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    return apiRequest(`/users/addresses/${addressId}/default`, {
      method: 'PUT',
    });
  },
};

// ==================== ORDER APIs ====================

export const orderAPI = {
  // Get user orders
  getUserOrders: async () => {
    return apiRequest('/orders');
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },
};

// ==================== PAYMENT APIs ====================

export const paymentAPI = {
  // Create payment order
  createOrder: async (paymentData) => {
    return apiRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Verify payment
  verifyPayment: async (verificationData) => {
    return apiRequest('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },

  // Create mock order (for testing)
  createMockOrder: async (paymentData) => {
    return apiRequest('/payments/create-mock-order', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Verify mock payment (for testing)
  verifyMockPayment: async (verificationData) => {
    return apiRequest('/payments/verify-mock', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    return apiRequest(`/payments/${paymentId}`);
  },

  // Refund payment
  refundPayment: async (paymentId, refundData) => {
    return apiRequest(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  },

  // Test Razorpay connection
  testConnection: async () => {
    return apiRequest('/payments/test');
  },
};

// ==================== ADMIN APIs ====================

export const adminAPI = {
  // Get all orders (admin)
  getAllOrders: async () => {
    return apiRequest('/admin/orders');
  },

  // Get all products (admin)
  getAllProducts: async () => {
    return apiRequest('/admin/products');
  },

  // Get all customers (admin)
  getAllCustomers: async () => {
    return apiRequest('/admin/customers');
  },

  // Get analytics (admin)
  getAnalytics: async () => {
    return apiRequest('/admin/analytics');
  },
};

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  // Dispatch custom event for logout
  window.dispatchEvent(new CustomEvent('userLoggedOut'));
};

// Get user email from localStorage
export const getUserEmail = () => {
  return localStorage.getItem('userEmail');
};

// Set user email in localStorage
export const setUserEmail = (email) => {
  localStorage.setItem('userEmail', email);
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// ==================== ERROR HANDLING ====================

// Custom error class for API errors
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Enhanced error handling
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'APIError') {
    return error;
  }
  
  return new APIError(
    error.message || 'An unexpected error occurred',
    500,
    null
  );
};

// ==================== EXPORT DEFAULT ====================

export default {
  auth: authAPI,
  products: productAPI,
  categories: categoryAPI,
  users: userAPI,
  orders: orderAPI,
  payments: paymentAPI,
  admin: adminAPI,
  utils: {
    isAuthenticated,
    logout,
    getUserEmail,
    setUserEmail,
    setAuthToken,
  },
}; 