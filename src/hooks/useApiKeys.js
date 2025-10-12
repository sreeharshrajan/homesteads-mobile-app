import { useState, useCallback } from 'react';
import { apiKeysApi } from '../api';

/**
 * Custom hook for managing API keys (super-admin only)
 */
export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all API keys
   */
  const fetchApiKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiKeysApi.getAll();
      setApiKeys(response || []);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch API keys';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new API key
   */
  const createApiKey = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiKeysApi.create(data);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create API key';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing API key
   */
  const updateApiKey = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiKeysApi.update(id, data);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update API key';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete API key
   */
  const deleteApiKey = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiKeysApi.delete(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete API key';
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
    setApiKeys([]);
    setError(null);
  }, []);

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    reset,
  };
};

