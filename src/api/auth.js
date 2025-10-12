import apiClient from './client';

/**
 * Authentication API
 * 
 * Provides methods for user authentication.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const authApi = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and authentication token
   */
  login: async (email, password) => {
    const response = await apiClient.post('/store/auth/login', { email, password });
    return response;
  },
  
  /**
   * Logout current user
   * @returns {Promise<Object>} Success message
   */
  logout: async () => {
    const response = await apiClient.post('/store/auth/logout');
    return response;
  },
  
  /**
   * Get current authenticated user
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/store/auth/me');
    return response;
  },
};

