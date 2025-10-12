import { useState, useCallback } from 'react';
import { customersApi } from '../api/customers';

/**
 * Custom hook for managing customer data
 */
export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchCustomers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.getAll(params);
      setCustomers(data.customers || data);
      setPagination(data.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = async (customerData) => {
    try {
      const newCustomer = await customersApi.create(customerData);
      setCustomers((prev) => [...prev, newCustomer]);
      return { success: true, data: newCustomer };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create customer' };
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const updatedCustomer = await customersApi.update(id, customerData);
      setCustomers((prev) =>
        prev.map((customer) => (customer.id === id ? updatedCustomer : customer))
      );
      return { success: true, data: updatedCustomer };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update customer' };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customersApi.delete(id);
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete customer' };
    }
  };

  return {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

