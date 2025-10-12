import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../utils/constants';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import BillingScreen from '../screens/BillingScreen';
import InvoiceScreen from '../screens/InvoiceScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    // You can replace this with a proper loading screen/splash screen
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth screens
          <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        ) : (
          // Main app screens
          <>
            <Stack.Screen name={ROUTES.CUSTOMER_LIST} component={CustomerListScreen} />
            <Stack.Screen name={ROUTES.CUSTOMER_FORM} component={CustomerFormScreen} />
            <Stack.Screen name={ROUTES.BILLING} component={BillingScreen} />
            <Stack.Screen name={ROUTES.INVOICE} component={InvoiceScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

