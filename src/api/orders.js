import apiClient from './client';

/**
 * Orders API
 *
 * Provides methods for viewing orders through the REST API (read-only).
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const ordersApi = {
  /**
   * List customer orders with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {string} params.customerId - Customer ID (required if sessionId not provided)
   * @param {string} params.sessionId - Guest session ID (required if customerId not provided)
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (max 50, default: 10)
   * @param {string} params.status - Filter by order status
   * @param {string} params.dateFrom - Filter orders from date (ISO 8601)
   * @param {string} params.dateTo - Filter orders to date (ISO 8601)
   * @returns {Promise<{orders: Array, pagination: Object, stats: Object}>}
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/store/orders', { params });
    return response;
  },

  /**
   * Get order details
   * @param {string} orderId - Order ID
   * @param {Object} params - Query parameters
   * @param {string} params.customerId - Customer ID (required if sessionId not provided)
   * @param {string} params.sessionId - Guest session ID (required if customerId not provided)
   * @returns {Promise<Object>} Order details with timeline and tracking
   */
  getById: async (orderId, params = {}) => {
    const response = await apiClient.get(`/store/orders/${orderId}`, { params });
    return response;
  },

  /**
   * Order status values
   */
  STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
  },

  /**
   * Get status label and color
   * @param {string} status - Order status
   * @returns {Object} Status display info
   */
  getStatusInfo: (status) => {
    const statusMap = {
      PENDING: { label: 'Pending', color: '#FFA500' },
      CONFIRMED: { label: 'Confirmed', color: '#2196F3' },
      PROCESSING: { label: 'Processing', color: '#9C27B0' },
      SHIPPED: { label: 'Shipped', color: '#FF9800' },
      DELIVERED: { label: 'Delivered', color: '#4CAF50' },
      CANCELLED: { label: 'Cancelled', color: '#F44336' },
      REFUNDED: { label: 'Refunded', color: '#607D8B' },
    };
    return statusMap[status] || { label: status, color: '#757575' };
  },
};
