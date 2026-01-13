const API_BASE_URL = 'http://localhost:8000/api/v1';
// const API_BASE_URL = 'https://api.zythova.com/api/v1';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  addresses?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  }>;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Products
  async getProducts(params: Record<string, any> = {}): Promise<{ success: boolean; message: string; data: any[]; pagination?: any }> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProductsByCategory(category: string, limit: number = 10): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request(`/products?category=${encodeURIComponent(category)}&limit=${limit}`);
  }

  async getProductById(id: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/products/${id}`);
  }

  async getProductsByMultipleSubcategories(params: Record<string, any> = {}): Promise<{ success: boolean; message: string; data: any[]; pagination?: any }> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/products/by-subcategories${query ? `?${query}` : ''}`);
  }

  async getTopDeals(limit: number = 10): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request(`/products/top-deals?limit=${limit}`);
  }

  async getSettings(): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/settings');
  }

  // Cart
  async getCart(): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity = 1, selectedFeatures?: Record<string, string>): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, selectedFeatures }),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/cart/${itemId}`, { method: 'DELETE' });
  }

  // Orders
  async createOrder(payload: any): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  }

  async getOrders(): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request('/orders');
  }

  // Wishlist
  async getWishlist(): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request('/users/wishlist');
  }

  async addToWishlist(productId: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/users/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/users/wishlist/${productId}`, { method: 'DELETE' });
  }

  async getOrderById(id: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/orders/${id}`);
  }
  async updateOrderStatus(id: string, status: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  // Reviews
  async getReviews(productId: string): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request(`/reviews/product/${productId}`);
  }

  async createReview(productId: string, reviewData: { rating: number; title?: string; comment: string; images?: string[] }): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/reviews/${reviewId}`, { method: 'DELETE' });
  }

  async requestReturn(id: string, reason: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/orders/${id}/return`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async sendContactForm(data: { name: string; email: string; subject: string; message: string; }): Promise<{ success: boolean; message: string }> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const method = options.method || 'GET';

    try {
      console.log(`API Request: ${method} ${url}`, config);
      const response = await fetch(url, config);
      const data = await response.json();
      console.log(`API Response: ${method} ${url}`, data);

      if (!response.ok) {
        console.error(`API Error: ${method} ${url}`, data);
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error(`API Request Failed: ${method} ${url}`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<{ success: boolean; message: string; data: UserProfile }> {
    return this.request<{ success: boolean; message: string; data: UserProfile }>('/auth/profile');
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; message: string; data: UserProfile }> {
    return this.request<{ success: boolean; message: string; data: UserProfile }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Payment methods
  async createPaymentOrder(amount: number, currency = 'INR'): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  async verifyPayment(details: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(details),
    });
  }

  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  // Address management methods
  async getAddresses(): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>('/auth/addresses');
  }

  async addAddress(addressData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  }): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddressByIndex(index: number, addressData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  }): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>(`/auth/addresses/${index}`, {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddressByIndex(index: number): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>(`/auth/addresses/${index}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
