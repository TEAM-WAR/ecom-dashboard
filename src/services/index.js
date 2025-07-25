// Export all services
export { default as apiClient } from './apiClient';
export { default as productService } from './productService';
export { default as categoryService } from './categoryService';

// Re-export specific functions for convenience
export { productService } from './productService';
export { categoryService } from './categoryService'; 