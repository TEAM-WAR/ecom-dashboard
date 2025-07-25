import apiClient from './apiClient';

// Product API Service
export const productService = {
  // Get all products with optional filters
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    return apiClient.get(url);
  },

  // Get a single product by ID
  getProductById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

  // Create a new product
  createProduct: async (productData) => {
    return apiClient.post('/products', productData);
  },

  // Update an existing product
  updateProduct: async (id, productData) => {
    return apiClient.put(`/products/${id}`, productData);
  },

  // Delete a product
  deleteProduct: async (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  // Add a review to a product
  addReview: async (id, reviewData) => {
    return apiClient.post(`/products/${id}/reviews`, reviewData);
  }
};

export default productService; 