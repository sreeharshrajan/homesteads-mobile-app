# API Integration Guide

This document describes how the Homesteads Viands mobile app integrates with the REST API at `https://admin.homesteadsviands.com/api`.

## Overview

The mobile app uses a centralized API client architecture with the following components:

- **API Client** (`src/api/client.js`) - Base axios client with interceptors
- **Configuration** (`src/config/index.js`) - Centralized app configuration
- **API Modules** - Specialized modules for different resources

## Configuration

The API base URL is configured in `src/config/index.js`:

```javascript
api: {
  baseURL: 'https://admin.homesteadsviands.com/api',
  timeout: 15000,
}
```

## API Client Architecture

### Request Interceptor

The request interceptor automatically adds the authentication token to all requests:

```javascript
config.headers.Authorization = `Bearer ${token}`;
```

The token is stored in `AsyncStorage` under the key `authToken`.

### Response Interceptor

The response interceptor handles two main concerns:

1. **Success Response Extraction**: Automatically extracts data from the API's response format
   ```javascript
   // API returns: { success: true, data: {...} }
   // Interceptor returns: {...} (just the data)
   ```

2. **Error Handling**: Formats error responses consistently
   ```javascript
   {
     message: "Error message",
     details: [...], // Optional validation errors
     status: 400
   }
   ```

## API Modules

### Authentication API (`src/api/auth.js`)

Handles user authentication:

```javascript
import { authApi } from './src/api/auth';

// Login
const user = await authApi.login('email@example.com', 'password');

// Get current user
const currentUser = await authApi.getCurrentUser();

// Logout
await authApi.logout();
```

### Invoices API (`src/api/invoices.js`)

Manages invoices with full CRUD operations and filtering:

```javascript
import { invoicesApi } from './src/api/invoices';

// List invoices with pagination and filters
const { invoices, pagination } = await invoicesApi.getAll({
  page: 1,
  limit: 20,
  status: 'PAID',
  customerId: 'cm...',
  dateFrom: '2025-01-01T00:00:00.000Z',
  dateTo: '2025-01-31T23:59:59.999Z',
  search: 'INV-2025',
  sortField: 'createdAt',
  sortDirection: 'desc'
});

// Get single invoice
const invoice = await invoicesApi.getById('cm...');

// Create invoice
const newInvoice = await invoicesApi.create({
  customerId: 'cm...',
  totalAmount: 5000.00,
  status: 'DRAFT'
});

// Update invoice
const updatedInvoice = await invoicesApi.update('cm...', {
  status: 'SENT',
  statusNote: 'Invoice sent to customer'
});

// Delete invoice (only DRAFT invoices)
await invoicesApi.delete('cm...');
```

### Customers API (`src/api/customers.js`)

Manages customers with full CRUD operations and filtering:

```javascript
import { customersApi } from './src/api/customers';

// List customers with pagination and filters
const { customers, pagination } = await customersApi.getAll({
  page: 1,
  limit: 20,
  isActive: true,
  search: 'acme',
  sortField: 'name',
  sortDirection: 'asc'
});

// Get single customer (includes orders and invoices)
const customer = await customersApi.getById('cm...');

// Create customer
const newCustomer = await customersApi.create({
  name: 'Acme Corporation',
  phone: '+1234567890',
  email: 'billing@acme.com',
  companyName: 'Acme Corp',
  gstNumber: '29ABCDE1234F1Z5',
  addresses: [
    {
      type: 'BOTH',
      line1: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      isDefault: true
    }
  ],
  contacts: [
    {
      name: 'John Doe',
      email: 'john@acme.com',
      phone: '+1234567891',
      designation: 'Accounts Manager',
      isPrimary: true
    }
  ]
});

// Update customer
const updatedCustomer = await customersApi.update('cm...', {
  email: 'newemail@acme.com'
});

// Delete customer
await customersApi.delete('cm...');
```

### Billing API (`src/api/billing.js`)

Manages billing records:

```javascript
import { billingApi } from './src/api/billing';

// Get all billing records
const billingRecords = await billingApi.getAll();

// Get billing record by ID
const billing = await billingApi.getById('cm...');

// Get billing records by customer
const customerBilling = await billingApi.getByCustomer('cm...');

// Create billing record
const newBilling = await billingApi.create(billingData);

// Update billing record
const updatedBilling = await billingApi.update('cm...', billingData);
```

## Error Handling

All API methods can throw errors with the following structure:

