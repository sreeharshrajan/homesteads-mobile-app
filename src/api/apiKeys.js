import apiClient from './client';

/**
 * API Keys API
 *
 * Provides methods for managing API keys (super-admin only).
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const apiKeysApi = {
  /**
   * List all API keys
   * @returns {Promise<Array>} API keys list
   */
  getAll: async () => {
    const response = await apiClient.get('/admin/api-keys');
    return response;
  },

  /**
   * Create a new API key
   * @param {Object} data - API key data
   * @param {string} data.name - API key name (required)
   * @param {Array<string>} data.permissions - Permission scopes (required)
   * @param {string} data.expiresAt - Expiration date (ISO 8601)
   * @returns {Promise<Object>} Created API key with secret key
   */
  create: async (data) => {
    const response = await apiClient.post('/admin/api-keys', data);
    return response;
  },

  /**
   * Update an API key
   * @param {string} id - API key ID
   * @param {Object} data - Updated API key data
   * @param {string} data.name - API key name
   * @param {Array<string>} data.permissions - Permission scopes
   * @param {boolean} data.isActive - Active status
   * @returns {Promise<Object>} Updated API key
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/admin/api-keys/${id}`, data);
    return response;
  },

  /**
   * Delete an API key
   * @param {string} id - API key ID
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/admin/api-keys/${id}`);
    return response;
  },

  /**
   * Available permissions
   */
  PERMISSIONS: {
    INVOICES_READ: 'invoices:read',
    INVOICES_CREATE: 'invoices:create',
    INVOICES_UPDATE: 'invoices:update',
    INVOICES_DELETE: 'invoices:delete',
    CUSTOMERS_READ: 'customers:read',
    CUSTOMERS_CREATE: 'customers:create',
    CUSTOMERS_UPDATE: 'customers:update',
    CUSTOMERS_DELETE: 'customers:delete',
    ADMIN: 'admin',
    ALL: '*',
  },

  /**
   * Get permission display info
   * @param {string} permission - Permission code
   * @returns {Object} Permission display info
   */
  getPermissionInfo: (permission) => {
    const permissionMap = {
      'invoices:read': { label: 'View Invoices', category: 'Invoices' },
      'invoices:create': { label: 'Create Invoices', category: 'Invoices' },
      'invoices:update': { label: 'Update Invoices', category: 'Invoices' },
      'invoices:delete': { label: 'Delete Invoices', category: 'Invoices' },
      'customers:read': { label: 'View Customers', category: 'Customers' },
      'customers:create': { label: 'Create Customers', category: 'Customers' },
      'customers:update': { label: 'Update Customers', category: 'Customers' },
      'customers:delete': { label: 'Delete Customers', category: 'Customers' },
      admin: { label: 'Full Admin Access', category: 'Admin' },
      '*': { label: 'All Permissions', category: 'Admin' },
    };
    return permissionMap[permission] || { label: permission, category: 'Other' };
  },
};
