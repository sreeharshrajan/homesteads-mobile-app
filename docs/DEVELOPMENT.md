# Development Guide

## Quick Start

1. **Start the development server:**

   ```bash
   cd homesteads-viands-app
   npx expo start
   ```

2. **Run on device/emulator:**
   - Press `a` for Android
   - Press `i` for iOS (macOS only)
   - Scan QR code with Expo Go app

## Project Architecture

### State Management

- **Zustand** for global state (auth)
- **React hooks** for local component state
- **Custom hooks** for API data fetching

### Navigation Flow

```
Login Screen
    ↓ (after authentication)
Customer List Screen
    ├→ Customer Form Screen (create/edit)
    ├→ Billing Screen
    │   └→ Invoice Screen (details)
    └→ Invoice Screen (create)
```

### API Integration

All API calls go through the centralized Axios client (`src/api/client.js`) which:

- Automatically adds JWT token to requests
- Handles 401 errors (token expiration)
- Provides consistent error handling

#### Connecting to Real APIs

1. **Update the base URL** in `src/api/client.js`:

   ```javascript
   const BASE_URL = 'https://your-actual-api.com';
   ```

2. **Adjust API response structure** in endpoint files if your API returns different formats

3. **Update screens** to use real data instead of sample data:

   ```javascript
   // Current (sample data):
   const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS);
   
   // Replace with (real API):
   import { useCustomers } from '@hooks/useCustomers';
   const { customers, loading, error } = useCustomers();
   ```

## Code Organization

### Adding a New Feature

**Example: Adding a "Products" feature**

1. **Create API endpoints** (`src/api/products.js`):

   ```javascript
   import apiClient from './client';
   
   export const productsApi = {
     getAll: async () => {
       const response = await apiClient.get('/products');
       return response.data;
     },
     // ... other methods
   };
   ```

2. **Create a custom hook** (`src/hooks/useProducts.js`):

   ```javascript
   import { useState, useEffect } from 'react';
   import { productsApi } from '@api/products';
   
   export const useProducts = () => {
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(false);
     
     const fetchProducts = async () => {
       setLoading(true);
       try {
         const data = await productsApi.getAll();
         setProducts(data);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     
     useEffect(() => {
       fetchProducts();
     }, []);
     
     return { products, loading, refetch: fetchProducts };
   };
   ```

3. **Create the screen** (`src/screens/ProductListScreen.js`)

4. **Add route** in `src/utils/constants.js`:

   ```javascript
   export const ROUTES = {
     // ... existing routes
     PRODUCT_LIST: 'ProductList',
   };
   ```

5. **Register in navigation** (`src/navigation/AppNavigator.js`):

   ```javascript
   import ProductListScreen from '@screens/ProductListScreen';
   
   // Inside authenticated stack:
   <Stack.Screen name={ROUTES.PRODUCT_LIST} component={ProductListScreen} />
   ```

## Common Tasks

### Adding a New Input Field

Use Formik + Yup for form management:

```javascript
// 1. Update validation schema
const Schema = Yup.object().shape({
  existingField: Yup.string().required(),
  newField: Yup.string().required('New field is required'),
});

// 2. Add to initial values
const initialValues = {
  existingField: '',
  newField: '',
};

// 3. Add input component
<TextInput
  label="New Field"
  mode="outlined"
  value={values.newField}
  onChangeText={handleChange('newField')}
  onBlur={handleBlur('newField')}
  error={touched.newField && errors.newField}
/>
<HelperText type="error" visible={touched.newField && errors.newField}>
  {errors.newField}
</HelperText>
```

### Adding Authentication Guards

The app automatically handles authentication through the navigator. Authenticated users see the main app, unauthenticated users see the login screen.

To manually check auth state in a component:

```javascript
import useAuthStore from '@store/authStore';

const MyComponent = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Text>Please log in</Text>;
  }
  
  return <Text>Welcome {user.name}</Text>;
};
```

### Formatting Data

Use the formatter utilities in `src/utils/formatters.js`:

```javascript
import { formatCurrency, formatDate, formatPhoneNumber } from '@utils/formatters';

formatCurrency(1234.56);           // "$1,234.56"
formatDate('2025-10-12');          // "Oct 12, 2025"
formatPhoneNumber('5551234567');   // "(555) 123-4567"
```

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] View customer list
- [ ] Search customers
- [ ] Create new customer
- [ ] Edit existing customer
- [ ] View billing records
- [ ] View invoice details
- [ ] Logout functionality
- [ ] Token persistence (close and reopen app)

### Testing Login Flow (Development)

Since you're using sample data, the login screen posts to the API but won't work until connected to a real backend. For development testing:

**Option 1: Mock the API call**
Temporarily modify `src/store/authStore.js`:

```javascript
login: async (email, password) => {
  // Mock successful login for testing
  const mockResponse = {
    token: 'mock-jwt-token',
    user: { id: 1, name: 'Test User', email: email }
  };
  
  await AsyncStorage.setItem('authToken', mockResponse.token);
  await AsyncStorage.setItem('user', JSON.stringify(mockResponse.user));
  
  set({ token: mockResponse.token, user: mockResponse.user, isAuthenticated: true });
  return { success: true };
},
```

**Option 2: Use a mock API**
Set up a mock API server using tools like:

- [JSON Server](https://github.com/typicode/json-server)
- [Mockoon](https://mockoon.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

## Debugging

### Common Issues

**1. "Network Error" when calling API**

- Check that your API URL is correct
- Ensure your device/emulator can reach the API
- For localhost APIs, use your computer's IP address, not `localhost`

**2. "Token not found" errors**

- Clear AsyncStorage: Add temporary debug code

  ```javascript
  import AsyncStorage from '@react-native-async-storage/async-storage';
  await AsyncStorage.clear();
  ```

**3. Navigation errors**

- Ensure all routes are defined in `src/utils/constants.js`
- Check that screens are properly registered in the navigator

### Expo DevTools

Access helpful tools:

- **Console**: View logs and errors
- **Component Inspector**: Inspect React components
- **Performance Monitor**: Check app performance

## Performance Optimization

### Best Practices Implemented

1. **FlatList for long lists** (already used in CustomerListScreen)
2. **Memoization ready** - use `React.memo()` for expensive components
3. **Lazy loading** - only load data when needed
4. **Optimistic updates** - update UI before API confirms

### Future Optimizations

- Add pagination for large datasets
- Implement virtual scrolling for very long lists
- Add image optimization with `expo-image`
- Cache API responses with React Query or SWR

## Environment Variables

For production, use `expo-constants` for environment variables:

1. Install: `npx expo install expo-constants`

2. Create `app.config.js`:

   ```javascript
   export default {
     expo: {
       extra: {
         apiUrl: process.env.API_URL || 'https://api.example.com',
       },
     },
   };
   ```

3. Access in code:

   ```javascript
   import Constants from 'expo-constants';
   const apiUrl = Constants.expoConfig.extra.apiUrl;
   ```

## Building for Production

### Android

```bash
# Build APK
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

### iOS

```bash
# Build for TestFlight
eas build --platform ios --profile production
```

Note: You'll need to set up EAS (Expo Application Services) first:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

## Code Style

- Use functional components with hooks
- Follow the existing folder structure
- Keep components small and focused
- Add comments for complex logic
- Use destructuring for cleaner code
- Prefer `const` over `let`

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-products

# Make changes and commit
git add .
git commit -m "Add products feature"

# Push to remote
git push origin feature/add-products

# Create pull request on GitHub/GitLab
```

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Formik Documentation](https://formik.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Support

For questions or issues, contact the development team or create an issue in the project repository.
