// API Base URL - Update to your deployed backend URL
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
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

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const mergedHeaders = { ...defaultHeaders, ...(options.headers || {}) };
  const config = { ...options, headers: mergedHeaders };
  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// ==================== ADMIN AUTH APIs ====================
export const adminAPI = {
  // Admin login
  login: async (credentials) => {
    return apiRequest('/admins/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // ==================== PRODUCT APIs ====================
  products: {
    // Get all products
    getAll: async (token) => {
      return apiRequest('/products/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    // Get products with pagination
    getList: async (params = {}, token) => {
      const queryParams = new URLSearchParams(params).toString();
      return apiRequest(`/products?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    // Get single product
    getById: async (id, token) => {
      return apiRequest(`/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    // Create product
    create: async (productData, token) => {
      return apiRequest('/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
    },
    
    // Update product
    update: async (id, productData, token) => {
      return apiRequest(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
    },
    
    // Delete product
    delete: async (id, token) => {
      return apiRequest(`/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  },
  
  // ==================== CATEGORY APIs ====================
  categories: {
    // Get all categories (no auth required)
    getAll: async () => {
      return apiRequest('/categories');
    },
    
    // Create category
    create: async (categoryData, token) => {
      return apiRequest('/categories', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(categoryData),
      });
    },
    
    // Update category
    update: async (id, categoryData, token) => {
      return apiRequest(`/categories/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(categoryData),
      });
    },
    
    // Delete category
    delete: async (id, token) => {
      return apiRequest(`/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  },
  
  // ==================== UPLOAD APIs ====================
  upload: {
    // Upload single image
    singleImage: async (imageFile, token) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      return fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      }).then(handleResponse);
    },
    
    // Upload multiple images
    multipleImages: async (imageFiles, token) => {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      return fetch(`${API_BASE_URL}/upload/images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      }).then(handleResponse);
    }
  },
  
  // ==================== DASHBOARD APIs ====================
  dashboard: {
    // Get dashboard statistics
    getStats: async (token) => {
      return apiRequest('/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    // Get quick stats for tiles
    getQuickStats: async (token) => {
      return apiRequest('/dashboard/quick-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  },
  
  // ==================== ORDER APIs ====================
  orders: {
    // Get all orders (admin)
    getAll: async (token) => {
      return apiRequest('/orders/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    // Get single order
    getById: async (id, token) => {
      return apiRequest(`/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    },
    
    // Update order status
    updateStatus: async (id, status, token) => {
      return apiRequest(`/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
    }
  }
};

export default {
  admin: adminAPI,
}; 