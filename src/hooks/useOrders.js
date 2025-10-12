import { useState, useCallback } from 'react';
import { ordersApi } from '../api';

/**
 * Custom hook for managing orders (read-only)
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [stats, setStats] = useState(null);

  /**
   * Fetch orders with filters
   */
  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getAll(params);
      setOrders(response.orders || []);
      setPagination(response.pagination || {});
      setStats(response.stats || null);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single order by ID
   */
  const fetchOrderById = useCallback(async (orderId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getById(orderId, params);
      setOrder(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch order';
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
    setOrders([]);
    setOrder(null);
    setError(null);
    setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    setStats(null);
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    pagination,
    stats,
    fetchOrders,
    fetchOrderById,
    reset,
  };
};

