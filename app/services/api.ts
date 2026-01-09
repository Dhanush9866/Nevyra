import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000/api/v1';

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
      brand: p.brand || 'Nevyra',
      specifications: p.attributes || p.specifications || {},
    };
  }

  // Categories
  async getCategories() {
    return this.request<{ success: boolean; data: any[] }>('/categories');
  }

  // Products
  async getProducts(params: {
    category?: string;
    subCategory?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.subCategory) query.append('subCategory', params.subCategory);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

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

  async getPopularSearches() {
    return this.request<{ success: boolean; data: string[] }>('/products/popular-searches');
  }

  async getSimilarProducts(id: string) {
    return this.request<{ success: boolean; data: any[] }>(`/products/${id}/similar`);
  }

  async getReviews(productId: string) {
    return this.request<{ success: boolean; data: any[] }>(`/reviews/product/${productId}`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
