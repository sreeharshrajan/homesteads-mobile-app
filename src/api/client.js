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

// Request interceptor to add API key to headers
apiClient.interceptors.request.use(
  async (requestConfig) => {
    try {
      // Skip authorization header for login endpoint (returns JWT token)
      if (requestConfig.url?.includes('/store/auth/login')) {
        console.log('=== Login Request Debug ===');
        console.log('URL:', requestConfig.url);
        console.log('Method:', requestConfig.method);
        console.log('Headers:', JSON.stringify(requestConfig.headers));
        console.log('Data:', JSON.stringify(requestConfig.data));
        console.log('=========================');
        return requestConfig;
      }
      
      // For other endpoints, use JWT token from storage (not API key)
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
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
      // Token expired or invalid - clear storage
      await AsyncStorage.removeItem('authToken');
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

