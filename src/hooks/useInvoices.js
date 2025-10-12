import { useState, useCallback } from 'react';
import { invoicesApi } from '../api';

/**
 * Custom hook for managing invoices
 */
export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  /**
   * Fetch invoices with filters
   */
  const fetchInvoices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.getAll(params);
      setInvoices(response.invoices || []);
      setPagination(response.pagination || {});
      return { success: true, data: response };
    } catch (err) {
      let errorMessage = err.message || 'Failed to fetch invoices';
      
      // Provide more context for specific error types
      if (err.status === 500) {
        errorMessage = 'Server error while fetching invoices. Please try again later.';
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'You do not have permission to view invoices';
      }
      
      if (err.details) {
        errorMessage += ` (${err.details})`;
      }
      
      setError(errorMessage);
      // Don't clear the invoices list on error - keep showing existing data
      return { success: false, error: errorMessage, status: err.status };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single invoice by ID
   */
  const fetchInvoiceById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.getById(id);
      setInvoice(response);
      return { success: true, data: response };
    } catch (err) {
      let errorMessage = err.message || 'Failed to fetch invoice';
      
      // Provide more context for specific error types
      if (err.status === 404) {
        errorMessage = 'Invoice not found';
      } else if (err.status === 500) {
        errorMessage = 'Server error while fetching invoice. Please try again later.';
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'You do not have permission to view this invoice';
      }
      
      // Include details if available
      if (err.details) {
        errorMessage += ` (${err.details})`;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage, status: err.status };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new invoice
   */
  const createInvoice = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.create(data);
      return { success: true, data: response };
    } catch (err) {
      let errorMessage = err.message || 'Failed to create invoice';
      
      // Provide more context for specific error types
      if (err.status === 400) {
        errorMessage = err.message || 'Invalid invoice data';
      } else if (err.status === 500) {
        errorMessage = 'Server error while creating invoice. Please try again later.';
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'You do not have permission to create invoices';
      }
      
      if (err.details) {
        errorMessage += ` (${err.details})`;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage, status: err.status };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing invoice
   */
  const updateInvoice = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoicesApi.update(id, data);
      setInvoice(response);
      return { success: true, data: response };
    } catch (err) {
      let errorMessage = err.message || 'Failed to update invoice';
      
      // Provide more context for specific error types
      if (err.status === 404) {
        errorMessage = 'Invoice not found';
      } else if (err.status === 500) {
        errorMessage = 'Server error while updating invoice. Please try again later.';
      } else if (err.status === 400) {
        errorMessage = err.message || 'Invalid invoice data';
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'You do not have permission to update this invoice';
      }
      
      if (err.details) {
        errorMessage += ` (${err.details})`;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage, status: err.status };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete invoice
   */
  const deleteInvoice = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await invoicesApi.delete(id);
      return { success: true };
    } catch (err) {
      let errorMessage = err.message || 'Failed to delete invoice';
      
      // Provide more context for specific error types
      if (err.status === 404) {
        errorMessage = 'Invoice not found';
      } else if (err.status === 400) {
        errorMessage = err.message || 'Cannot delete this invoice';
      } else if (err.status === 500) {
        errorMessage = 'Server error while deleting invoice. Please try again later.';
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'You do not have permission to delete this invoice';
      }
      
      if (err.details) {
        errorMessage += ` (${err.details})`;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage, status: err.status };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setInvoices([]);
    setInvoice(null);
    setError(null);
    setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 });
  }, []);

  return {
    invoices,
    invoice,
    loading,
    error,
    pagination,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    reset,
  };
};

