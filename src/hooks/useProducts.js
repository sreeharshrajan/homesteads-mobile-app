import { useState, useCallback } from 'react';
import { productsApi } from '../api';

/**
 * Custom hook for managing products
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  /**
   * Fetch products with filters
   */
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getAll(params);
      setProducts(response.products || []);
      setPagination(response.pagination || {});
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search products
   */
  const searchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.search(params);
      setProducts(response.products || []);
      setPagination(response.pagination || {});
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to search products';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single product by ID
   */
  const fetchProductById = useCallback(async (id, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getById(id, params);
      setProduct(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single product by slug
   */
  const fetchProductBySlug = useCallback(async (slug, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getBySlug(slug, params);
      setProduct(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch featured products
   */
  const fetchFeaturedProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getFeatured(params);
      setProducts(response || []);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch featured products';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch products by category
   */
  const fetchProductsByCategory = useCallback(async (categorySlug, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getByCategory(categorySlug, params);
      setProducts(response.products || []);
      setPagination(response.pagination || {});
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products';
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
    setProducts([]);
    setProduct(null);
    setError(null);
    setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }, []);

  return {
    products,
    product,
    loading,
    error,
    pagination,
    fetchProducts,
    searchProducts,
    fetchProductById,
    fetchProductBySlug,
    fetchFeaturedProducts,
    fetchProductsByCategory,
    reset,
  };
};

