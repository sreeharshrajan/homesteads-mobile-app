import apiClient from './client';

/**
 * Billing API
 * 
 * Provides methods for managing billing through the REST API.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const billingApi = {
  /**
   * Get all billing records
   * @returns {Promise<Array>} Billing records
   */
  getAll: async () => {
    const response = await apiClient.get('/billing');
    return response;
  },
  
  /**
   * Get billing record by ID
   * @param {string} id - Billing record ID
   * @returns {Promise<Object>} Billing record details
   */
  getById: async (id) => {
    const response = await apiClient.get(`/billing/${id}`);
    return response;
  },
  
  /**
   * Get billing records by customer ID
   * @param {string} customerId - Customer ID
   * @returns {Promise<Array>} Billing records for customer
   */
  getByCustomer: async (customerId) => {
    const response = await apiClient.get(`/billing/customer/${customerId}`);
    return response;
  },
  
  /**
   * Create a new billing record
   * @param {Object} billingData - Billing data
   * @returns {Promise<Object>} Created billing record
   */
  create: async (billingData) => {
    const response = await apiClient.post('/billing', billingData);
    return response;
  },
  
  /**
   * Update an existing billing record
   * @param {string} id - Billing record ID
   * @param {Object} billingData - Billing data to update
   * @returns {Promise<Object>} Updated billing record
   */
  update: async (id, billingData) => {
    const response = await apiClient.put(`/billing/${id}`, billingData);
    return response;
  },
};