```javascript
try {
  const invoice = await invoicesApi.getById('invalid-id');
} catch (error) {
  console.error('Error message:', error.message);
  console.error('Status code:', error.status);
  
  // Handle validation errors
  if (error.details) {
    error.details.forEach(detail => {
      console.error(`${detail.path.join('.')}: ${detail.message}`);
    });
  }
  
  // Handle specific status codes
  if (error.status === 401) {
    // Token expired - redirect to login
  } else if (error.status === 404) {
    // Resource not found
  }
}
```

## Response Formats

### List Endpoints

All list endpoints return paginated data:

```javascript
{
  invoices: [...],  // or customers, billingRecords, etc.
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

### Single Resource Endpoints

Single resource endpoints return the resource directly:

```javascript
{
  id: "cm...",
  name: "...",
  // ... other fields
}
```

## Authentication Flow

1. **Login**: Call `authApi.login()` with credentials
2. **Store Token**: Token is automatically stored in AsyncStorage by the login response handler
3. **Authenticated Requests**: Token is automatically added to all subsequent requests
4. **Token Expiry**: On 401 response, token is cleared and user needs to re-login
5. **Logout**: Call `authApi.logout()` to invalidate the session

## Best Practices

### 1. Error Handling

Always wrap API calls in try-catch blocks:

```javascript
try {
  const data = await invoicesApi.getAll();
  // Handle success
} catch (error) {
  // Handle error
  Alert.alert('Error', error.message);
}
```

### 2. Loading States

Show loading indicators during API calls:

```javascript
const [loading, setLoading] = useState(false);

const fetchInvoices = async () => {
  setLoading(true);
  try {
    const data = await invoicesApi.getAll();
    setInvoices(data.invoices);
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. Pagination

Implement infinite scroll or pagination for list views:

```javascript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  if (!hasMore) return;
  
  const { invoices, pagination } = await invoicesApi.getAll({ 
    page: page + 1 
  });
  
  setPage(page + 1);
  setHasMore(pagination.page < pagination.totalPages);
  // Append to existing data
};
```

### 4. Search and Filtering

Debounce search input to avoid excessive API calls:

```javascript
import { debounce } from 'lodash';

const searchCustomers = debounce(async (searchTerm) => {
  const { customers } = await customersApi.getAll({ 
    search: searchTerm,
    page: 1 
  });
  setCustomers(customers);
}, 500);
```

### 5. Optimistic Updates

Update UI immediately and rollback on error:

```javascript
const updateInvoiceStatus = async (invoiceId, newStatus) => {
  // Optimistic update
  const oldInvoice = invoice;
  setInvoice({ ...invoice, status: newStatus });
  
  try {
    await invoicesApi.update(invoiceId, { status: newStatus });
  } catch (error) {
    // Rollback on error
    setInvoice(oldInvoice);
    Alert.alert('Error', error.message);
  }
};
```

## Testing

### Manual Testing

Use the mobile app to test API integration:

1. Start the app: `npm start`
2. Login with valid credentials
3. Navigate through different screens
4. Test CRUD operations
5. Verify error handling

### API Testing with curl

Test endpoints directly using curl (see REST_API.md for examples).

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Token expired or invalid
   - Clear AsyncStorage and login again
   - Check if token is being sent in request headers

2. **Network Request Failed**
   - Check internet connection
   - Verify API base URL in config
   - Check if API server is running

3. **Validation Errors (400)**
   - Check request payload format
   - Verify required fields are included
   - Check error.details for specific field errors

4. **404 Not Found**
   - Verify the resource ID is correct
   - Check if resource was deleted
   - Ensure endpoint path is correct

## Environment-Specific Configuration

For different environments (development, staging, production), update the base URL in config:

```javascript
// Development
api: {
  baseURL: 'http://localhost:3000/api',
  timeout: 15000,
}

// Staging
api: {
  baseURL: 'https://staging.homesteadsviands.com/api',
  timeout: 15000,
}

// Production
api: {
  baseURL: 'https://admin.homesteadsviands.com/api',
  timeout: 15000,
}
```

## Next Steps

1. Implement offline mode with local caching
2. Add retry logic for failed requests
3. Implement request queueing for offline operations
4. Add request cancellation for unmounted components
5. Implement webhook support for real-time updates

## Support

For technical support:
- Email: sreeharshkrajan@gmail.com
- API Documentation: See `REST_API.md`
- Admin Panel: https://admin.homesteadsviands.com

---

© 2024 Homesteads Viands. All rights reserved.

