import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@api';


/**
 * Hook for fetching multiple products with filtering and pagination
 */
export const useProducts = (initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    ...initialParams
  });

  const query = useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      // Logic to switch between search and regular fetch based on 'q'
      const response = params.q 
        ? await productsApi.search(params)
        : await productsApi.getAll(params);
        
      return {
        products: response?.products || [],
        pagination: response?.pagination || { totalPages: 1, page: 1 },
      };
    },
    // Keeps previous data visible while fetching new page (better UX)
    placeholderData: (previousData) => previousData, 
  });

  // Manual trigger helpers that match your screen's expectations
  const fetchProducts = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams, q: undefined }));
  }, []);

  const searchProducts = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    products: query.data?.products ?? [],
    pagination: query.data?.pagination ?? {},
    loading: query.isLoading || query.isFetching,
    error: query.error,
    fetchProducts,  // Now these are actual functions!
    searchProducts, // Now these are actual functions!
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching featured products
 */
export const useFeaturedProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', 'featured', params],
    queryFn: () => productsApi.getFeatured(params),
  });
};

/**
 * Hook for fetching a single product by its ID
 */
export const useProduct = (id, params = {}) => {
  return useQuery({
    queryKey: ['product', id, params],
    queryFn: () => productsApi.getById(id, params),
    enabled: !!id,
  });
};

/**
 * Hook for searching products
 */
export const useSearchProducts = (queryParams = {}) => {
  return useQuery({
    queryKey: ['products', 'search', queryParams],
    queryFn: async () => {
      const response = await productsApi.search(queryParams);
      return {
        products: response.products || [],
        pagination: response.pagination || {},
      };
    },
    enabled: !!queryParams.q,
  });
};
