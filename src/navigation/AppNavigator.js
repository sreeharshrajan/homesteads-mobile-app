import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { IconButton } from 'react-native-paper';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../utils/constants';
import CustomDrawer from '../components/CustomDrawer';

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
const Drawer = createDrawerNavigator();

// Dashboard Stack Navigator
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={({ navigation }) => ({
        title: 'Dashboard',
        headerLeft: () => (
          <IconButton
            icon="menu"
            size={24}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

// Customer Stack Navigator
const CustomerStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="CustomerListMain" 
      component={CustomerListScreen}
      options={({ navigation }) => ({
        title: 'Customers',
        headerLeft: () => (
          <IconButton
            icon="menu"
            size={24}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <Stack.Screen 
      name={ROUTES.CUSTOMER_FORM} 
      component={CustomerFormScreen}
      options={{ title: 'Customer Form' }}
    />
  </Stack.Navigator>
);

// Billing Stack Navigator
const BillingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="BillingMain" 
      component={BillingScreen}
      options={({ navigation }) => ({
        title: 'Billing & Invoices',
        headerLeft: () => (
          <IconButton
            icon="menu"
            size={24}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <Stack.Screen 
      name={ROUTES.INVOICE} 
      component={InvoiceScreen}
      options={{ title: 'Invoice Details' }}
    />
    <Stack.Screen 
      name={ROUTES.INVOICE_CUSTOMER_SELECT} 
      component={InvoiceCustomerSelectScreen}
      options={{ title: 'Select Customer' }}
    />
    <Stack.Screen 
      name={ROUTES.INVOICE_PRODUCT_SELECT} 
      component={InvoiceProductSelectScreen}
      options={{ title: 'Select Products' }}
    />
    <Stack.Screen 
      name={ROUTES.INVOICE_DISCOUNT} 
      component={InvoiceDiscountScreen}
      options={{ title: 'Apply Discount' }}
    />
    <Stack.Screen 
      name={ROUTES.INVOICE_REVIEW} 
      component={InvoiceReviewScreen}
      options={{ title: 'Review Invoice' }}
    />
  </Stack.Navigator>
);

// Orders Stack Navigator
const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="OrdersMain" 
      component={OrderListScreen}
      options={({ navigation }) => ({
        title: 'Orders',
        headerLeft: () => (
          <IconButton
            icon="menu"
            size={24}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <Stack.Screen 
      name={ROUTES.ORDER_DETAIL} 
      component={OrderDetailScreen}
      options={{ title: 'Order Details' }}
    />
  </Stack.Navigator>
);

// API Keys Stack Navigator
const ApiKeysStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="ApiKeysMain" 
      component={ApiKeysScreen}
      options={({ navigation }) => ({
        title: 'API Keys',
        headerLeft: () => (
          <IconButton
            icon="menu"
            size={24}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <Stack.Screen 
      name={ROUTES.API_KEY_FORM} 
      component={ApiKeyFormScreen}
      options={{ title: 'API Key Form' }}
    />
  </Stack.Navigator>
);

// Main Drawer Navigator
const DrawerNavigator = () => {
  const { admin } = useAuthStore();
  const isSuperuser = admin?.is_superuser || false;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
      initialRouteName={ROUTES.DASHBOARD}
    >
      <Drawer.Screen 
        name={ROUTES.DASHBOARD} 
        component={DashboardStack}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="view-dashboard" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name={ROUTES.CUSTOMER_LIST} 
        component={CustomerStack}
        options={{
          drawerLabel: 'Customers',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="account-group" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name={ROUTES.BILLING} 
        component={BillingStack}
        options={{
          drawerLabel: 'Billing',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="file-document" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name={ROUTES.ORDERS} 
        component={OrdersStack}
        options={{
          drawerLabel: 'Orders',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="package-variant" size={size} iconColor={color} />
          ),
        }}
      />
      {isSuperuser && (
        <Drawer.Screen 
          name={ROUTES.API_KEYS} 
          component={ApiKeysStack}
          options={{
            drawerLabel: 'API Keys',
            drawerIcon: ({ color, size }) => (
              <IconButton icon="key" size={size} iconColor={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

// Root Navigator
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
          // Main app with drawer
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
