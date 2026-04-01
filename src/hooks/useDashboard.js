import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@api';

/**
 * Custom hook for managing dashboard data using TanStack Query
 */
export const useDashboard = (params = {}) => {
  const { 
    data: dashboard, 
    isLoading: loading, 
    error, 
    refetch: fetchDashboard 
  } = useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardApi.getDashboard(params),
    // Standardizing on 5 minutes stale time as defined in App.js defaultOptions
    // but allowing per-hook overrides if needed.
  });

  return {
    dashboard,
    loading,
    error: error ? (error.message || 'Failed to fetch dashboard data') : null,
    fetchDashboard,
    // Note: React Query handles reset/invalidation automatically via queryKey
  };
};
