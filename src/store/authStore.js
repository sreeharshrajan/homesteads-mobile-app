import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state from storage
  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userString = await AsyncStorage.getItem('user');
      
      if (token && userString) {
        const user = JSON.parse(userString);
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  // Login action
  login: async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await authApi.login(email, password);
      console.log('Login response received:', response);
      const { token, user } = response;

      // Store token and user data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ token, user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error('=== Login Error ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Original error:', error.originalError);
      console.error('==================');
      return { 
        success: false, 
        error: error.message || error.originalError || 'Login failed. Please check your network connection.' 
      };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  // Update user data
  setUser: (user) => set({ user }),
}));

export default useAuthStore;

