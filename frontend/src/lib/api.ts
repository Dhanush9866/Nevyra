const API_BASE_URL = 'http://localhost:8000/api';

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
  async getProducts(params: Record<string, any> = {}): Promise<{ success: boolean; message: string; data: any[] }> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProductById(id: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/products/${id}`);
  }

  // Cart
  async getCart(): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity = 1): Promise<{ success: boolean; message: string; data: any }> {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
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

  async getOrderById(id: string): Promise<{ success: boolean; message: string; data: any }> {
    return this.request(`/orders/${id}`);
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

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
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