import apiClient from './client';

/**
 * Dashboard API
 *
 * Provides methods for fetching admin dashboard data.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const dashboardApi = {
  /**
   * Get admin dashboard data
   * @param {Object} params - Query parameters
   * @param {string} params.timeRange - Time range filter: today, week, month, year (default: today)
   * @returns {Promise<Object>} Dashboard data including stats, analytics, activities, and alerts
   */
  getDashboard: async (params = {}) => {
    const { timeRange = 'today' } = params;
    const response = await apiClient.get('/admin/dashboard', {
      params: { timeRange },
    });
    return response;
  },
};
