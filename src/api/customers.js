import apiClient from './client';

/**
 * Customer API
 *
 * Provides methods for managing customers through the REST API.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const customersApi = {
  /**
   * List customers with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (max 100, default: 20)
   * @param {string} params.search - Search in name, email, phone, company name, GST number
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.sortField - Field to sort by (default: createdAt)
   * @param {string} params.sortDirection - Sort direction: asc, desc (default: desc)
   * @returns {Promise<{customers: Array, pagination: Object}>}
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/customers', { params });
    return response;
  },

  /**
   * Get customer by ID
   * Includes detailed information with addresses, contacts, recent orders and invoices
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  getById: async (id) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response;
  },

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @param {string} customerData.name - Customer name (required)
   * @param {string} customerData.email - Email address
   * @param {string} customerData.phone - Phone number (required)
   * @param {string} customerData.companyName - Company name
   * @param {string} customerData.gstNumber - GST number
   * @param {string} customerData.panNumber - PAN number
   * @param {boolean} customerData.isActive - Active status (default: true)
   * @param {Array} customerData.addresses - Array of address objects
   * @param {Array} customerData.contacts - Array of contact objects
   * @returns {Promise<Object>} Created customer
   */
  create: async (customerData) => {
    const response = await apiClient.post('/customers', customerData);
    return response;
  },

  /**
   * Update an existing customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Customer data to update
   * @returns {Promise<Object>} Updated customer
   */
  update: async (id, customerData) => {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response;
  },

  /**
   * Delete a customer (soft delete)
   * Note: Cannot delete customers with active orders or invoices
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response;
  },
};
