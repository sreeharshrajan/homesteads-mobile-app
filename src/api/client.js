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
      // Use API key from config for authentication
      if (config.api.apiKey) {
        requestConfig.headers.Authorization = `Bearer ${config.api.apiKey}`;
      } else {
        // Fallback to JWT token from storage if API key is not configured
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
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
    });
  }
);

export default apiClient;

