import { useState, useCallback } from 'react';
import { dashboardApi } from '../api';

/**
 * Custom hook for managing dashboard data
 */
export const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch dashboard data
   */
  const fetchDashboard = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getDashboard(params);
      setDashboard(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setDashboard(null);
    setError(null);
  }, []);

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
    reset,
  };
};

