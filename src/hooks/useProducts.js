import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api';

/**
 * Hook for fetching multiple products with filtering and pagination
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await productsApi.getAll(params);
      return {
        products: response.products || [],
        pagination: response.pagination || {},
      };
    },
  });
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
