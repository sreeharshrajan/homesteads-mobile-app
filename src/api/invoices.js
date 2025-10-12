import apiClient from './client';

/**
 * Invoice API
 * 
 * Provides methods for managing invoices through the REST API.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const invoicesApi = {
  /**
   * List invoices with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (max 100, default: 20)
   * @param {string} params.search - Search in invoice number, status note, customer name, order number
   * @param {string} params.customerId - Filter by customer ID
   * @param {string} params.status - Filter by status: DRAFT, SENT, PAID, CANCELLED
   * @param {string} params.dateFrom - Filter invoices from date (ISO 8601)
   * @param {string} params.dateTo - Filter invoices to date (ISO 8601)
   * @param {string} params.sortField - Field to sort by (default: createdAt)
   * @param {string} params.sortDirection - Sort direction: asc, desc (default: desc)
   * @returns {Promise<{invoices: Array, pagination: Object}>}
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/invoices', { params });
    return response;
  },
  
  /**
   * Get invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Invoice details
   */
  getById: async (id) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response;
  },
  
  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @param {string} invoiceData.customerId - Customer ID (required)
   * @param {string} invoiceData.orderId - Order ID (optional)
   * @param {string} invoiceData.invoiceNo - Invoice number (auto-generated if not provided)
   * @param {string} invoiceData.status - Invoice status (default: DRAFT)
   * @param {string} invoiceData.statusNote - Optional status note
   * @param {string} invoiceData.issueDate - Issue date (default: current date)
   * @param {string} invoiceData.dueDate - Due date
   * @param {number} invoiceData.totalAmount - Total invoice amount (required)
   * @param {string} invoiceData.placeOfSupply - Place of supply for GST
   * @param {string} invoiceData.remarks - Additional remarks
   * @param {string} invoiceData.poNumber - Purchase order number
   * @param {string} invoiceData.poDate - Purchase order date
   * @returns {Promise<Object>} Created invoice
   */
  create: async (invoiceData) => {
    const response = await apiClient.post('/invoices', invoiceData);
    return response;
  },
  
  /**
   * Update an existing invoice
   * Note: Only DRAFT invoices can be fully updated.
   * For other statuses, only status and statusNote can be updated.
   * @param {string} id - Invoice ID
   * @param {Object} invoiceData - Invoice data to update
   * @returns {Promise<Object>} Updated invoice
   */
  update: async (id, invoiceData) => {
    const response = await apiClient.put(`/invoices/${id}`, invoiceData);
    return response;
  },
  
  /**
   * Delete an invoice (soft delete)
   * Note: Only DRAFT invoices can be deleted
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response;
  },
};

