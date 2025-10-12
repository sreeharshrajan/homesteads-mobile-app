import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication headers
apiClient.interceptors.request.use(
  async (requestConfig) => {
    try {
      // Skip authorization header for login endpoint
      if (requestConfig.url?.includes('/auth/login')) {
        return requestConfig;
      }
      
      // For admin-specific endpoints (like /admin/api-keys), use session token
      if (requestConfig.url?.includes('/admin/')) {
        const sessionToken = await AsyncStorage.getItem('authToken');
        if (sessionToken) {
          requestConfig.headers.Authorization = `Bearer ${sessionToken}`;
        }
      } else {
        // For REST API endpoints (customers, invoices, orders, etc.), use API key
        const apiKey = config.api.apiKey;
        if (apiKey) {
          requestConfig.headers.Authorization = `Bearer ${apiKey}`;
        } else {
          console.warn('No API key configured for request:', requestConfig.url);
        }
      }
    } catch (error) {
      console.error('Error setting authorization header:', error);
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from the success response format: { success: true, data: {...} }
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    // Log detailed error information for debugging
    console.log('=== API Error Debug Info ===');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Request URL:', error.config?.url);
    console.log('Request method:', error.config?.method);
    console.log('Request data:', JSON.stringify(error.config?.data));
    console.log('Request headers:', JSON.stringify(error.config?.headers));
    console.log('Response status:', error.response?.status);
    console.log('Response data:', JSON.stringify(error.response?.data));
    console.log('Response headers:', JSON.stringify(error.response?.headers));
    console.log('Is network error:', error.message === 'Network Error');
    console.log('===========================');
    
    if (error.response?.status === 401) {
      // Token expired, invalid, or missing - clear all auth storage
      console.log('401 Unauthorized - clearing auth storage');
      await AsyncStorage.multiRemove(['authToken', 'sessionId', 'user', 'admin', 'role']);
      // You can add navigation to login here if needed
    }
    
    // Format error response
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    const errorDetails = error.response?.data?.details;
    
    return Promise.reject({
      message: errorMessage,
      details: errorDetails,
      status: error.response?.status,
      originalError: error.message,
    });
  }
);

export default apiClient;

