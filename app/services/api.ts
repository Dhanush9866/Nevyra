import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://10.227.125.42:8000/api/v1'; // Use local IP instead of localhost for mobile devices

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Add auth token if available
    const token = await AsyncStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    const method = options.method || 'GET';

    try {
      console.log(`API Request: ${method} ${url}`);
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error(`API Request Failed: ${method} ${url}`, error);
      throw error;
    }
  }

  private mapBackendProduct(p: any) {
    return {
      id: p.id || p._id,
      name: p.title || p.name,
      description: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice || p.price * 1.2, // mock if missing
      discount: p.discount || 20, // mock if missing
      images: p.images || [],
      category: p.category,
      subcategory: p.subCategory || p.subcategory,
      rating: p.rating || 0,
      reviewCount: p.reviews || 0,
      inStock: p.inStock !== undefined ? p.inStock : true,
      brand: p.brand || 'Zythova',
      specifications: p.attributes || p.specifications || {},
    };
  }

  private mapBackendOrder(o: any) {
    return {
      id: o._id || o.id,
      orderNumber: o.orderNumber || `ORD${(o._id || o.id).substring(0, 8).toUpperCase()}`,
      items: (o.items || []).map((item: any) => ({
        id: item._id || item.id,
        product: item.productId ? this.mapBackendProduct(item.productId) : null,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: o.totalAmount,
      status: (o.status || 'pending').toLowerCase(),
      shippingAddress: o.shippingAddress || (o.userId?.addresses?.[0] || {}), // Fallback to first address if missing
      paymentMethod: o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      createdAt: o.createdAt,
      deliveryDate: o.deliveryDate,
      trackingNumber: o.trackingNumber,
      returnStatus: o.returnStatus || 'None',
      returnReason: o.returnReason || '',
    };
  }

  // Categories
  async getCategories(parentId?: string) {
    const query = parentId ? `?parentId=${parentId}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/categories${query}`);
  }

  // Products
  async getProducts(params: {
    category?: string;
    subCategory?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  }) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.subCategory) query.append('subCategory', params.subCategory);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sort) query.append('sort', params.sort);
    if (params.brand) query.append('brand', params.brand);
    if (params.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params.rating) query.append('rating', params.rating.toString());

    const response = await this.request<{ success: boolean; data: any[]; pagination: any }>(
      `/products?${query.toString()}`
    );

    if (response.success && response.data) {
      response.data = response.data.map(this.mapBackendProduct);
    }

    return response;
  }

  async getProductDetails(id: string) {
    const response = await this.request<{ success: boolean; data: any }>(`/products/${id}`);

    if (response.success && response.data) {
      response.data = this.mapBackendProduct(response.data);
    }

    return response;
  }

  async getSettings() {
    return this.request<{ success: boolean; data: any }>('/settings');
  }

  async getPopularSearches() {
    return this.request<{ success: boolean; data: string[] }>('/products/popular-searches');
  }

  async getSimilarProducts(id: string) {
    return this.request<{ success: boolean; data: any[] }>(`/products/${id}/similar`);
  }

  async getReviews(productId: string) {
    return this.request<{ success: boolean; data: any[] }>(`/reviews/product/${productId}`);
  }

  // Auth
  async login(credentials: any) {
    const response = await this.request<{ success: boolean; message: string; data: { token: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }

    return response;
  }

  async register(userData: any) {
    const response = await this.request<{ success: boolean; message: string; data: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    return response;
  }

  async logout() {
    await AsyncStorage.removeItem('token');
  }

  async getProfile() {
    return this.request<{ success: boolean; message: string; data: any }>('/auth/profile');
  }

  async updateProfile(userData: { firstName?: string; lastName?: string; phone?: string; email?: string; avatar?: string }) {
    return this.request<{ success: boolean; message: string; data: any }>(
      '/auth/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(userData),
      }
    );
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.request<{ success: boolean; message: string }>(
      '/auth/change-password',
      {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string; data?: any }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  }

  async verifyOTP(email: string, otp: string) {
    return this.request<{ success: boolean; message: string; data?: any }>(
      '/auth/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      }
    );
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    return this.request<{ success: boolean; message: string; data?: any }>(
      '/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      }
    );
  }

  async uploadImage(imageUri: string) {
    const url = `${this.baseURL}/upload/image`;
    const token = await AsyncStorage.getItem('token');

    console.log('[ApiService] Uploading image to:', url);
    console.log('[ApiService] Image URI:', imageUri);

    // Create FormData
    const formData = new FormData();

    // IMPORTANT:
    // - On React Native / Expo, keep the URI intact (including `file://`) for FormData uploads.
    // - Stripping `file://` (previous iOS behavior) can break uploads, resulting in "success"
    //   paths never being reached and the avatar never updating.
    const uri = imageUri;

    // Best-effort filename + mime type
    const filename = (imageUri.split('/').pop() || 'profile.jpg').split('?')[0];
    const match = /\.(\w+)$/.exec(filename);
    const ext = (match?.[1] || 'jpg').toLowerCase();
    const type =
      ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'png'
          ? 'image/png'
          : ext === 'webp'
            ? 'image/webp'
            : `image/${ext}`;

    formData.append('image', {
      uri: uri,
      name: filename,
      type: type,
    } as any);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('[ApiService] Raw upload response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    } catch (error) {
      console.error('[ApiService] Upload error:', error);
      throw error;
    }
  }

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }

  // Address
  async getAddresses() {
    return this.request<{ success: boolean; data: any[]; message?: string }>('/auth/addresses');
  }

  async addAddress(addressData: any) {
    return this.request<{ success: boolean; data: any[]; message?: string }>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(index: number, addressData: any) {
    return this.request<{ success: boolean; data: any[]; message?: string }>(`/auth/addresses/${index}`, {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(index: number) {
    return this.request<{ success: boolean; data: any[]; message?: string }>(`/auth/addresses/${index}`, {
      method: 'DELETE',
    });
  }

  // Cart
  async getCart() {
    const response = await this.request<{ success: boolean; data: any[] }>('/cart');
    if (response.success && response.data) {
      response.data = response.data.map((item: any) => ({
        ...item,
        productId: this.mapBackendProduct(item.productId),
      }));
    }
    return response;
  }

  async addToCart(productId: string, quantity: number = 1, selectedFeatures: any = {}) {
    return this.request<{ success: boolean; data: any }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, selectedFeatures }),
    });
  }

  async updateCartQuantity(itemId: string, quantity: number) {
    return this.request<{ success: boolean; data: any }>(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request<{ success: boolean; data: null }>(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    const response = await this.request<{ success: boolean; data: any[] }>('/users/wishlist');
    if (response.success && response.data) {
      response.data = response.data.map((item: any) => ({
        ...item,
        productId: this.mapBackendProduct(item.productId),
      }));
    }
    return response;
  }

  async addToWishlist(productId: string) {
    return this.request<{ success: boolean; data: any }>('/users/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(itemId: string) {
    return this.request<{ success: boolean; data: null }>(`/users/wishlist/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    const response = await this.request<{ success: boolean; data: any[] }>('/orders');
    if (response.success && response.data) {
      response.data = response.data.map((order: any) => this.mapBackendOrder(order));
    }
    return response;
  }

  async getOrderDetails(id: string) {
    const response = await this.request<{ success: boolean; data: any }>(`/orders/${id}`);
    if (response.success && response.data) {
      response.data = this.mapBackendOrder(response.data);
    }
    return response;
  }

  async cancelOrder(id: string) {
    return this.request<{ success: boolean; message: string }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Cancelled' }),
    });
  }

  async requestReturn(id: string, reason: string) {
    return this.request<{ success: boolean; message: string }>(`/orders/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async createOrder(orderData: { paymentMethod: string; paymentDetails?: any; shippingAddress: any; items?: any[]; totalAmount?: number }) {
    return this.request<{ success: boolean; message: string; data: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async submitReview(productId: string, reviewData: { rating: number; title?: string; comment: string; images?: string[] }) {
    return this.request<{ success: boolean; message: string; data: any }>(`/reviews/product/${productId}`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  async getUserReviews() {
    return this.request<{ success: boolean; data: any[] }>('/reviews/user');
  }

  async getPendingReviews() {
    // This could be a special endpoint or we can filter orders on frontend
    // For now, let's assume there's an endpoint for it
    return this.request<{ success: boolean; data: any[] }>('/reviews/pending');
  }

  // Payments
  async createPaymentOrder(amount: number) {
    return this.request<{ success: boolean; data: { orderId: string; amount: number; currency: string } }>(
      "/payments/create-order",
      {
        method: "POST",
        body: JSON.stringify({ amount }),
      }
    );
  }

  async verifyPayment(paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return this.request<{ success: boolean; message: string }>(
      "/payments/verify",
      {
        method: "POST",
        body: JSON.stringify(paymentData),
      }
    );
  }
}

export const apiService = new ApiService(API_BASE_URL);
