import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../utils/constants';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import BillingScreen from '../screens/BillingScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import InvoiceCustomerSelectScreen from '../screens/InvoiceCustomerSelectScreen';
import InvoiceProductSelectScreen from '../screens/InvoiceProductSelectScreen';
import InvoiceDiscountScreen from '../screens/InvoiceDiscountScreen';
import InvoiceReviewScreen from '../screens/InvoiceReviewScreen';
import OrderListScreen from '../screens/OrderListScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ApiKeysScreen from '../screens/ApiKeysScreen';
import ApiKeyFormScreen from '../screens/ApiKeyFormScreen';
import LoadingScreen from '../components/LoadingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Initializing..." />;
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
            {/* Dashboard */}
            <Stack.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} />
            
            {/* Customer Management */}
            <Stack.Screen name={ROUTES.CUSTOMER_LIST} component={CustomerListScreen} />
            <Stack.Screen name={ROUTES.CUSTOMER_FORM} component={CustomerFormScreen} />
            
            {/* Invoice Management */}
            <Stack.Screen name={ROUTES.BILLING} component={BillingScreen} />
            <Stack.Screen name={ROUTES.INVOICE} component={InvoiceScreen} />
            
            {/* Invoice Creation Flow */}
            <Stack.Screen name={ROUTES.INVOICE_CUSTOMER_SELECT} component={InvoiceCustomerSelectScreen} />
            <Stack.Screen name={ROUTES.INVOICE_PRODUCT_SELECT} component={InvoiceProductSelectScreen} />
            <Stack.Screen name={ROUTES.INVOICE_DISCOUNT} component={InvoiceDiscountScreen} />
            <Stack.Screen name={ROUTES.INVOICE_REVIEW} component={InvoiceReviewScreen} />
            
            {/* Order Management */}
            <Stack.Screen name={ROUTES.ORDERS} component={OrderListScreen} />
            <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
            
            {/* API Key Management (Super Admin Only) */}
            <Stack.Screen name={ROUTES.API_KEYS} component={ApiKeysScreen} />
            <Stack.Screen name={ROUTES.API_KEY_FORM} component={ApiKeyFormScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

