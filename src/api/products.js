import apiClient from './client';

/**
 * Products API
 * 
 * Provides methods for accessing product catalog through the REST API.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const productsApi = {
  /**
   * List products with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (max 100, default: 10)
   * @param {string} params.language - Language code (EN, HI, TA, TE, BN, GU, KN, ML, MR, PA)
   * @param {string} params.categoryId - Filter by category ID
   * @param {string} params.categorySlug - Filter by category slug
   * @param {string} params.search - Search in name, description, and SKU
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.type - Filter by product type (VEGETARIAN, NON_VEGETARIAN, etc.)
   * @param {string} params.form - Filter by product form (FRESH, POWDERED, DRIED, etc.)
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {boolean} params.isFeatured - Filter by featured status
   * @param {string} params.sortBy - Sort field (createdAt, updatedAt, name, basePrice)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @param {string} params.fields - Comma-separated list of fields to include
   * @param {boolean} params.includeVariants - Include product variants
   * @param {boolean} params.includeMedia - Include product media/images
   * @param {boolean} params.includeTax - Include tax information
   * @param {boolean} params.includePricing - Include pricing details with discounts
   * @param {boolean} params.includeDiscounts - Include applicable discounts
   * @returns {Promise<{products: Array, pagination: Object}>}
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/products', { params });
    return response;
  },
  
  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @param {Object} params - Query parameters
   * @param {string} params.language - Language code for translations
   * @returns {Promise<Object>} Product details
   */
  getById: async (id, params = {}) => {
    const response = await apiClient.get(`/products/${id}`, { params });
    return response;
  },
  
  /**
   * Get product by slug
   * @param {string} slug - Product slug
   * @param {Object} params - Query parameters
   * @param {string} params.language - Language code for translations
   * @param {number} params.relatedLimit - Number of related products to include
   * @returns {Promise<Object>} Product details with related products
   */
  getBySlug: async (slug, params = {}) => {
    const response = await apiClient.get(`/products/slug/${slug}`, { params });
    return response;
  },
  
  /**
   * Search products
   * @param {Object} params - Query parameters
   * @param {string} params.q - Search query (required)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page (max 100)
   * @param {string} params.language - Language code
   * @param {string} params.categoryId - Filter by category
   * @param {number} params.minPrice - Minimum price
   * @param {number} params.maxPrice - Maximum price
   * @param {string} params.sortBy - Sort by (relevance, price, name, newest)
   * @returns {Promise<{products: Array, pagination: Object}>}
   */
  search: async (params = {}) => {
    const response = await apiClient.get('/products/search', { params });
    return response;
  },
  
  /**
   * Get featured products
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of products
   * @param {string} params.language - Language code
   * @returns {Promise<Array>} Featured products
   */
  getFeatured: async (params = {}) => {
    const response = await apiClient.get('/products/featured', { params });
    return response;
  },
  
  /**
   * Get products by category
   * @param {string} categorySlug - Category slug
   * @param {Object} params - Query parameters (same as getAll)
   * @returns {Promise<{products: Array, pagination: Object}>}
   */
  getByCategory: async (categorySlug, params = {}) => {
    const response = await apiClient.get(`/products/category/${categorySlug}`, { params });
    return response;
  },
};

